# 4) Postman ile Test

Hazır bir Postman koleksiyonu ile API'yi hızlıca deneyebilirsiniz.

## Koleksiyonu edinme

İki yoldan biri:

- **Uygulamadan indir:** `http://localhost:5173/agent-api.postman_collection.json`
  (doküman sayfasındaki **"Postman koleksiyonunu indir"** butonu da buraya gider).
- **Depodan:** `public/agent-api.postman_collection.json`

## İçe aktarma

1. Postman'de **Import** → dosyayı seçin (veya URL'i yapıştırın).
2. **ArisAI — Agent API** koleksiyonu eklenir.

## Değişkenleri ayarlama

Koleksiyona tıklayın → **Variables** sekmesi. Üç değişken vardır:

| Değişken | Varsayılan | Açıklama |
|----------|------------|----------|
| `baseUrl` | `http://localhost:5173` | İstek atılacak sunucu. Lokal için değiştirmenize gerek yok. |
| `apiKey`  | *(boş)* | **Sizin API anahtarınız.** Buraya yapıştırın. |
| `agent`   | `ustun-zeka` | Çağrılacak asistanın id'si veya slug'ı. |

- `apiKey` alanının **Current value** sütununa anahtarınızı yapıştırıp **Save**
  (Ctrl/Cmd+S) yapın. Tüm istekler otomatik olarak `Authorization: Bearer {{apiKey}}`
  gönderir.
- Anahtarınız yoksa: bkz. [API Anahtarları](./02-api-anahtarlari.md).

## İstekler

Koleksiyon şu istekleri içerir:

1. **Chat — tek mesaj** → `{ "message": "..." }` gönderir; `200` bekler.
2. **Chat — geçmiş ile** → `{ "messages": [...] }` gönderir; `200` bekler.
3. **Hata — anahtar eksik (401)** → bilerek anahtarsız gönderir; `401` bekler.
4. **Hata — bilinmeyen asistan (404)** → olmayan bir asistanı çağırır; `404` bekler.

Her isteğin **Tests** sekmesinde, dönen durum kodunu doğrulayan küçük bir test
betiği vardır (örn. `pm.test('200 OK', ...)`). Koleksiyon düzeyinde bir
**pre-request** betiği de `apiKey` boşsa konsola uyarı yazar.

## Çalıştırma

1. Uygulamanın çalıştığından emin olun (`npm run dev`).
2. `apiKey`'i ayarladıysanız **Chat — tek mesaj** isteğini açıp **Send**'e basın.
3. Yanıt gövdesinde asistanın (akış tamamlandıktan sonra) tam metnini görürsünüz.
4. **Runner** ile tüm koleksiyonu çalıştırıp test sonuçlarını topluca görebilirsiniz.

> Not: `apiKey` boşken istek atarsanız `401` alırsınız — bu beklenen davranıştır
> ("Hata — anahtar eksik (401)" isteği bunu test eder).
