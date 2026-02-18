import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect } from "react";

interface ChatInputProps {
    input: string;
    handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
}

export function ChatInput({
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
}: ChatInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [input]);

    return (
        <form
            onSubmit={handleSubmit}
            className="relative flex items-end gap-2 px-3 py-3"
        >
            <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                placeholder="Escribe tu consulta..."
                className="flex-1 min-h-[44px] max-h-[120px] resize-none rounded-xl bg-muted/40 border border-border/30 px-4 py-3 text-base leading-relaxed placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/30 transition-colors"
                style={{ fontSize: "16px" }} // Prevents iOS auto-zoom
                rows={1}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
                    }
                }}
            />
            <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="h-10 w-10 rounded-xl shrink-0 transition-all duration-200 disabled:opacity-30"
            >
                <SendHorizontal className="h-4 w-4" />
                <span className="sr-only">Enviar</span>
            </Button>
        </form>
    );
}
