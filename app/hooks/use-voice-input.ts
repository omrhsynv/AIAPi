import { useCallback, useEffect, useRef, useState } from "react";

const RECORDER_TIMESLICE_MS = 1000;
const LIVE_TRANSCRIBE_INTERVAL_MS = 2500;
const MIN_AUDIO_BYTES = 2500;

interface UseVoiceInputOptions {
    onLiveChange: (text: string) => void;
    onTranscript: (text: string) => void;
    onRecordingStart?: () => void;
    onError?: (message: string) => void;
}

async function fetchTranscription(blob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append("audio", blob, "recording.webm");

    const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.error || "Ses dönüştürülemedi");
    }

    return (data.text as string | undefined)?.trim() ?? "";
}

export function useVoiceInput({
    onLiveChange,
    onTranscript,
    onRecordingStart,
    onError,
}: UseVoiceInputOptions) {
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [isProcessingLive, setIsProcessingLive] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const mimeTypeRef = useRef("audio/webm");
    const streamRef = useRef<MediaStream | null>(null);
    const liveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const sessionIdRef = useRef(0);
    const liveInFlightRef = useRef(false);
    const livePendingRef = useRef(false);
    const liveTextRef = useRef("");

    const onLiveChangeRef = useRef(onLiveChange);
    const onTranscriptRef = useRef(onTranscript);
    const onErrorRef = useRef(onError);

    useEffect(() => {
        onLiveChangeRef.current = onLiveChange;
        onTranscriptRef.current = onTranscript;
        onErrorRef.current = onError;
    });

    const stopStream = useCallback(() => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
    }, []);

    const clearLiveInterval = useCallback(() => {
        if (liveIntervalRef.current) {
            clearInterval(liveIntervalRef.current);
            liveIntervalRef.current = null;
        }
    }, []);

    const getAudioBlob = useCallback(() => {
        return new Blob(chunksRef.current, { type: mimeTypeRef.current });
    }, []);

    const runLiveTranscribe = useCallback(async () => {
        if (mediaRecorderRef.current?.state !== "recording") return;

        const blob = getAudioBlob();
        if (blob.size < MIN_AUDIO_BYTES) return;

        if (liveInFlightRef.current) {
            livePendingRef.current = true;
            return;
        }

        liveInFlightRef.current = true;
        setIsProcessingLive(true);
        const sessionId = sessionIdRef.current;

        try {
            const text = await fetchTranscription(blob);
            if (sessionId !== sessionIdRef.current || !text) return;

            liveTextRef.current = text;
            onLiveChangeRef.current(text);
        } catch {
            // Live passes can fail on very short clips — final pass on stop will retry
        } finally {
            liveInFlightRef.current = false;
            if (sessionId === sessionIdRef.current) {
                setIsProcessingLive(false);
            }
            if (livePendingRef.current && sessionId === sessionIdRef.current) {
                livePendingRef.current = false;
                void runLiveTranscribe();
            }
        }
    }, [getAudioBlob]);

    const startRecording = useCallback(async () => {
        if (isRecording || isTranscribing) return;

        onRecordingStart?.();
        sessionIdRef.current += 1;
        liveTextRef.current = "";
        chunksRef.current = [];
        liveInFlightRef.current = false;
        livePendingRef.current = false;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
                ? "audio/webm;codecs=opus"
                : MediaRecorder.isTypeSupported("audio/webm")
                  ? "audio/webm"
                  : "audio/webm";

            mimeTypeRef.current = mimeType;

            const recorder = MediaRecorder.isTypeSupported(mimeType)
                ? new MediaRecorder(stream, { mimeType })
                : new MediaRecorder(stream);

            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            recorder.onstop = async () => {
                clearLiveInterval();
                stopStream();

                const blob = getAudioBlob();
                chunksRef.current = [];
                mediaRecorderRef.current = null;
                setIsRecording(false);

                if (blob.size === 0) return;

                setIsTranscribing(true);
                try {
                    const text = await fetchTranscription(blob);
                    if (!text) {
                        throw new Error("Ses anlaşılamadı");
                    }

                    liveTextRef.current = text;
                    onLiveChangeRef.current(text);
                    onTranscriptRef.current(text);
                } catch (error) {
                    const message =
                        error instanceof Error ? error.message : "Ses dönüştürülemedi";
                    onErrorRef.current?.(message);
                } finally {
                    setIsTranscribing(false);
                }
            };

            recorder.start(RECORDER_TIMESLICE_MS);
            setIsRecording(true);

            liveIntervalRef.current = setInterval(() => {
                void runLiveTranscribe();
            }, LIVE_TRANSCRIBE_INTERVAL_MS);

            // First live update shortly after recording starts
            setTimeout(() => {
                void runLiveTranscribe();
            }, LIVE_TRANSCRIBE_INTERVAL_MS);
        } catch {
            clearLiveInterval();
            stopStream();
            onErrorRef.current?.("Mikrofon erişimi reddedildi");
        }
    }, [
        clearLiveInterval,
        getAudioBlob,
        isRecording,
        isTranscribing,
        onRecordingStart,
        runLiveTranscribe,
        stopStream,
    ]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current?.state === "recording") {
            mediaRecorderRef.current.stop();
            return;
        }

        clearLiveInterval();
        stopStream();
        setIsRecording(false);
    }, [clearLiveInterval, stopStream]);

    const toggleRecording = useCallback(() => {
        if (isRecording) {
            stopRecording();
        } else if (!isTranscribing) {
            void startRecording();
        }
    }, [isRecording, isTranscribing, startRecording, stopRecording]);

    useEffect(() => {
        return () => {
            clearLiveInterval();
            if (mediaRecorderRef.current?.state === "recording") {
                mediaRecorderRef.current.stop();
            }
            stopStream();
        };
    }, [clearLiveInterval, stopStream]);

    return {
        isRecording,
        isTranscribing,
        isProcessingLive,
        toggleRecording,
        stopRecording,
    };
}
