import { getOpenAI } from "./openai.server";

export async function transcribeAudio(
    audio: File | Blob,
    filename = "recording.webm"
): Promise<string> {
    const openai = getOpenAI();
    const file =
        audio instanceof File
            ? audio
            : new File([audio], filename, { type: audio.type || "audio/webm" });

    const transcription = await openai.audio.transcriptions.create({
        file,
        model: "whisper-1",
        language: "tr",
    });

    return transcription.text.trim();
}

export async function synthesizeSpeech(text: string): Promise<Buffer> {
    const openai = getOpenAI();
    const response = await openai.audio.speech.create({
        model: "tts-1",
        voice: "nova",
        input: text.slice(0, 4096),
    });

    return Buffer.from(await response.arrayBuffer());
}
