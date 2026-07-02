import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
    { title: "Agent API — Dokümantasyon" },
    { name: "robots", content: "noindex" },
];

export async function loader() {
    const appUrl = process.env.APP_URL || "";
    return { appUrl };
}

const STATUS_CODES: Array<{ code: string; label: string; when: string }> = [
    { code: "200", label: "OK", when: "İstek başarılı. Yanıt gövdesi akış (streaming) olarak düz metin döner." },
    { code: "400", label: "Bad Request", when: "Geçersiz JSON gövdesi ya da geçerli mesaj bulunamadı." },
    { code: "401", label: "Unauthorized", when: "API anahtarı eksik ya da tanınmıyor." },
    { code: "403", label: "Forbidden", when: "Anahtar iptal edilmiş, hedef asistan pasif ya da anahtarın bu asistana izni yok." },
    { code: "404", label: "Not Found", when: "Belirtilen id/slug ile asistan bulunamadı." },
    { code: "405", label: "Method Not Allowed", when: "POST dışında bir HTTP metodu kullanıldı." },
    { code: "500", label: "Internal Server Error", when: "Sunucu tarafında beklenmeyen hata (ör. model sağlayıcısı)." },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            {children}
        </section>
    );
}

function Code({ children }: { children: React.ReactNode }) {
    return (
        <pre className="overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-4 text-sm leading-relaxed text-slate-200">
            <code>{children}</code>
        </pre>
    );
}

