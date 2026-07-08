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
5. [Kullanım Analitiği](./05-kullanim-analitigi.md) — token/erişim ölçümü,
   IP takibi, anahtar detay sayfasındaki grafikler, pasifize etme.
6. [AGORA — OpenAI Uyumlu](./06-agora-openai-uyumlu.md) — OpenAI Chat
   Completions biçiminde endpoint'ler, SSE akış formatı, OpenAI SDK ile kullanım.

## Bir bakışta

- **Endpoint (yerel):** `POST /api/v1/agents/:agent` (`:agent` = asistanın id'si veya slug'ı)
- **Endpoint (OpenAI uyumlu):** `POST /api/agora/chat/completions` ve
  `POST /api/agora/stream` (asistan gövdedeki `model` alanıyla seçilir)
- **Kimlik doğrulama:** `Authorization: Bearer <api_key>` (veya `x-api-key`)
- **Gövde:** `{ "message": "..." }` veya `{ "messages": [ ... ] }`
  (AGORA'da OpenAI biçimi: `{ "model": "...", "messages": [ ... ] }`)
- **Yanıt:** gerçek zamanlı akış (streaming) — v1'de `text/plain`,
  AGORA'da OpenAI SSE (`text/event-stream`)
- **İzin:** Her anahtar yalnızca **izinli olduğu** asistanları çağırabilir
  (veritabanı ilişkisiyle, hardcoded değil).

> Uygulama içindeki canlı doküman sayfası: **`/docs/agent-api`**
> (yönetim panelindeki asistan detayında "Dokümantasyon" butonu da buraya gider).
