"use client";

// import { useChat } from "@ai-sdk/react"; // Using manual implementation due to version issues
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { MessageCircle, X, Minimize2, Maximize2, AlertCircle } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatSkeleton } from "./ChatSkeleton";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner"; // Assuming Sonner is installed

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const pathname = usePathname();
    const scrollTriggered = useRef(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const [localInput, setLocalInput] = useState("");

    type Role = "user" | "assistant" | "system";
    interface Message {
        id: string;
        role: Role;
        content: string;
        isThinking?: boolean;
    }

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Hola, soy tu guía en Aurora. Para orientarte mejor con los cursos, ¿qué experiencia tenés hoy en los mercados?",
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isTimeoutWarning, setIsTimeoutWarning] = useState(false);

    const append = async (message: { role: Role; content: string }) => {
        const newMsg = { ...message, id: Date.now().toString() };

        setMessages((prev) => [...prev, newMsg]);
        setIsLoading(true);
        setIsTimeoutWarning(false);

        // Timeout Warning Logic (5s)
        const timeoutId = setTimeout(() => {
            setIsTimeoutWarning(true);
        }, 5000);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, newMsg],
                    pathname,
                }),
            });

            clearTimeout(timeoutId); // Clear timeout if response starts before 5s
            if (!response.ok) throw new Error("Failed to fetch");

            const reader = response.body?.getReader();
            if (!reader) return;

            const assistantMsgId = (Date.now() + 1).toString();
            // Optimistically add empty assistant message to start streaming into
            setMessages((prev) => [
                ...prev,
                { id: assistantMsgId, role: "assistant", content: "" }, // Start empty
            ]);

            // Disable loading indicator once streaming starts, as we show the message grow
            setIsLoading(false);
            setIsTimeoutWarning(false);

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
                // Scroll to bottom on update
                // Use scrollIntoView with 'auto' for performance during streaming
                // Or just rely on useEffect
            }
        } catch (error) {
            console.error("Chat error:", error);
            toast.error("Hubo un error al conectar con el asistente.");
            setIsLoading(false);
            setIsTimeoutWarning(false);
        } finally {
            clearTimeout(timeoutId);
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalInput(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!localInput.trim()) return;
        append({ role: "user", content: localInput });
        setLocalInput("");
    };

    // Scroll Trigger for Home Page
    useEffect(() => {
        if (pathname === "/" && !scrollTriggered.current) {
            const handleScroll = () => {
                const scrollPercentage =
                    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
                    100;
                if (scrollPercentage > 50 && !isOpen) {
                    scrollTriggered.current = true;
                    setIsOpen(true);
                    // Trigger Mentor Diagnosis
                    append({
                        role: "user",
                        content: "REQUEST_DIAGNOSIS_START",
                    });
                }
            };
            window.addEventListener("scroll", handleScroll);
            return () => window.removeEventListener("scroll", handleScroll);
        }
    }, [pathname, isOpen, append]);

    // Checkout Trigger
    useEffect(() => {
        if (pathname?.includes("/checkout") && !isOpen) {
            // Logic handled by backend context, UI just needs to be ready
        }
    }, [pathname, isOpen]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen, isTimeoutWarning]);

    return (
        <div className={cn(
            "fixed z-50 transition-all duration-300",
            isOpen ? "inset-0 sm:inset-auto sm:bottom-8 sm:right-8" : "bottom-4 right-4 sm:bottom-8 sm:right-8"
        )}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className={cn(
                            "origin-bottom-right shadow-2xl transition-all duration-300 flex flex-col bg-background/95 backdrop-blur-xl border-border/50",
                            // Mobile Fullscreen
                            "w-full h-[100dvh] sm:rounded-2xl sm:h-[600px] sm:w-[400px]",
                            isMinimized && "sm:w-72 sm:h-auto"
                        )}
                    >
                        <Card className="flex flex-col h-full border-0 bg-transparent shadow-none">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b shrink-0 bg-background/50 backdrop-blur-md">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <div className="relative">
                                        <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                    </div>
                                    <span className="font-semibold tracking-wide">Aurora AI</span>
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
                                    <CardContent className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-muted/50 scrollbar-track-transparent">
                                        <div className="flex flex-col p-4 pb-2">
                                            {messages.map((m) => {
                                                if (m.content === "REQUEST_DIAGNOSIS_START") return null;
                                                return (
                                                    <ChatMessage
                                                        key={m.id}
                                                        role={m.role}
                                                        content={m.content}
                                                        agentName={m.role === 'assistant' ? "Aurora AI" : undefined}
                                                    />
                                                );
                                            })}

                                            {/* Timeout Warning Message */}
                                            {isTimeoutWarning && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs"
                                                >
                                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                                    <span>Estoy revisando los detalles técnicos para darte la respuesta más precisa, dame un segundo más...</span>
                                                </motion.div>
                                            )}

                                            {/* Skeleton Loader */}
                                            {isLoading && <ChatSkeleton />}

                                            <div ref={messagesEndRef} className="h-1" />
                                        </div>
                                    </CardContent>

                                    <CardFooter className="p-0 shrink-0 bg-background/50 backdrop-blur-md border-t">
                                        <div className="w-full pb-[env(safe-area-inset-bottom)]">
                                            <ChatInput
                                                input={localInput}
                                                handleInputChange={handleInputChange}
                                                handleSubmit={handleSubmit}
                                                isLoading={isLoading}
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