export default function AgentApiDocs({ loaderData }: { loaderData: { appUrl: string } }) {
    const base = loaderData.appUrl || "https://<host>";
    const endpoint = `${base}/api/v1/agents/:agent`;
    const example = `${base}/api/v1/agents/ustun-zeka`;

    return (
        <div className="min-h-screen bg-[#0d0e1a] text-slate-300">
            <div className="mx-auto max-w-3xl px-6 py-12 space-y-10">
                <header className="space-y-2">
                    <p className="text-sm font-medium text-[#21c6cc]">ArisAI</p>
                    <h1 className="text-3xl font-bold text-white">Agent API</h1>
                    <p className="text-slate-400">
                        Bir asistanı, tarayıcı oturumu olmadan, API anahtarı ile programatik
                        olarak çağırın. Yanıt gerçek zamanlı olarak akış halinde döner.
                    </p>
                </header>

                <Section title="Endpoint">
                    <Code>
                        <span className="font-semibold text-[#21c6cc]">POST</span> {endpoint}
                    </Code>
                    <p className="text-sm text-slate-400">
                        <code className="rounded bg-white/10 px-1">:agent</code> hedef asistanın{" "}
                        <strong className="text-slate-200">id</strong> veya{" "}
                        <strong className="text-slate-200">slug</strong> değeridir. API anahtarı
                        çağrıyı yetkilendirir; aynı anahtar ile farklı asistanlar çağrılabilir.
                        Slug yönetim panelindeki asistan ayarlarından belirlenir.
                    </p>
                </Section>

                <Section title="Kimlik Doğrulama">
                    <p className="text-sm">
                        Anahtarı <code className="rounded bg-white/10 px-1">Authorization</code>{" "}
                        başlığında (Bearer) ya da <code className="rounded bg-white/10 px-1">x-api-key</code>{" "}
                        başlığında gönderin:
                    </p>
                    <Code>{`Authorization: Bearer sk_agent_xxxxxxxx
# veya
x-api-key: sk_agent_xxxxxxxx`}</Code>
                </Section>

                <Section title="İstek Gövdesi">
                    <p className="text-sm">
                        JSON. İki biçimden biri kabul edilir — çok turlu bağlam için{" "}
                        <code className="rounded bg-white/10 px-1">messages</code>, tek mesaj için{" "}
                        <code className="rounded bg-white/10 px-1">message</code>:
                    </p>
                    <Code>{`{
  "messages": [
    { "role": "user", "content": "Merhaba" },
    { "role": "assistant", "content": "Selam! Nasıl yardımcı olabilirim?" },
    { "role": "user", "content": "Bana bir özet çıkar" }
  ]
}

// veya kısayol:
{ "message": "Merhaba" }`}</Code>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-slate-400">
                        <li><code className="rounded bg-white/10 px-1">role</code>: <code>"user"</code> veya <code>"assistant"</code>.</li>
                        <li><code className="rounded bg-white/10 px-1">content</code>: boş olmayan metin.</li>
                        <li>Geçersiz girişler atılır; bağlam son 50 mesajla sınırlanır.</li>
                        <li>İstek durumsuzdur (stateless): geçmiş sunucuda saklanmaz, her istekte gönderilir.</li>
                    </ul>
                </Section>

                <Section title="Yanıt">
                    <p className="text-sm">
                        <code className="rounded bg-white/10 px-1">200</code> durumunda gövde,{" "}
                        <code className="rounded bg-white/10 px-1">text/plain; charset=utf-8</code>{" "}
                        olarak parça parça (chunked) akan model çıktısıdır. Akışı satır satır
                        okuyup ekrana yazdırabilirsiniz. Hatalar JSON olarak döner:
                    </p>
                    <Code>{`{ "error": "Invalid API key" }`}</Code>
                </Section>

                <Section title="Durum Kodları">
                    <div className="overflow-hidden rounded-lg border border-white/10">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-slate-200">
                                <tr>
                                    <th className="px-4 py-2 font-semibold">Kod</th>
                                    <th className="px-4 py-2 font-semibold">Anlam</th>
                                    <th className="px-4 py-2 font-semibold">Ne zaman</th>
                                </tr>
                            </thead>
                            <tbody>
                                {STATUS_CODES.map((s) => (
                                    <tr key={s.code} className="border-t border-white/10">
                                        <td className="px-4 py-2 font-mono text-[#21c6cc]">{s.code}</td>
                                        <td className="px-4 py-2 text-slate-200">{s.label}</td>
                                        <td className="px-4 py-2 text-slate-400">{s.when}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Section>

                <Section title="Örnek — cURL">
                    <Code>{`curl -N ${example} \\
  -H "Authorization: Bearer sk_agent_xxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{"message":"Merhaba"}'`}</Code>
                    <p className="text-xs text-slate-500">
                        <code>-N</code> akışı tamponlamadan (buffering) gösterir.
                    </p>
                </Section>

                <Section title="Örnek — JavaScript (fetch + stream)">
                    <Code>{`const res = await fetch("${example}", {
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
}`}</Code>
                </Section>

                <Section title="Anahtar Oluşturma">
                    <p className="text-sm">
                        Yönetim panelinden{" "}
                        <code className="rounded bg-white/10 px-1">Admin → API Anahtarları</code>{" "}
                        sayfasında anahtar üretin ve erişebileceği asistanları seçin. Bir anahtar
                        yalnızca izinli olduğu asistanları çağırabilir; aksi halde{" "}
                        <code className="rounded bg-white/10 px-1">403</code> döner. Ham anahtar
                        yalnızca bir kez gösterilir.
                    </p>
                    <p className="text-xs text-slate-500">
                        Alternatif (CLI):{" "}
                        <code className="rounded bg-white/10 px-1">
                            npx tsx scripts/create-agent-key.ts [ad] [assistantIdOrSlug...]
                        </code>
                    </p>
                </Section>

                <Section title="Postman">
                    <p className="text-sm">
                        Hazır koleksiyonu içe aktarın; değişkenler{" "}
                        <code className="rounded bg-white/10 px-1">baseUrl</code>,{" "}
                        <code className="rounded bg-white/10 px-1">apiKey</code>,{" "}
                        <code className="rounded bg-white/10 px-1">agent</code>.
                    </p>
                    <a
                        href="/agent-api.postman_collection.json"
                        download
                        className="inline-flex items-center gap-2 rounded-lg border border-[#21c6cc]/40 bg-[#21c6cc]/10 px-4 py-2 text-sm font-medium text-[#21c6cc] hover:bg-[#21c6cc]/20"
                    >
                        Postman koleksiyonunu indir
                    </a>
                </Section>
            </div>
        </div>
    );
}
