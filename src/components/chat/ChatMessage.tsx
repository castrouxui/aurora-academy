import { cn } from "@/lib/utils";
import { User, Sparkles, GraduationCap, Settings, Star, ExternalLink } from "lucide-react";

interface ChatMessageProps {
    role: "user" | "assistant" | "system";
    content: string;
    agentName?: string;
}

/* ─── Inline markdown renderer ─── */
function renderInline(text: string): React.ReactNode {
    const parts: React.ReactNode[] = [];
    // Match **bold**, *italic*, [text](url)
    const regex =
        /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(\[([^\]]+)\]\((https?:\/\/[^\)]+)\))/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }

        if (match[1]) {
            parts.push(
                <strong key={match.index} className="font-semibold text-foreground">
                    {match[2]}
                </strong>
            );
        } else if (match[3]) {
            parts.push(
                <em key={match.index}>{match[4]}</em>
            );
        } else if (match[5]) {
            // Inline link rendered as mini button
            parts.push(
                <a
                    key={match.index}
                    href={match[7]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium underline underline-offset-2 decoration-primary/30 hover:decoration-primary/60 transition-colors"
                >
                    {match[6]}
                </a>
            );
        }

        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
}

/* ─── Standalone URL detection ─── */
function isStandaloneUrl(text: string): boolean {
    return /^https?:\/\/\S+$/.test(text.trim());
}

function extractDomain(url: string): string {
    try {
        const u = new URL(url);
        return u.hostname.replace("www.", "");
    } catch {
        return url;
    }
}

function extractLabel(url: string): string {
    try {
        const u = new URL(url);
        const pathParts = u.pathname.split("/").filter(Boolean);
        if (pathParts.length >= 2 && pathParts[0] === "cursos") {
            return "Abrir curso →";
        }
        if (pathParts[0] === "membresias") return "Ver membresías →";
        if (pathParts[0] === "cursos") return "Ver cursos →";
        return "Visitar enlace →";
    } catch {
        return "Visitar enlace →";
    }
}

/* ─── Link button component ─── */
function LinkButton({ url }: { url: string }) {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-4 py-2.5 my-1 rounded-xl bg-primary/[0.06] hover:bg-primary/[0.12] border border-primary/[0.12] hover:border-primary/25 transition-all duration-200 no-underline"
        >
            <div className="flex-1 min-w-0">
                <span className="block text-[13px] font-medium text-primary group-hover:text-primary/90 transition-colors">
                    {extractLabel(url)}
                </span>
                <span className="block text-[11px] text-muted-foreground/70 truncate mt-0.5">
                    {extractDomain(url)}
                </span>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-primary/50 group-hover:text-primary/70 shrink-0 transition-colors" />
        </a>
    );
}

/* ─── Block-level content renderer ─── */
function renderFormattedContent(text: string) {
    const blocks = text.split(/\n{2,}/).filter(Boolean);

    return blocks.map((block, blockIdx) => {
        const trimmedBlock = block.trim();
        const lines = trimmedBlock.split("\n");

        // Bullet list
        const isBulletList = lines.every(
            (line) => /^\s*[-*•]\s/.test(line.trim()) || line.trim() === ""
        );
        if (isBulletList) {
            const items = lines
                .filter((l) => l.trim() !== "")
                .map((l) => l.replace(/^\s*[-*•]\s*/, "").trim());
            return (
                <ul key={blockIdx} className="space-y-1.5 my-3 pl-0.5">
                    {items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] leading-relaxed">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/50 shrink-0" />
                            <span>{renderInline(item)}</span>
                        </li>
                    ))}
                </ul>
            );
        }

        // Numbered list
        const isNumberedList = lines.every(
            (line) => /^\s*\d+[.)]\s/.test(line.trim()) || line.trim() === ""
        );
        if (isNumberedList) {
            const items = lines
                .filter((l) => l.trim() !== "")
                .map((l) => l.replace(/^\s*\d+[.)]\s*/, "").trim());
            return (
                <ol key={blockIdx} className="space-y-2 my-3 pl-0.5 counter-reset-none">
                    {items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed">
                            <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/[0.08] text-[11px] font-semibold text-primary/70">
                                {i + 1}
                            </span>
                            <span className="pt-0.5">{renderInline(item)}</span>
                        </li>
                    ))}
                </ol>
            );
        }

        // Multi-line paragraph
        if (lines.length > 1) {
            return (
                <div key={blockIdx} className="space-y-2 my-2.5">
                    {lines.map((line, i) => {
                        const trimmed = line.trim();
                        if (isStandaloneUrl(trimmed)) {
                            return <LinkButton key={i} url={trimmed} />;
                        }
                        return (
                            <p key={i} className="text-[13px] leading-[1.65]">
                                {renderInline(trimmed)}
                            </p>
                        );
                    })}
                </div>
            );
        }

        // Standalone URL on its own line
        if (isStandaloneUrl(trimmedBlock)) {
            return <LinkButton key={blockIdx} url={trimmedBlock} />;
        }

        // Regular paragraph
        return (
            <p key={blockIdx} className="text-[13px] leading-[1.65] my-2.5">
                {renderInline(trimmedBlock)}
            </p>
        );
    });
}

