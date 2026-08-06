import{w as c,j as e}from"./chunk-WWGJGFF6-FsV5rGUt.js";const h=()=>[{title:"Agent API — Dokümantasyon"},{name:"robots",content:"noindex"}],o=[{code:"200",label:"OK",when:"İstek başarılı. Yanıt gövdesi akış (streaming) olarak düz metin döner."},{code:"400",label:"Bad Request",when:"Geçersiz JSON gövdesi ya da geçerli mesaj bulunamadı."},{code:"401",label:"Unauthorized",when:"API anahtarı eksik ya da tanınmıyor."},{code:"403",label:"Forbidden",when:"Anahtar iptal edilmiş, hedef asistan pasif ya da anahtarın bu asistana izni yok."},{code:"404",label:"Not Found",when:"Belirtilen id/slug ile asistan bulunamadı."},{code:"405",label:"Method Not Allowed",when:"POST dışında bir HTTP metodu kullanıldı."},{code:"500",label:"Internal Server Error",when:"Sunucu tarafında beklenmeyen hata (ör. model sağlayıcısı)."}];function s({title:t,children:r}){return e.jsxs("section",{className:"space-y-3",children:[e.jsx("h2",{className:"text-xl font-semibold text-white",children:t}),r]})}function a({children:t}){return e.jsx("pre",{className:"overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-4 text-sm leading-relaxed text-slate-200",children:e.jsx("code",{children:t})})}const m=c(function({loaderData:r}){const n=r.appUrl||"https://<host>",d=`${n}/api/v1/agents/:agent`,i=`${n}/api/v1/agents/ustun-zeka`;return e.jsx("div",{className:"min-h-screen bg-[#0d0e1a] text-slate-300",children:e.jsxs("div",{className:"mx-auto max-w-3xl px-6 py-12 space-y-10",children:[e.jsxs("header",{className:"space-y-2",children:[e.jsx("p",{className:"text-sm font-medium text-[#21c6cc]",children:"ArisAI"}),e.jsx("h1",{className:"text-3xl font-bold text-white",children:"Agent API"}),e.jsx("p",{className:"text-slate-400",children:"Bir asistanı, tarayıcı oturumu olmadan, API anahtarı ile programatik olarak çağırın. Yanıt gerçek zamanlı olarak akış halinde döner."})]}),e.jsxs(s,{title:"Endpoint",children:[e.jsxs(a,{children:[e.jsx("span",{className:"font-semibold text-[#21c6cc]",children:"POST"})," ",d]}),e.jsxs("p",{className:"text-sm text-slate-400",children:[e.jsx("code",{className:"rounded bg-white/10 px-1",children:":agent"})," hedef asistanın"," ",e.jsx("strong",{className:"text-slate-200",children:"id"})," veya"," ",e.jsx("strong",{className:"text-slate-200",children:"slug"})," değeridir. API anahtarı çağrıyı yetkilendirir; aynı anahtar ile farklı asistanlar çağrılabilir. Slug yönetim panelindeki asistan ayarlarından belirlenir."]})]}),e.jsxs(s,{title:"Kimlik Doğrulama",children:[e.jsxs("p",{className:"text-sm",children:["Anahtarı ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"Authorization"})," ","başlığında (Bearer) ya da ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"x-api-key"})," ","başlığında gönderin:"]}),e.jsx(a,{children:`Authorization: Bearer sk_agent_xxxxxxxx
# veya
x-api-key: sk_agent_xxxxxxxx`})]}),e.jsxs(s,{title:"İstek Gövdesi",children:[e.jsxs("p",{className:"text-sm",children:["JSON. İki biçimden biri kabul edilir — çok turlu bağlam için"," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"messages"}),", tek mesaj için"," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"message"}),":"]}),e.jsx(a,{children:`{
  "messages": [
    { "role": "user", "content": "Merhaba" },
    { "role": "assistant", "content": "Selam! Nasıl yardımcı olabilirim?" },
    { "role": "user", "content": "Bana bir özet çıkar" }
  ]
}

// veya kısayol:
{ "message": "Merhaba" }`}),e.jsxs("ul",{className:"list-disc space-y-1 pl-5 text-sm text-slate-400",children:[e.jsxs("li",{children:[e.jsx("code",{className:"rounded bg-white/10 px-1",children:"role"}),": ",e.jsx("code",{children:'"user"'})," veya ",e.jsx("code",{children:'"assistant"'}),"."]}),e.jsxs("li",{children:[e.jsx("code",{className:"rounded bg-white/10 px-1",children:"content"}),": boş olmayan metin."]}),e.jsx("li",{children:"Geçersiz girişler atılır; bağlam son 50 mesajla sınırlanır."}),e.jsx("li",{children:"İstek durumsuzdur (stateless): geçmiş sunucuda saklanmaz, her istekte gönderilir."})]})]}),e.jsxs(s,{title:"Yanıt",children:[e.jsxs("p",{className:"text-sm",children:[e.jsx("code",{className:"rounded bg-white/10 px-1",children:"200"})," durumunda gövde,"," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"text/plain; charset=utf-8"})," ","olarak parça parça (chunked) akan model çıktısıdır. Akışı satır satır okuyup ekrana yazdırabilirsiniz. Hatalar JSON olarak döner:"]}),e.jsx(a,{children:'{ "error": "Invalid API key" }'})]}),e.jsx(s,{title:"Durum Kodları",children:e.jsx("div",{className:"overflow-hidden rounded-lg border border-white/10",children:e.jsxs("table",{className:"w-full text-left text-sm",children:[e.jsx("thead",{className:"bg-white/5 text-slate-200",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-4 py-2 font-semibold",children:"Kod"}),e.jsx("th",{className:"px-4 py-2 font-semibold",children:"Anlam"}),e.jsx("th",{className:"px-4 py-2 font-semibold",children:"Ne zaman"})]})}),e.jsx("tbody",{children:o.map(l=>e.jsxs("tr",{className:"border-t border-white/10",children:[e.jsx("td",{className:"px-4 py-2 font-mono text-[#21c6cc]",children:l.code}),e.jsx("td",{className:"px-4 py-2 text-slate-200",children:l.label}),e.jsx("td",{className:"px-4 py-2 text-slate-400",children:l.when})]},l.code))})]})})}),e.jsxs(s,{title:"Örnek — cURL",children:[e.jsx(a,{children:`curl -N ${i} \\
  -H "Authorization: Bearer sk_agent_xxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{"message":"Merhaba"}'`}),e.jsxs("p",{className:"text-xs text-slate-500",children:[e.jsx("code",{children:"-N"})," akışı tamponlamadan (buffering) gösterir."]})]}),e.jsx(s,{title:"Örnek — JavaScript (fetch + stream)",children:e.jsx(a,{children:`const res = await fetch("${i}", {
  method: "POST",
  headers: {
    "Authorization": "Bearer sk_agent_xxxxxxxx",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ message: "Merhaba" }),
});

const reader = res.body.getReader();
const decoder = new TextDecoder();
let text = "";
while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  text += decoder.decode(value, { stream: true });
  process.stdout.write(decoder.decode(value)); // canlı yazdır
}`})}),e.jsxs(s,{title:"AGORA — Agora.io Conversational AI için özel LLM",children:[e.jsxs("p",{className:"text-sm",children:['Agora.io Conversational AI Engine, "özel LLM" olarak'," ",e.jsx("strong",{className:"text-slate-200",children:"OpenAI Chat Completions"})," ","protokolünü konuşan bir HTTP servisi bekler: SSE üzerinden"," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"chat.completion.chunk"})," ","olayları ve sonunda"," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"data: [DONE]"}),". AGORA endpoint'leri bu sözleşmeye birebir uyar — bu sayede stok bir OpenAI istemcisi de yalnızca base URL değiştirilerek çalışır. Hedef asistan, gövdedeki ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"model"})," ","alanıyla (id veya slug) seçilir; Agora'nın istek başına sunduğu tek alan budur."]}),e.jsx("div",{className:"overflow-hidden rounded-lg border border-white/10",children:e.jsxs("table",{className:"w-full text-left text-sm",children:[e.jsx("thead",{className:"bg-white/5 text-slate-200",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-4 py-2 font-semibold",children:"Endpoint"}),e.jsx("th",{className:"px-4 py-2 font-semibold",children:"Davranış"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{className:"border-t border-white/10",children:[e.jsx("td",{className:"px-4 py-2 font-mono text-[#8d36ff]",children:"POST /api/agora/chat/completions"}),e.jsxs("td",{className:"px-4 py-2 text-slate-400",children:["Varsayılan: tek parça JSON (",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"chat.completion"}),")."," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"stream: true"})," ","verilirse SSE akışı."]})]}),e.jsxs("tr",{className:"border-t border-white/10",children:[e.jsx("td",{className:"px-4 py-2 font-mono text-[#8d36ff]",children:"POST /api/agora/stream"}),e.jsxs("td",{className:"px-4 py-2 text-slate-400",children:["Her zaman SSE akışı; aynı biçim, ama"," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"stream"})," ","bayrağı yok sayılır. Agora'nın"," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"stream: true"})," ","göndereceğine güvenmek istemediğinizde kullanın."]})]})]})]})}),e.jsxs("p",{className:"text-sm text-slate-400",children:[e.jsx("strong",{className:"text-slate-200",children:"Agora agent yapılandırması:"})," ","agent'ı başlatırken"," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"llm.url"})," alanına bu endpoint'i,"," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"llm.api_key"})," alanına Agent API anahtarınızı,"," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"llm.params.model"})," ","alanına da asistan id/slug değerini verin:"]}),e.jsx(a,{children:`{
  "llm": {
    "url": "${n}/api/agora/chat/completions",
    "api_key": "sk_agent_xxxxxxxx",
    "params": { "model": "ustun-zeka" }
  }
}`}),e.jsxs("p",{className:"text-sm text-slate-400",children:[e.jsx("strong",{className:"text-slate-200",children:"İstek gövdesi:"})," OpenAI biçimi. ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"model"})," = asistan id/slug, ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"messages"})," ","= konuşma. Gövdedeki ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"system"})," ","mesajları yok sayılır — asistanın kendi sistem talimatı kullanılır. Agora ayrıca"," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"appId"}),","," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"channel"})," ve"," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"userId"})," gönderir; bunlar kabul edilir ama kullanılmaz."]}),e.jsx(a,{children:`{
  "model": "ustun-zeka",
  "messages": [
    { "role": "user", "content": "Merhaba" }
  ],
  "stream": true,
  "appId": "20b7c51ff4c644ab80cf5a4e646b0537",
  "channel": "default",
  "userId": "user123"
}`}),e.jsxs("p",{className:"text-sm text-slate-400",children:[e.jsx("strong",{className:"text-slate-200",children:"Akış (SSE) yanıtı"})," — her iki endpoint de aynı biçimi döndürür: OpenAI"," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"chat.completion.chunk"}),". Her parça bir ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"data:"})," ","satırı; akış ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"data: [DONE]"})," ","ile biter:"]}),e.jsx(a,{children:`data: {"id":"chatcmpl-…","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-…","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"Merhaba, "},"finish_reason":null}]}

data: {"id":"chatcmpl-…","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"nasıl yardımcı olabilirim?"},"finish_reason":null}]}

data: {"id":"chatcmpl-…","object":"chat.completion.chunk","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]`}),e.jsxs("p",{className:"rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-slate-400",children:[e.jsx("strong",{className:"text-amber-300",children:"Dikkat:"})," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:'data: {"choices":[{"delta":{"content":"…"}}]}'})," ","gibi sadeleştirilmiş bir gövde Agora tarafından"," ",e.jsx("strong",{className:"text-slate-200",children:"ayrıştırılmaz"}),". Zarf (",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"id"}),","," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"object"}),","," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"created"}),","," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"model"}),") ve"," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"finish_reason"})," alanları zorunludur."]}),e.jsxs("p",{className:"text-sm text-slate-400",children:[e.jsx("strong",{className:"text-slate-200",children:"Akışsız (JSON) yanıtı"})," —"," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"stream"})," verilmezse:"]}),e.jsx(a,{children:`{
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
}`}),e.jsx("p",{className:"text-sm text-slate-400",children:e.jsx("strong",{className:"text-slate-200",children:"OpenAI SDK ile:"})}),e.jsx(a,{children:`import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "sk_agent_xxxxxxxx",           // Agent API anahtarınız
  baseURL: "${n}/api/agora",           // AGORA taban adresi
});

