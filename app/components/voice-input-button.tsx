import { Mic, Square, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useVoiceInput } from "~/hooks/use-voice-input";
import { cn } from "~/lib/utils";

interface VoiceInputButtonProps {
    onLiveChange: (text: string) => void;
    onTranscript: (text: string) => void;
    onRecordingStart?: () => void;
    onError?: (message: string) => void;
    disabled?: boolean;
    className?: string;
}

export function VoiceInputButton({
    onLiveChange,
    onTranscript,
    onRecordingStart,
    onError,
    disabled = false,
    className,
}: VoiceInputButtonProps) {
    const { isRecording, isTranscribing, isProcessingLive, toggleRecording } = useVoiceInput({
        onLiveChange,
        onTranscript,
        onRecordingStart,
        onError,
    });

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleRecording}
            disabled={disabled || isTranscribing}
            title={
                isTranscribing
                    ? "Son metin hazırlanıyor..."
                    : isRecording
                      ? isProcessingLive
                          ? "Ses yazıya dönüştürülüyor..."
                          : "Kaydı durdur"
                      : "Sesli mesaj"
            }
            className={cn(
                "relative h-9 w-9 rounded-xl shrink-0",
                isRecording && "bg-red-500/15 text-red-500 hover:bg-red-500/20 hover:text-red-500",
                className
            )}
        >
            {isTranscribing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : isRecording ? (
                <Square className="h-3.5 w-3.5 fill-current" />
            ) : (
                <Mic className="h-4 w-4" />
            )}
            {isRecording && (
                <span
                    className={cn(
                        "absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full animate-pulse",
                        isProcessingLive ? "bg-blue-500" : "bg-red-500"
                    )}
                />
            )}
        </Button>
    );
}
