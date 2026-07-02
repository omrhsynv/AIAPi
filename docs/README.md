# Agent API — Dokümantasyon

ArisAI asistanlarını, tarayıcı oturumu olmadan, dışarıdan **API ile** çağırmak
için gerekli her şey. Bu klasör adım adım Türkçe rehberler içerir.

## İçindekiler

1. [Mimari ve Kurulum](./01-mimari-ve-kurulum.md) — sistem nasıl çalışıyor,
   veritabanı değişiklikleri, kurulum adımları.
2. [API Anahtarları ve İzinler](./02-api-anahtarlari.md) — panelden ve komut
   satırından anahtar oluşturma, izin (permission) yönetimi.
3. [API Kullanımı](./03-api-kullanimi.md) — endpoint, istek/yanıt formatı,
   durum kodları, streaming, kod örnekleri.
4. [Postman](./04-postman.md) — hazır koleksiyonu içe aktarıp test etme.

## Bir bakışta

- **Endpoint:** `POST /api/v1/agents/:agent` (`:agent` = asistanın id'si veya slug'ı)
- **Kimlik doğrulama:** `Authorization: Bearer <api_key>` (veya `x-api-key`)
- **Gövde:** `{ "message": "..." }` veya `{ "messages": [ ... ] }`
- **Yanıt:** gerçek zamanlı akış (streaming) — `text/plain`
- **İzin:** Her anahtar yalnızca **izinli olduğu** asistanları çağırabilir
  (veritabanı ilişkisiyle, hardcoded değil).

> Uygulama içindeki canlı doküman sayfası: **`/docs/agent-api`**
> (yönetim panelindeki asistan detayında "Dokümantasyon" butonu da buraya gider).
