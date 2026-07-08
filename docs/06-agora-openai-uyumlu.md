# 6) AGORA — OpenAI Uyumlu Endpoint'ler

`v1/agents/:agent` düz metin akışı döndürür. **AGORA**, aynı kimlik doğrulama
ve izin modelini kullanan ama **OpenAI Chat Completions** biçiminde konuşan bir
katmandır. Amaç: mevcut OpenAI istemcilerini/SDK'larını **yalnızca base URL'i
değiştirerek** bu asistanlara yönlendirebilmek.

Fark: hedef asistan URL'de değil, **gövdedeki `model` alanında** (id veya slug)
belirtilir.

## İki endpoint

| Endpoint | Davranış |
|----------|----------|
| `POST /api/agora/chat/completions` | **Varsayılan:** tek parça JSON yanıt (`chat.completion`). `"stream": true` verilirse **tam OpenAI** `chat.completion.chunk` SSE akışı döner. |
| `POST /api/agora/stream` | **Her zaman** SSE akışı döner; ama **Agora.io için sadeleştirilmiş** biçimde — yalnızca `delta.content`, zarf (id/object/model/finish_reason) yok. Gövdedeki `stream` bayrağı yok sayılır. |

Her ikisi de `POST`'tur ve v1 ile **aynı** kimlik doğrulama/izin/durum kodlarını
kullanır.

## Kimlik doğrulama

v1 ile aynı — anahtarı `Authorization: Bearer <key>` veya `x-api-key` ile gönderin.
Anahtar hangi asistanlara izinliyse yalnızca onların `model` değerini çağırabilir;
aksi halde `403` döner.

## İstek gövdesi (OpenAI biçimi)

```json
{
  "model": "ustun-zeka",
  "messages": [
    { "role": "user", "content": "Merhaba" }
  ],
  "stream": true
}
```

- `model` — **zorunlu.** Hedef asistanın **id** veya **slug** değeri. Boşsa `400`.
- `messages` — OpenAI biçimi. Yalnızca `user` ve `assistant` rolleri modele
  iletilir; **`system` mesajları yok sayılır** — asistanın panelde tanımlı kendi
  sistem talimatı kullanılır. Bağlam son 50 mesajla sınırlanır.
- `stream` — yalnızca `/chat/completions` için anlamlıdır (`true` → SSE,
  yoksa/`false` → JSON). `/stream` endpoint'i her zaman akıştır.

> Not: `temperature`, `max_tokens` gibi diğer OpenAI parametreleri şu an
> **yok sayılır**; model ve talimatlar asistan yapılandırmasından gelir.

## Akış (SSE) yanıtı

`Content-Type: text/event-stream`. Her parça bir `data:` satırıdır; akış
`data: [DONE]` ile biter. **İki endpoint iki farklı biçim döndürür.**

### `/chat/completions` (`stream: true`) — tam OpenAI biçimi

```
data: {"id":"chatcmpl-…","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-…","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"Merhaba, "},"finish_reason":null}]}

data: {"id":"chatcmpl-…","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"nasıl yardımcı olabilirim?"},"finish_reason":null}]}

data: {"id":"chatcmpl-…","object":"chat.completion.chunk","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

### `/stream` — Agora.io sadeleştirilmiş biçim

Sadece `delta.content`; id/object/model/finish_reason **yoktur**:

```
data: {"choices":[{"delta":{"content":"Merhaba, "}}]}

data: {"choices":[{"delta":{"content":"nasıl "}}]}

data: {"choices":[{"delta":{"content":"yardımcı olabilirim?"}}]}

data: [DONE]
```

Her iki biçimde de metin, `choices[0].delta.content` alanları sırayla
birleştirilerek elde edilir.

## Akışsız (JSON) yanıtı

`/chat/completions` endpoint'ini `stream` olmadan çağırırsanız tek bir OpenAI
`chat.completion` nesnesi döner:

```json
{
  "id": "chatcmpl-…",
  "object": "chat.completion",
  "created": 1720000000,
  "model": "ustun-zeka",
  "choices": [
    {
      "index": 0,
      "message": { "role": "assistant", "content": "Merhaba! …" },
      "finish_reason": "stop"
    }
  ],
  "usage": { "prompt_tokens": 12, "completion_tokens": 34, "total_tokens": 46 }
}
```

## Örnekler

### cURL — akış (tam OpenAI)

```bash
curl -N http://localhost:5173/api/agora/chat/completions \
  -H "Authorization: Bearer sk_agent_xxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"model":"ustun-zeka","messages":[{"role":"user","content":"Merhaba"}],"stream":true}'
```

### cURL — `/stream` (Agora.io sade biçim)

```bash
curl -N http://localhost:5173/api/agora/stream \
  -H "Authorization: Bearer sk_agent_xxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"model":"ustun-zeka","messages":[{"role":"user","content":"Merhaba"}]}'
# → data: {"choices":[{"delta":{"content":"..."}}]}  (… data: [DONE] ile biter)
```

### cURL — akışsız (JSON)

```bash
curl http://localhost:5173/api/agora/chat/completions \
  -H "Authorization: Bearer sk_agent_xxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"model":"ustun-zeka","messages":[{"role":"user","content":"Merhaba"}]}'
```

### OpenAI SDK (JavaScript)

```js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "sk_agent_xxxxxxxx",              // Agent API anahtarınız
  baseURL: "http://localhost:5173/api/agora", // AGORA taban adresi
});

const stream = await client.chat.completions.create({
  model: "ustun-zeka",                       // asistan id veya slug
  messages: [{ role: "user", content: "Merhaba" }],
  stream: true,
});

for await (const part of stream) {
  process.stdout.write(part.choices[0]?.delta?.content ?? "");
}
```

### OpenAI SDK (Python)

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk_agent_xxxxxxxx",
    base_url="http://localhost:5173/api/agora",
)

stream = client.chat.completions.create(
    model="ustun-zeka",
    messages=[{"role": "user", "content": "Merhaba"}],
    stream=True,
)

for part in stream:
    print(part.choices[0].delta.content or "", end="", flush=True)
```

## Durum kodları

v1 ile aynıdır (bkz. [API Kullanımı](./03-api-kullanimi.md)):
`200` başarı · `400` geçersiz gövde ya da eksik `model` · `401` anahtar eksik/geçersiz ·
`403` iptal/izin yok/pasif asistan · `404` asistan bulunamadı · `405` POST değil ·
`500` sunucu/model hatası.

## Ölçümleme

AGORA çağrıları da diğerleri gibi **ölçülür** (token, IP, çağrı sayısı) ve anahtar
detay sayfasındaki grafiklerde görünür. Bkz. [Kullanım Analitiği](./05-kullanim-analitigi.md).
```
