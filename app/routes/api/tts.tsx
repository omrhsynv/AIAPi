import { auth } from "~/lib/auth.server";
import { markdownToPlainText } from "~/lib/markdown-to-text";
import { synthesizeSpeech } from "~/lib/voice.server";

export async function action({ request }: { request: Request }) {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    if (!session?.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const { text } = await request.json();

        if (!text || typeof text !== "string" || !text.trim()) {
            return new Response("Text required", { status: 400 });
        }

        const plainText = markdownToPlainText(text);

        if (!plainText) {
            return new Response("Text required", { status: 400 });
        }

        const audio = await synthesizeSpeech(plainText);

        return new Response(new Uint8Array(audio), {
            headers: {
                "Content-Type": "audio/mpeg",
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("TTS error:", error);
        return new Response("TTS failed", { status: 500 });
    }
}
