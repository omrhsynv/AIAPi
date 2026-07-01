import { useCallback, useEffect, useRef, useState } from "react";

export function useSpeech() {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speakingId, setSpeakingId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const objectUrlRef = useRef<string | null>(null);

    const cleanup = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = null;
        }
        setIsSpeaking(false);
        setSpeakingId(null);
    }, []);

    useEffect(() => cleanup, [cleanup]);

    const speak = useCallback(
        async (text: string, messageId?: string) => {
            if (!text.trim()) return;

            if (speakingId === messageId && isSpeaking) {
                cleanup();
                return;
            }

            cleanup();
            setIsSpeaking(true);
            setSpeakingId(messageId ?? "current");

            try {
                const response = await fetch("/api/tts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text }),
                });

                if (!response.ok) {
                    throw new Error("Ses oluşturulamadı");
                }

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                objectUrlRef.current = url;

                const audio = new Audio(url);
                audioRef.current = audio;

                audio.onended = cleanup;
                audio.onerror = cleanup;

                await audio.play();
            } catch {
                cleanup();
            }
        },
        [cleanup, isSpeaking, speakingId]
    );

    const stop = useCallback(() => {
        cleanup();
    }, [cleanup]);

    return {
        isSpeaking,
        speakingId,
        speak,
        stop,
    };
}
