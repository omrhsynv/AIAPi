# 1) Mimari ve Kurulum

## Amaç

Var olan **Assistant** (asistan) kayıtlarını, sohbet arayüzünün kullandığı aynı
altyapıyla ama tarayıcı oturumu olmadan, dışarıya bir **API endpoint'i** olarak
açmak. Dış istemciler bir API anahtarı ile asistanı programatik olarak çağırır.

## Genel akış

```
İstek → API anahtarını doğrula → asistanı çöz (id/slug) → izin kontrolü → OpenAI'ye akış
POST /api/v1/agents/:agent
   Authorization: Bearer <key>          (1) verifyApiKey
   :agent = id veya slug                (2) resolveAgent
                                        (3) izin: anahtar bu asistana bağlı mı?
   gövde: { message | messages }        (4) streamAgentResponse → chatStream
```

Bu yol **gecikmeye duyarlıdır**. Bu yüzden:

- OpenAI istemcisi tek sefer oluşturulur (`getOpenAI()` singleton), her istekte
  yeniden kurulmaz.
- Anahtar doğrulama ve asistan çözümü **bellekte (in-memory) TTL cache** ile
  tutulur → sıcak yolda **0 veritabanı sorgusu**.
- Soğuk yolda anahtar ve asistan sorguları **paralel** çalışır (`Promise.all`).
- Sadece gereken kolonlar `select` edilir.
- Yanıt **akış (stream)** olarak döner; tamponlanmaz.

## Dosya haritası

| Dosya | Görevi |
|-------|--------|
| `app/lib/agent-api.server.ts` | Çekirdek mantık: anahtar doğrulama, asistan çözümü, cache, izin verisi, OpenAI'ye akış. |
| `app/routes/api/v1/agents.tsx` | `POST /api/v1/agents/:agent` endpoint'i (resource route). |
| `app/routes/admin/api-keys.tsx` | Yönetim paneli: anahtar listesi/oluşturma/izinler. |
| `app/routes/api/admin/api-keys.tsx` | Anahtar oluşturma API'si (POST). |
| `app/routes/api/admin/api-key-detail.tsx` | Anahtar güncelle/sil API'si (PATCH/DELETE). |
| `app/routes/docs/agent-api.tsx` | Herkese açık canlı doküman sayfası `/docs/agent-api`. |
| `scripts/create-agent-key.ts` | Komut satırından anahtar üretme. |
| `public/agent-api.postman_collection.json` | İndirilebilir Postman koleksiyonu. |

## Veritabanı değişiklikleri

`prisma/schema.prisma` içinde:

### `ApiKey` modeli (yeni)

```prisma
model ApiKey {
  id         String      @id @default(cuid())
  name       String?     // insan-okur etiket, örn. "prod-entegrasyon"
  keyHash    String      @unique // sha256(rawKey) — arama bu kolondan yapılır
  keyPrefix  String      // ham anahtarın ilk karakterleri (sadece gösterim)
  revoked    Boolean     @default(false)
  lastUsedAt DateTime?
  createdAt  DateTime    @default(now())
  assistants Assistant[] // bu anahtarın çağırabileceği asistanlar (izin ilişkisi)
}
```

- Ham anahtar **yalnızca oluşturulurken bir kez** gösterilir; veritabanında
  sadece **sha256 hash'i** saklanır.
- `assistants` alanı, anahtar ile asistanlar arasında **çok-çoka (many-to-many)**
  ilişkidir. İzinler bu ilişkiden gelir — kod içinde sabit (hardcoded) değildir.

### `Assistant` modeline eklenen alanlar

```prisma
slug     String?  @unique  // API'de kullanılabilecek insan-dostu kimlik
apiKeys  ApiKey[]          // bu asistanı çağırabilen anahtarlar (ters ilişki)
```

- `slug` opsiyoneldir. Boşsa asistanın `id`'si kullanılır.

## Kurulum adımları

> Ortam değişkenleri (`.env`): `DATABASE_URL`, `OPENAI_API_KEY`, `APP_URL`,
> `BETTER_AUTH_SECRET`. `OPENAI_API_KEY` yoksa API, gerçek yanıt yerine bir
> **mock (sahte) akış** döndürür — böylece boru hattı anahtarsız da test edilebilir.

1. **Şemayı veritabanına uygula** (yeni `ApiKey` tablosu + ilişki tablosu):

   ```bash
   npx prisma db push
   # veya: npm run db:push
   ```

2. **Prisma istemcisini üret** (şema değiştiyse):

   ```bash
   npm run db:generate
   ```

3. **Uygulamayı başlat:**

   ```bash
   npm run dev      # http://localhost:5173
   ```

4. **Tip kontrolü** (route/tip değişikliğinden sonra):

   ```bash
   npm run typecheck
   ```

> **Uyarı:** `npm run dev` çalışırken Prisma istemcisini yeniden üretirseniz,
> geliştirme sunucusu eski istemciyi bellekte tutabilir. Bu durumda sunucuyu
> yeniden başlatın (gerekirse `rm -rf node_modules/.vite`).

## Cache davranışı

- TTL varsayılan **30 sn** (`AGENT_CACHE_TTL_MS` ile değiştirilebilir).
- Panelden yapılan **iptal / izin değişikliği / silme** işlemleri cache'i
  **anında** temizler (`invalidateKeyCache`) → değişiklik hemen geçerli olur.
- Veritabanına **doğrudan** (API'yi atlayarak) yapılan değişiklikler en fazla
  TTL kadar (30 sn) gecikmeyle yansır.