/* ─── Main component ─── */
export function ChatMessage({ role, content, agentName }: ChatMessageProps) {
    const isUser = role === "user";

    const isMembershipRecommendation =
        !isUser &&
        (content.toLowerCase().includes("membresía") ||
            content.toLowerCase().includes("membership") ||
            content.toLowerCase().includes("ecosistema"));

    return (
        <div
            className={cn(
                "flex w-full items-end gap-2.5 mb-5",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            {/* Avatar */}
            <div
                className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg shadow-sm",
                    isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/60 text-muted-foreground border border-border/40"
                )}
            >
                {isUser ? (
                    <User className="h-3.5 w-3.5" />
                ) : agentName === "Tutor" ? (
                    <GraduationCap className="h-3.5 w-3.5 text-blue-500" />
                ) : agentName === "Operator" ? (
                    <Settings className="h-3.5 w-3.5 text-green-500" />
                ) : (
                    <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
                )}
            </div>

            {/* Message */}
            <div
                className={cn(
                    "flex flex-col gap-1 max-w-[82%]",
                    isUser ? "items-end" : "items-start"
                )}
            >
                <span className="text-[10px] font-medium text-muted-foreground/50 px-1 mb-0.5">
                    {isUser ? "Tú" : agentName || "Aurora AI"}
                </span>

                <div
                    className={cn(
                        "relative shadow-sm transition-all duration-200",
                        isUser
                            ? "bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl rounded-br-lg text-[13px] leading-relaxed"
                            : "bg-muted/50 text-foreground border border-border/30 px-4 py-3 rounded-2xl rounded-bl-lg backdrop-blur-sm"
                    )}
                >
                    {isUser ? (
                        <span className="text-[13px] leading-relaxed">{content}</span>
                    ) : (
                        <div className="[&>p:first-child]:mt-0 [&>p:last-child]:mb-0 [&>ul:first-child]:mt-0 [&>ol:first-child]:mt-0 [&>div:first-child]:mt-0 [&>a:first-child]:mt-0">
                            {renderFormattedContent(content)}
                        </div>
                    )}

                    {/* Membership Upsell Badge */}
                    {isMembershipRecommendation && (
                        <div className="mt-3 p-3 bg-yellow-500/[0.06] rounded-xl border border-yellow-500/15 flex items-start gap-2.5">
                            <div className="p-1 bg-yellow-500/10 rounded-lg shrink-0 mt-0.5">
                                <Star className="h-3.5 w-3.5 text-yellow-600 fill-yellow-600" />
                            </div>
                            <div>
                                <h4 className="text-[11px] font-semibold text-yellow-700 dark:text-yellow-500">
                                    Sugerencia para tu Progreso
                                </h4>
                                <p className="text-[10.5px] text-muted-foreground leading-snug mt-0.5">
                                    La Membresía incluye soporte en vivo y
                                    acceso total al ecosistema.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
