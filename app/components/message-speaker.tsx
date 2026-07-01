import { Volume2, VolumeX } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface MessageSpeakerProps {
    messageId: string;
    content: string;
    isActive: boolean;
    onSpeak: (text: string, messageId: string) => void;
    className?: string;
}

export function MessageSpeaker({
    messageId,
    content,
    isActive,
    onSpeak,
    className,
}: MessageSpeakerProps) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onSpeak(content, messageId)}
            title={isActive ? "Sesi durdur" : "Mesajı dinle"}
            className={cn(
                "h-7 w-7 rounded-md text-muted-foreground hover:text-foreground",
                isActive && "text-blue-600 hover:text-blue-600",
                className
            )}
        >
            {isActive ? (
                <VolumeX className="h-3.5 w-3.5" />
            ) : (
                <Volume2 className="h-3.5 w-3.5" />
            )}
        </Button>
    );
}

interface AutoSpeakToggleProps {
    enabled: boolean;
    onToggle: () => void;
    disabled?: boolean;
}

export function AutoSpeakToggle({ enabled, onToggle, disabled }: AutoSpeakToggleProps) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggle}
            disabled={disabled}
            title={enabled ? "Sesli mod açık" : "Sesli mod kapalı"}
            className={cn(
                "h-9 w-9 rounded-xl shrink-0 relative",
                enabled && "text-blue-600 hover:text-blue-600 bg-blue-500/10 hover:bg-blue-500/15"
            )}
        >
            {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
    );
}
