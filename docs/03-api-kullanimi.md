# 3) API Kullanımı

## Endpoint

```
POST /api/v1/agents/:agent
```

- `:agent` → hedef asistanın **id**'si veya **slug**'ı.
- Tam URL örneği: `http://localhost:5173/api/v1/agents/ustun-zeka`

## Kimlik doğrulama

Anahtarı iki başlıktan biriyle gönderin:

```
Authorization: Bearer sk_agent_xxxxxxxx
# veya
x-api-key: sk_agent_xxxxxxxx
```

## İstek gövdesi

JSON. İki biçimden biri kabul edilir:

**Tek mesaj (kısayol):**
```json
{ "message": "Merhaba" }
```

**Çok turlu bağlam (stateless):**
```json
{
  "messages": [
    { "role": "user", "content": "Merhaba" },
    { "role": "assistant", "content": "Selam! Nasıl yardımcı olabilirim?" },
    { "role": "user", "content": "Bana kısa bir özet çıkar." }
  ]
}
```

Kurallar:

- `role`: `"user"` veya `"assistant"`.
- `content`: boş olmayan metin.
- Geçersiz öğeler atılır; bağlam **son 50 mesajla** sınırlanır.
- İstek **durumsuzdur (stateless):** sunucu geçmişi saklamaz. Konuşma geçmişini
  her istekte siz gönderirsiniz.

## Yanıt

- Başarılıda (`200`) gövde, **parça parça (chunked) akan** düz metindir:
  `Content-Type: text/plain; charset=utf-8`.
- Akış gerçek zamanlıdır; model çıktısı geldikçe iletilir (proxy tamponlamasını
  engellemek için `X-Accel-Buffering: no` başlığı gönderilir).
- Hatalar JSON döner:
  ```json
  { "error": "Invalid API key" }
  ```

## Durum kodları

| Kod | Anlam | Ne zaman |
|-----|-------|----------|
| `200` | OK | İstek başarılı; yanıt akış olarak gelir. |
| `400` | Bad Request | Geçersiz JSON ya da geçerli mesaj yok. |
| `401` | Unauthorized | API anahtarı eksik ya da tanınmıyor. |
| `403` | Forbidden | Anahtar iptal edilmiş, asistan pasif ya da anahtarın bu asistana izni yok. |
| `404` | Not Found | Verilen id/slug ile asistan bulunamadı. |
| `405` | Method Not Allowed | POST dışında bir metod kullanıldı. |
| `500` | Internal Server Error | Sunucu/model tarafında beklenmeyen hata. |

## Örnekler

### cURL

```bash
curl -N http://localhost:5173/api/v1/agents/ustun-zeka \
  -H "Authorization: Bearer sk_agent_xxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"message":"Merhaba"}'
```

`-N` bayrağı çıktıyı tamponlamadan, akış halinde gösterir.

### JavaScript (fetch + stream)

```js
const res = await fetch("http://localhost:5173/api/v1/agents/ustun-zeka", {
  method: "POST",
  headers: {
    "Authorization": "Bearer sk_agent_xxxxxxxx",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ message: "Merhaba" }),
});

if (!res.ok) {
  const err = await res.json();
  throw new Error(err.error);
}

const reader = res.body.getReader();
const decoder = new TextDecoder();
let text = "";
while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value, { stream: true });
  text += chunk;
  process.stdout.write(chunk); // parça geldikçe yazdır
}
```

### Python (requests, streaming)

```python
import requests

with requests.post(
    "http://localhost:5173/api/v1/agents/ustun-zeka",
    headers={"Authorization": "Bearer sk_agent_xxxxxxxx"},
    json={"message": "Merhaba"},
    stream=True,
) as r:
    r.raise_for_status()
    for chunk in r.iter_content(chunk_size=None):
        print(chunk.decode("utf-8"), end="", flush=True)
```

## İpuçları

- Konuşmayı sürdürmek için, aldığınız yanıtı bir sonraki isteğin `messages`
  dizisine `assistant` rolüyle ekleyin.
- Bir asistan bir **vector store** (bilgi tabanı) ile yapılandırıldıysa, API
  çağrıları da otomatik olarak `file_search` (RAG) kullanır.
