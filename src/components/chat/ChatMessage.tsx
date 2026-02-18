import { cn } from "@/lib/utils";
import { User, Bot, GraduationCap, Settings, Star, ExternalLink, ArrowRight, Zap } from "lucide-react";

interface ChatMessageProps {
    role: "user" | "assistant" | "system";
    content: string;
    agentName?: string;
}

/* ═══════════════════════════════════════════════════════════
   INLINE MARKDOWN RENDERER
   ═══════════════════════════════════════════════════════════ */
function renderInline(text: string): React.ReactNode {
    const parts: React.ReactNode[] = [];
    const regex =
        /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(💡)|(✅)|(\[([^\]]+)\]\((https?:\/\/[^\)]+)\))/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }

        if (match[1]) {
            // **bold**
            parts.push(
                <strong key={match.index} className="font-semibold text-foreground">
                    {match[2]}
                </strong>
            );
        } else if (match[3]) {
            // *italic*
            parts.push(<em key={match.index}>{match[4]}</em>);
        } else if (match[5]) {
            // 💡 emoji — highlighted
            parts.push(<span key={match.index} className="text-yellow-500">💡</span>);
        } else if (match[6]) {
            // ✅ emoji
            parts.push(<span key={match.index}>✅</span>);
        } else if (match[7]) {
            // [text](url)
            parts.push(
                <a
                    key={match.index}
                    href={match[9]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium underline underline-offset-2 decoration-primary/30 hover:decoration-primary/60 transition-colors"
                >
                    {match[8]}
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

/* ═══════════════════════════════════════════════════════════
   STANDALONE URL HELPERS
   ═══════════════════════════════════════════════════════════ */
function isStandaloneUrl(text: string): boolean {
    return /^https?:\/\/\S+$/.test(text.trim());
}

function extractDomain(url: string): string {
    try {
        return new URL(url).hostname.replace("www.", "");
    } catch {
        return url;
    }
}

function extractLabel(url: string): string {
    try {
        const pathParts = new URL(url).pathname.split("/").filter(Boolean);
        if (pathParts.length >= 2 && pathParts[0] === "cursos") return "Abrir curso →";
        if (pathParts[0] === "membresias") return "Ver membresías →";
        if (pathParts[0] === "cursos") return "Ver cursos →";
        return "Visitar enlace →";
    } catch {
        return "Visitar enlace →";
    }
}

/* ═══════════════════════════════════════════════════════════
   LINK BUTTON (for standalone URLs)
   ═══════════════════════════════════════════════════════════ */
function LinkButton({ url }: { url: string }) {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-4 py-2.5 my-1.5 rounded-xl bg-primary/[0.06] hover:bg-primary/[0.12] border border-primary/[0.12] hover:border-primary/25 transition-all duration-200 no-underline"
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

/* ═══════════════════════════════════════════════════════════
   PRODUCT CARD (rendered from {{PRODUCT_CARD:...}} tokens)
   ═══════════════════════════════════════════════════════════ */
interface ProductCardData {
    type: string; // "membership" | "course"
    title: string;
    price: string;
    url: string;
    highlight?: string;
}

function parseProductCard(token: string): ProductCardData | null {
    // format: {{PRODUCT_CARD:type|title|price|url|highlight?}}
    const inner = token.replace(/^\{\{PRODUCT_CARD:/, "").replace(/\}\}$/, "");
    const parts = inner.split("|");
    if (parts.length < 4) return null;
    return {
        type: parts[0].trim(),
        title: parts[1].trim(),
        price: parts[2].trim(),
        url: parts[3].trim(),
        highlight: parts[4]?.trim(),
    };
}

function ProductCard({ data }: { data: ProductCardData }) {
    const isMembership = data.type === "membership";
    return (
        <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block my-2.5 rounded-xl overflow-hidden no-underline transition-all duration-200 hover:scale-[1.01]"
        >
            <div className={cn(
                "p-[1px] rounded-xl",
                isMembership
                    ? "bg-gradient-to-r from-primary/60 via-purple-500/40 to-primary/60"
                    : "bg-border/40"
            )}>
                <div className="bg-background/95 backdrop-blur-sm rounded-[11px] p-3.5">
                    {/* Type badge */}
                    <div className="flex items-center gap-1.5 mb-2">
                        {isMembership ? (
                            <Zap className="h-3 w-3 text-primary fill-primary" />
                        ) : (
                            <GraduationCap className="h-3 w-3 text-blue-500" />
                        )}
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                            {isMembership ? "Membresía" : "Curso"}
                        </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-sm font-semibold text-foreground leading-tight mb-1">
                        {data.title}
                    </h4>

                    {/* Highlight */}
                    {data.highlight && (
                        <p className="text-[11px] text-muted-foreground/80 mb-2.5 leading-snug">
                            {data.highlight}
                        </p>
                    )}

                    {/* Price + CTA */}
                    <div className="flex items-center justify-between gap-2 mt-2">
                        <span className="text-base font-bold text-foreground">
                            {data.price}
                        </span>
                        <span className={cn(
                            "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                            isMembership
                                ? "bg-primary text-primary-foreground group-hover:bg-primary/90"
                                : "bg-muted/80 text-foreground group-hover:bg-muted"
                        )}>
                            Ver Oferta
                            <ArrowRight className="h-3 w-3" />
                        </span>
                    </div>
                </div>
            </div>
        </a>
    );
}

/* ═══════════════════════════════════════════════════════════
   COMPARE CARD (rendered from {{COMPARE:...}} tokens)
   ═══════════════════════════════════════════════════════════ */
interface CompareData {
    courseTitle: string;
    coursePrice: string;
    courseUrl: string;
    memberTitle: string;
    memberPrice: string;
    memberUrl: string;
    savings: string;
}

function parseCompare(token: string): CompareData | null {
    // format: {{COMPARE:courseTitle|coursePrice|courseUrl|memberTitle|memberPrice|memberUrl|savings}}
    const inner = token.replace(/^\{\{COMPARE:/, "").replace(/\}\}$/, "");
    const p = inner.split("|");
    if (p.length < 7) return null;
    return {
        courseTitle: p[0].trim(),
        coursePrice: p[1].trim(),
        courseUrl: p[2].trim(),
        memberTitle: p[3].trim(),
        memberPrice: p[4].trim(),
        memberUrl: p[5].trim(),
        savings: p[6].trim(),
    };
}

function CompareCard({ data }: { data: CompareData }) {
    return (
        <div className="my-3 rounded-xl border border-border/30 overflow-hidden">
            {/* Course option */}
            <a
                href={data.courseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-2 p-3 no-underline hover:bg-muted/30 transition-colors"
            >
                <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <GraduationCap className="h-3 w-3 text-muted-foreground/60" />
                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">Curso Individual</span>
                    </div>
                    <h5 className="text-[13px] font-medium text-foreground">{data.courseTitle}</h5>
                </div>
                <span className="text-sm font-bold text-foreground shrink-0">{data.coursePrice}</span>
            </a>

            {/* Divider with "vs" */}
            <div className="relative border-t border-border/20">
                <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-background text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">
                    vs
                </span>
            </div>

            {/* Membership option — highlighted */}
            <a
                href={data.memberUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-3 bg-primary/[0.04] hover:bg-primary/[0.08] no-underline transition-colors"
            >
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <Zap className="h-3 w-3 text-primary fill-primary" />
                            <span className="text-[10px] font-medium uppercase tracking-wider text-primary/60">Membresía</span>
                            <span className="ml-1 px-1.5 py-0.5 text-[9px] font-bold rounded bg-green-500/10 text-green-600 dark:text-green-400">
                                Recomendada
                            </span>
                        </div>
                        <h5 className="text-[13px] font-semibold text-foreground">{data.memberTitle}</h5>
                        <p className="text-[11px] text-green-600 dark:text-green-400 font-medium mt-0.5">
                            {data.savings}
                        </p>
                    </div>
                    <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-foreground">{data.memberPrice}</span>
                        <span className="block text-[10px] text-muted-foreground/60">/mes</span>
                    </div>
                </div>
            </a>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   BLOCK-LEVEL CONTENT RENDERER
   ═══════════════════════════════════════════════════════════ */
function renderFormattedContent(text: string) {
    // First, extract special tokens (PRODUCT_CARD, COMPARE)
    const tokenRegex = /\{\{(PRODUCT_CARD|COMPARE):([^}]+)\}\}/g;
    const segments: { type: "text" | "product" | "compare"; content: string }[] = [];
    let lastIdx = 0;
    let tokenMatch;

    while ((tokenMatch = tokenRegex.exec(text)) !== null) {
        if (tokenMatch.index > lastIdx) {
            segments.push({ type: "text", content: text.slice(lastIdx, tokenMatch.index) });
        }
        segments.push({
            type: tokenMatch[1] === "PRODUCT_CARD" ? "product" : "compare",
            content: tokenMatch[0],
        });
        lastIdx = tokenMatch.index + tokenMatch[0].length;
    }
    if (lastIdx < text.length) {
        segments.push({ type: "text", content: text.slice(lastIdx) });
    }

    return segments.map((segment, segIdx) => {
        if (segment.type === "product") {
            const data = parseProductCard(segment.content);
            if (data) return <ProductCard key={segIdx} data={data} />;
            return null;
        }
        if (segment.type === "compare") {
            const data = parseCompare(segment.content);
            if (data) return <CompareCard key={segIdx} data={data} />;
            return null;
        }

        // Text segment — render blocks
        return renderTextBlocks(segment.content, segIdx);
    });
}

function renderTextBlocks(text: string, baseKey: number) {
    const blocks = text.split(/\n{2,}/).filter(Boolean);

    return blocks.map((block, blockIdx) => {
        const key = `${baseKey}-${blockIdx}`;
        const trimmedBlock = block.trim();
        if (!trimmedBlock) return null;

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
                <ul key={key} className="space-y-1.5 my-3 pl-0.5">
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
                <ol key={key} className="space-y-2 my-3 pl-0.5">
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

        // Multi-line
        if (lines.length > 1) {
            return (
                <div key={key} className="space-y-2 my-2.5">
                    {lines.map((line, i) => {
                        const trimmed = line.trim();
                        if (!trimmed) return null;
                        if (isStandaloneUrl(trimmed)) {
                            return <LinkButton key={i} url={trimmed} />;
                        }
                        return (
                            <p key={i} className="text-[13px] leading-[1.7]">
                                {renderInline(trimmed)}
                            </p>
                        );
                    })}
                </div>
            );
        }

        // Standalone URL
        if (isStandaloneUrl(trimmedBlock)) {
            return <LinkButton key={key} url={trimmedBlock} />;
        }

        // Regular paragraph
        return (
            <p key={key} className="text-[13px] leading-[1.7] my-2.5">
                {renderInline(trimmedBlock)}
            </p>
        );
    });
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export function ChatMessage({ role, content, agentName }: ChatMessageProps) {
    const isUser = role === "user";

    // Skip rendering empty assistant messages (before streaming starts)
    if (!isUser && !content) return null;

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
                    <Bot className="h-3.5 w-3.5 text-primary" />
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
                        <div className="[&>p:first-child]:mt-0 [&>p:last-child]:mb-0 [&>ul:first-child]:mt-0 [&>ol:first-child]:mt-0 [&>div:first-child]:mt-0">
                            {renderFormattedContent(content)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
