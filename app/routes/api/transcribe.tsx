import { auth } from "~/lib/auth.server";
import { transcribeAudio } from "~/lib/voice.server";

export async function action({ request }: { request: Request }) {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    if (!session?.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const formData = await request.formData();
        const audio = formData.get("audio");

        if (!audio || !(audio instanceof Blob) || audio.size === 0) {
            return Response.json({ error: "Ses kaydı gerekli" }, { status: 400 });
        }

        const text = await transcribeAudio(audio);

        if (!text) {
            return Response.json({ error: "Ses anlaşılamadı" }, { status: 400 });
        }

        return Response.json({ text });
    } catch (error) {
        console.error("Transcription error:", error);
        return Response.json({ error: "Ses dönüştürülemedi" }, { status: 500 });
    }
}
