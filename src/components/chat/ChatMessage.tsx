import { cn } from "@/lib/utils";
import { User, Sparkles, GraduationCap, Settings, Star } from "lucide-react";

interface ChatMessageProps {
    role: "user" | "assistant" | "system";
    content: string;
    agentName?: string;
}

export function ChatMessage({ role, content, agentName }: ChatMessageProps) {
    const isUser = role === "user";

    // Simple detection for Membership upsell to show the badge
    const isMembershipRecommendation = !isUser && (
        content.toLowerCase().includes("membresía") ||
        content.toLowerCase().includes("membership") ||
        content.toLowerCase().includes("ecosistema")
    );

    return (
        <div
            className={cn(
                "flex w-full items-end gap-2 mb-4",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            <div
                className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm",
                    isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-foreground"
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

            <div className={cn("flex flex-col gap-1 max-w-[85%]", isUser ? "items-end" : "items-start")}>
                <span className="text-[10px] font-medium text-muted-foreground/60 px-1">
                    {isUser ? "Tú" : agentName || "Aurora AI"}
                </span>

                <div
                    className={cn(
                        "relative px-4 py-3 text-sm leading-relaxed shadow-sm transition-all duration-200",
                        isUser
                            ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                            : "bg-muted/80 text-foreground border border-border/50 rounded-2xl rounded-tl-sm backdrop-blur-sm"
                    )}
                >
                    {content}

                    {/* Dynamic Badge for Membership Recommendation */}
                    {isMembershipRecommendation && (
                        <div className="mt-3 -mx-1 p-3 bg-background/50 rounded-xl border border-yellow-500/20 shadow-sm flex items-start gap-3">
                            <div className="p-1.5 bg-yellow-500/10 rounded-full shrink-0">
                                <Star className="h-3.5 w-3.5 text-yellow-600 fill-yellow-600" />
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-yellow-700 mb-0.5">
                                    Sugerencia para tu Progreso
                                </h4>
                                <p className="text-[11px] text-muted-foreground leading-tight">
                                    La Membresía incluye soporte en vivo y acceso total al ecosistema.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
