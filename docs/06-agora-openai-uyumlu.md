# 6) AGORA — Agora.io Conversational AI için özel LLM

`v1/agents/:agent` düz metin akışı döndürür. **AGORA**, aynı kimlik doğrulama ve
izin modelini kullanan ama **Agora.io Conversational AI Engine**'in "özel LLM"
(custom LLM) sözleşmesine uyan bir katmandır.

Agora'nın sözleşmesi **birebir OpenAI Chat Completions protokolüdür**: istek
gövdesi OpenAI biçiminde gelir, yanıt SSE üzerinden `chat.completion.chunk`
olayları olarak akar ve `data: [DONE]` ile biter. Agora'nın kendi referans
sunucusu da OpenAI'ın parçasını olduğu gibi iletir
([kaynak](https://github.com/AgoraIO-Community/agora-convo-ai-custom-llm-express)).

> **Önemli:** `data: {"choices":[{"delta":{"content":"..."}}]}` gibi **sadeleştirilmiş**
> bir gövde Agora tarafından **ayrıştırılmaz**. Zarf (`id`/`object`/`created`/`model`)
> ve `finish_reason` alanları zorunludur. Bu yüzden çıktı tam OpenAI biçimindedir.

Bu aynı zamanda şu anlama gelir: **stok bir OpenAI SDK'sı** yalnızca base URL
değiştirilerek bu endpoint'lere yönlendirilebilir.

Fark: hedef asistan URL'de değil, **gövdedeki `model` alanında** (id veya slug)
belirtilir — çünkü Agora'nın istek başına sunduğu tek alan budur
(`llm.params.model`).

## İki endpoint

| Endpoint | Davranış |
|----------|----------|
| `POST /api/agora/chat/completions` | **Varsayılan:** tek parça JSON yanıt (`chat.completion`). `"stream": true` verilirse `chat.completion.chunk` SSE akışı döner. |
| `POST /api/agora/stream` | **Her zaman** SSE akışı döner; gövdedeki `stream` bayrağı yok sayılır. Biçim yukarıdakiyle **aynıdır**. Agora'nın `stream: true` göndereceğine güvenmek istemediğinizde bunu kullanın. |

Her ikisi de `POST`'tur ve v1 ile **aynı** kimlik doğrulama/izin/durum kodlarını
kullanır.

## Agora agent yapılandırması

Agent'ı başlatırken (`POST /api/conversational-ai-agent/v2/projects/{appid}/join`):

```json
{
  "llm": {
    "url": "https://sizin-sunucunuz/api/agora/chat/completions",
    "api_key": "sk_agent_xxxxxxxx",
    "params": { "model": "ustun-zeka" }
  }
}
```

- `url` — bu endpoint'in tam adresi.
- `api_key` — Agent API anahtarınız (`Authorization: Bearer` olarak gönderilir).
- `params.model` — hedef asistanın **id** veya **slug** değeri.

> Ağ gecikmesinin düşük olması (Agora ~100ms önerir) konuşma akıcılığı için
> önemlidir; endpoint bu nedenle akış tabanlı ve önbellekli tasarlanmıştır.

## Kimlik doğrulama

v1 ile aynı — anahtarı `Authorization: Bearer <key>` veya `x-api-key` ile gönderin.
Anahtar hangi asistanlara izinliyse yalnızca onların `model` değerini çağırabilir;
aksi halde `403` döner.

## İstek gövdesi

Agora'nın gönderdiği gövde (OpenAI alanları + Agora'ya özgü üç alan):

```json
{
  "model": "ustun-zeka",
  "messages": [
    { "role": "user", "content": "Merhaba" }
  ],
  "stream": true,
  "appId": "20b7c51ff4c644ab80cf5a4e646b0537",
  "channel": "default",
  "userId": "user123"
}
```

- `model` — **zorunlu.** Hedef asistanın **id** veya **slug** değeri. Boşsa `400`.
- `messages` — OpenAI biçimi. Yalnızca `user` ve `assistant` rolleri modele
  iletilir; **`system` mesajları yok sayılır** — asistanın panelde tanımlı kendi
  sistem talimatı kullanılır. (Agora'nın `llm.system_messages` ayarı da `system`
  turu olarak geldiği için yok sayılır.) Bağlam son 50 mesajla sınırlanır.
- `stream` — yalnızca `/chat/completions` için anlamlıdır (`true` → SSE,
  yoksa/`false` → JSON). `/stream` endpoint'i her zaman akıştır.
- `appId`, `channel`, `userId` — Agora gönderir; **kabul edilir ama kullanılmaz.**
  Bu sunucunun RTM/tool-calling entegrasyonu yoktur, yönlendirilecek bir şey yok.

> Not: `temperature`, `max_tokens` gibi diğer OpenAI parametreleri şu an
> **yok sayılır**; model ve talimatlar asistan yapılandırmasından gelir.
> Tool/function calling ve çok kipli (audio) çıktı **desteklenmez**.

## Akış (SSE) yanıtı

`Content-Type: text/event-stream`. Her parça bir `data:` satırıdır; akış
`data: [DONE]` ile biter. İlk parça `role`, son parça `finish_reason: "stop"`
taşır:

```
data: {"id":"chatcmpl-…","object":"chat.completion.chunk","created":1783594672,"model":"ustun-zeka","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-…","object":"chat.completion.chunk","created":1783594672,"model":"ustun-zeka","choices":[{"index":0,"delta":{"content":"Merhaba, "},"finish_reason":null}]}

data: {"id":"chatcmpl-…","object":"chat.completion.chunk","created":1783594672,"model":"ustun-zeka","choices":[{"index":0,"delta":{"content":"nasıl yardımcı olabilirim?"},"finish_reason":null}]}

data: {"id":"chatcmpl-…","object":"chat.completion.chunk","created":1783594672,"model":"ustun-zeka","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

Metin, `choices[0].delta.content` alanları sırayla birleştirilerek elde edilir.

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

### cURL — akış

```bash
curl -N http://localhost:5173/api/agora/chat/completions \
  -H "Authorization: Bearer sk_agent_xxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"model":"ustun-zeka","messages":[{"role":"user","content":"Merhaba"}],"stream":true}'
```

### cURL — `/stream` (bayrak gerekmez)

```bash
curl -N http://localhost:5173/api/agora/stream \
  -H "Authorization: Bearer sk_agent_xxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"model":"ustun-zeka","messages":[{"role":"user","content":"Merhaba"}]}'
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