const stream = await client.chat.completions.create({
  model: "ustun-zeka",                    // asistan id veya slug
  messages: [{ role: "user", content: "Merhaba" }],
  stream: true,
});

for await (const part of stream) {
  process.stdout.write(part.choices[0]?.delta?.content ?? "");
}`}),e.jsx("p",{className:"text-xs text-slate-500",children:"AGORA da v1 ile aynı durum kodlarını döndürür (401/403/404/400/500). Anahtar yoksa/geçersizse veya asistana izniniz yoksa istek reddedilir."})]}),e.jsxs(s,{title:"Anahtar Oluşturma",children:[e.jsxs("p",{className:"text-sm",children:["Yönetim panelinden"," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"Admin → API Anahtarları"})," ","sayfasında anahtar üretin ve erişebileceği asistanları seçin. Bir anahtar yalnızca izinli olduğu asistanları çağırabilir; aksi halde"," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"403"})," döner. Ham anahtar yalnızca bir kez gösterilir."]}),e.jsxs("p",{className:"text-xs text-slate-500",children:["Alternatif (CLI):"," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"npx tsx scripts/create-agent-key.ts [ad] [assistantIdOrSlug...]"})]})]}),e.jsxs(s,{title:"Postman",children:[e.jsxs("p",{className:"text-sm",children:["Hazır koleksiyonu içe aktarın; değişkenler"," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"baseUrl"}),","," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"apiKey"}),","," ",e.jsx("code",{className:"rounded bg-white/10 px-1",children:"agent"}),"."]}),e.jsx("a",{href:"/agent-api.postman_collection.json",download:!0,className:"inline-flex items-center gap-2 rounded-lg border border-[#21c6cc]/40 bg-[#21c6cc]/10 px-4 py-2 text-sm font-medium text-[#21c6cc] hover:bg-[#21c6cc]/20",children:"Postman koleksiyonunu indir"})]})]})})});export{m as default,h as meta};
