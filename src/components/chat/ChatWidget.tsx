"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { MessageCircle, X, Minimize2, Maximize2 } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { StreamingIndicator, type StreamPhase } from "./StreamingIndicator";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Course title map for contextual welcomes ─── */
const COURSE_TITLES: Record<string, string> = {
    cml05hq7n00025z0eogogsnge: "El camino del inversor",
    cmk76vago00052i3oi9ajtj81: "Análisis Técnico",
    cmk77d6jw00162i3o2xduugqj: "Renta Fija",
    cmkvizzkv000014opaskujn6u: "Finanzas Personales",
    cmkbfyovj0000iv7p7dwuyjbc: "Opciones Financieras",
    cmke3r7q600025b9gasf4r0jr: "Futuros Financieros",
    cml2grqhs0005szmiu6q72oaw: "Fondos Comunes de Inversión",
    cml2ggu690000szmi2uarsi6e: "Machine Learning e IA",
    cmky03zq30004t8b2fwg93678: "Testing con IA",
    cmkigsyen000kkb3n05vphttk: "Valuación de Bonos",
    cmleeinzo0000lk6ifkpg84m1: "Los 7 Pilares del Éxito en Bolsa",
    cmkigoac4000akb3nnhyypiic: "Domina el Stop Loss",
    cmkigqmn4000fkb3nd3eyxd5m: "El Valor del Tiempo: TNA, TEA y TIR",
    cmkigidme0000kb3nyhnjeyt6: "Beneficio vs. Caja",
    cmkigm36w0005kb3n1hkgjuin: "Dominando el Riesgo",
    cmkb3mgzw0000d3a47s50rk9t: "Introducción al Mercado de Capitales",
    cmkb3vwqf0001yj6t5lbqq7h8: "Mentoría Análisis Técnico",
    cmkb45yfn0000l51swh07aw37: "Mentoría Gestión de Cartera",
    cmkb3u2nv0000yj6tef9f2xup: "Análisis Fundamental",
    cmk76jxm700002i3ojyfpjbm5: "Price Action",
    cmku6uohg000014bcqk7yysrc: "IA en Inversiones",
    cmlpu5m900000fugwd22skz53: "Manejo de TradingView",
};

/* ─── Should this page auto-open the chat? ─── */
function shouldAutoOpen(pathname: string): boolean {
    if (pathname.includes("/membresias")) return true;
    if (pathname.match(/\/cursos(\/[a-z0-9]+)?$/i)) return true;
    return false;
}

function getContextualWelcome(pathname: string): string {
    // Specific course page
    const courseMatch = pathname.match(/\/cursos\/([a-z0-9]+)/i);
    if (courseMatch) {
        const title = COURSE_TITLES[courseMatch[1]];
        if (title) {
            return `¡Hola! Soy **Aurora** 🤖 Veo que estás explorando **${title}**. ¿Sabías que con una membresía accedés a este curso y muchos más? Preguntame y te ayudo a elegir la mejor opción.`;
        }
        return "¡Hola! Soy **Aurora** 🤖 Veo que estás mirando un curso. ¿Querés que te cuente sobre las ventajas de la membresía vs comprarlo individual?";
    }

    // Courses listing
    if (pathname === "/cursos" || pathname === "/cursos/") {
        return "¡Hola! Soy **Aurora** 🤖 ¿Buscás un curso puntual o preferís acceso a todo el ecosistema con una membresía? Te ayudo a elegir.";
    }

    // Memberships page
    if (pathname.includes("/membresias")) {
        return "¡Hola! Soy **Aurora** 🤖 Estás mirando nuestras membresías. ¿Querés que te ayude a comparar los planes y encontrar el ideal para vos?";
    }

    // Checkout page
    if (pathname.includes("/checkout")) {
        return "¡Hola! Soy **Aurora** 🤖 Estoy acá por si necesitás algo antes de completar tu compra. ¿Tenés alguna duda?";
    }

    // Dashboard
    if (pathname.includes("/dashboard")) {
        return "¡Hola! Soy **Aurora** 🤖 ¿Cómo va tu formación? Si necesitás orientación sobre qué curso seguir, preguntame.";
    }

    // Default (home)
    return "¡Hola! Soy **Aurora**, tu asistente de IA en Aurora Academy 🤖 Para orientarte mejor, ¿qué experiencia tenés hoy en los mercados?";
}

type Role = "user" | "assistant" | "system";

interface Message {
    id: string;
    role: Role;
    content: string;
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const pathname = usePathname();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [localInput, setLocalInput] = useState("");
    const [streamPhase, setStreamPhase] = useState<StreamPhase>("idle");

