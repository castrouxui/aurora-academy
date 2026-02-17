import { cn } from "@/lib/utils";
import { User, Sparkles, GraduationCap, Settings } from "lucide-react";

interface ChatMessageProps {
    role: "user" | "assistant" | "system";
    content: string;
    agentName?: string;
}

export function ChatMessage({ role, content, agentName }: ChatMessageProps) {
    const isUser = role === "user";

    return (
        <div
            className={cn(
                "flex w-full items-start gap-3 p-4",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            <div
                className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                    isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                )}
            >
                {isUser ? (
                    <User className="h-4 w-4" />
                ) : agentName === "Tutor" ? (
                    <GraduationCap className="h-4 w-4 text-blue-500" />
                ) : agentName === "Operator" ? (
                    <Settings className="h-4 w-4 text-green-500" />
                ) : (
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                )}
            </div>
            <div
                className={cn(
                    "flex flex-col gap-1 text-sm max-w-[80%]",
                    isUser ? "items-end" : "items-start"
                )}
            >
                <span className="text-xs font-medium text-muted-foreground/70">
                    {isUser ? "Tú" : agentName || "Aurora AI"}
                </span>
                <div
                    className={cn(
                        "rounded-lg px-3 py-2 leading-relaxed shadow-sm",
                        isUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                    )}
                >
                    {content}
                </div>
            </div>
        </div>
    );
}
