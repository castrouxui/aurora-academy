import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a textarea component or use standard input
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
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    return (
        <form
            onSubmit={handleSubmit}
            className="relative flex items-end gap-2 p-4 bg-background border-t"
        >
            <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                placeholder="Escribe tu consulta..."
                className="min-h-[40px] max-h-[120px] resize-none pr-12 py-3 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/50"
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
                className="absolute right-6 bottom-6 h-8 w-8 rounded-full shrink-0"
            >
                <SendHorizontal className="h-4 w-4" />
                <span className="sr-only">Enviar</span>
            </Button>
        </form>
    );
}