    // Contextual welcome message based on URL
    const welcomeMessage = useMemo(() => getContextualWelcome(pathname || "/"), [pathname]);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: welcomeMessage,
        },
    ]);

    // Ref to always hold fresh messages (avoids stale closure in append)
    const messagesRef = useRef<Message[]>(messages);
    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    // Update welcome when pathname changes and chat hasn't been used yet
    useEffect(() => {
        setMessages((prev) => {
            if (prev.length === 1 && prev[0].id === "welcome") {
                return [{ id: "welcome", role: "assistant", content: getContextualWelcome(pathname || "/") }];
            }
            return prev;
        });
    }, [pathname]);

    const append = useCallback(async (message: { role: Role; content: string }) => {
        const newMsg: Message = { ...message, id: Date.now().toString() };

        setMessages((prev) => [...prev, newMsg]);
        setStreamPhase("connecting");

        // Phase progression: connecting → analyzing (after 1.5s)
        const phaseTimer = setTimeout(() => {
            setStreamPhase("analyzing");
        }, 1500);

        try {
            // Use ref for fresh message history (avoids stale closure)
            const currentMessages = [...messagesRef.current, newMsg];

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: currentMessages,
                    pathname,
                }),
            });

            clearTimeout(phaseTimer);

            if (!response.ok) {
                const errorText = await response.text().catch(() => "");
                throw new Error(`API error ${response.status}: ${errorText}`);
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error("No response body");

            const assistantMsgId = (Date.now() + 1).toString();
            setMessages((prev) => [
                ...prev,
                { id: assistantMsgId, role: "assistant", content: "" },
            ]);

            // Switch to streaming phase on first chunk
            setStreamPhase("streaming");

            const decoder = new TextDecoder();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const text = decoder.decode(value, { stream: true });
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantMsgId
                            ? { ...m, content: m.content + text }
                            : m
                    )
                );
            }
        } catch (error) {
            console.error("Chat error:", error);
            // Show error as a visible message in the chat instead of a toast
            const errorMsgId = `error-${Date.now()}`;
            setMessages((prev) => [
                ...prev,
                {
                    id: errorMsgId,
                    role: "assistant",
                    content: "⚠️ No pude conectar con el asistente en este momento. Intentá de nuevo en unos segundos.",
                },
            ]);
        } finally {
            clearTimeout(phaseTimer);
            setStreamPhase("idle");
        }
    }, [pathname]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalInput(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!localInput.trim() || streamPhase !== "idle") return;
        append({ role: "user", content: localInput });
        setLocalInput("");
    };

    // Auto-open on sales pages (courses, memberships) after 3s
    const autoOpenTriggered = useRef(false);
    useEffect(() => {
        if (autoOpenTriggered.current || isOpen) return;
        if (shouldAutoOpen(pathname || "/")) {
            const timer = setTimeout(() => {
                if (!autoOpenTriggered.current) {
                    autoOpenTriggered.current = true;
                    setIsOpen(true);
                }
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [pathname, isOpen]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen, streamPhase]);

    return (
        <div className={cn(
            "fixed z-50 transition-all duration-300",
            isOpen ? "inset-0 sm:inset-auto sm:bottom-8 sm:right-8" : "bottom-24 right-4 sm:bottom-8 sm:right-8"
        )}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className={cn(
                            "origin-bottom-right shadow-2xl transition-all duration-300 flex flex-col bg-background/95 backdrop-blur-xl border border-border/50",
                            "w-full h-[100dvh] sm:rounded-2xl sm:h-[600px] sm:w-[400px]",
                            isMinimized && "sm:w-72 sm:h-auto"
                        )}
                    >
                        <Card className="flex flex-col h-full border-0 bg-transparent shadow-none">
                            {/* Header */}
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-3 border-b shrink-0 bg-background/50 backdrop-blur-md">
                                <CardTitle className="text-sm font-medium flex items-center gap-2.5">
                                    <div className="relative flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 border border-primary/20">
                                        <Bot className="h-4 w-4 text-primary" />
                                        <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background animate-pulse" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold tracking-wide text-sm leading-tight">Aurora</span>
                                        <span className="text-[10px] font-normal text-muted-foreground/60 leading-tight">Asistente de IA</span>
                                    </div>
                                </CardTitle>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-muted/50 hidden sm:flex"
                                        onClick={() => setIsMinimized(!isMinimized)}
                                    >
                                        {isMinimized ? (
                                            <Maximize2 className="h-4 w-4" />
                                        ) : (
                                            <Minimize2 className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-muted/50"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardHeader>

                            {!isMinimized && (
                                <>
                                    {/* Messages */}
                                    <CardContent className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-muted/50 scrollbar-track-transparent">
                                        <div className="flex flex-col p-4 pb-2">
                                            {messages.map((m) => (
                                                <ChatMessage
                                                    key={m.id}
                                                    role={m.role}
                                                    content={m.content}
                                                    agentName={m.role === "assistant" ? "Aurora" : undefined}
                                                />
                                            ))}

                                            {/* Streaming phase indicator */}
                                            <AnimatePresence>
                                                {streamPhase !== "idle" && streamPhase !== "streaming" && (
                                                    <StreamingIndicator phase={streamPhase} />
                                                )}
                                            </AnimatePresence>

                                            <div ref={messagesEndRef} className="h-1" />
                                        </div>
                                    </CardContent>

                                    {/* Input — sticky bottom */}
                                    <CardFooter className="p-0 shrink-0 bg-background/50 backdrop-blur-md border-t sticky bottom-0">
                                        <div className="w-full pb-[env(safe-area-inset-bottom)]">
                                            <ChatInput
                                                input={localInput}
                                                handleInputChange={handleInputChange}
                                                handleSubmit={handleSubmit}
                                                isLoading={streamPhase !== "idle"}
                                            />
                                        </div>
                                    </CardFooter>
                                </>
                            )}
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    size="icon"
                    className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary text-primary-foreground hover:scale-105 active:scale-95"
                >
                    <MessageCircle className="h-6 w-6" />
                </Button>
            )}
        </div>
    );
}
