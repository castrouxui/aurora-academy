"use client";

// import { useChat } from "@ai-sdk/react"; // Removed, using manual implementation due to version issues
import { useState, useEffect, useRef } from "react";
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
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const pathname = usePathname();
    const scrollTriggered = useRef(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [localInput, setLocalInput] = useState("");

    type Role = "user" | "assistant" | "system";
    interface Message {
        id: string;
        role: Role;
        content: string;
    }

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "¡Hola! Soy tu asistente de Aurora Academy. ¿En qué puedo ayudarte hoy?",
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const append = async (message: { role: Role; content: string }) => {
        const newMsg = { ...message, id: Date.now().toString() };
        // Use functional update to ensure we have latest messages if multiple updates occur
        // But for API call we need the array. We can just use the state variable from scope as it updates on re-render.
        // Wait, if we use state variable, we trust React re-renders. 
        // For the API call payload, we should construct it based on current 'messages' + newMsg.

        setMessages((prev) => [...prev, newMsg]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, newMsg], // Note: this uses closure 'messages', ensure it's fresh enough
                    pathname,
                }),
            });

            if (!response.ok) throw new Error("Failed to fetch");

            const reader = response.body?.getReader();
            if (!reader) return;

            const assistantMsgId = (Date.now() + 1).toString();
            // Optimistically add empty assistant message
            setMessages((prev) => [
                ...prev,
                { id: assistantMsgId, role: "assistant", content: "" },
            ]);

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
        } finally {
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

    // Checkout Trigger (Example: if on /checkout)
    useEffect(() => {
        if (pathname?.includes("/checkout") && !isOpen) {
            // Could implement a timer here to trigger "Operator" help
            // For now, we just ensure the widget is available
        }
    }, [pathname, isOpen]);

    // Auto-scroll to bottom using a resize observer or effect dependency on messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]); // Also scroll when opening

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-8 sm:right-8">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className={cn(
                            "origin-bottom-right shadow-2xl transition-all duration-300",
                            isMinimized ? "w-72" : "w-[90vw] sm:w-[400px]"
                        )}
                    >
                        <Card className="border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2 border-b">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <div className="relative">
                                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                    </div>
                                    Aurora AI
                                </CardTitle>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => setIsMinimized(!isMinimized)}
                                    >
                                        {isMinimized ? (
                                            <Maximize2 className="h-3 w-3" />
                                        ) : (
                                            <Minimize2 className="h-3 w-3" />
                                        )}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CardHeader>

                            {!isMinimized && (
                                <>
                                    <CardContent className="h-[400px] overflow-y-auto p-0 px-2 space-y-4">
                                        <div className="flex flex-col gap-2 p-4">
                                            {messages.map((m) => {
                                                // Hide system trigger messages from UI if possible, or filter them
                                                if (m.content === "REQUEST_DIAGNOSIS_START") return null;

                                                // Determine agent name based on content/metadata if available
                                                // For now, we can infer or simpler: The backend could prefix responses or we just use generic
                                                // But ideally, the backend sends structured data. 
                                                // Since we are using standard `useChat` text stream, we'll just show "Aurora AI" or parse if we add prefixes.
                                                // Let's assume the text is plain for now.

                                                return (
                                                    <ChatMessage
                                                        key={m.id}
                                                        role={m.role}
                                                        content={m.content}
                                                        agentName={m.role === 'assistant' ? "Aurora AI" : undefined}
                                                    />
                                                );
                                            })}
                                            <div ref={messagesEndRef} />
                                            {isLoading && (
                                                <div className="flex items-center gap-2 px-4 text-xs text-muted-foreground">
                                                    <span className="animate-pulse">Escribiendo...</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-0">
                                        <ChatInput
                                            input={localInput}
                                            handleInputChange={handleInputChange}
                                            handleSubmit={handleSubmit}
                                            isLoading={isLoading}
                                        />
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
                    className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary text-primary-foreground"
                >
                    <MessageCircle className="h-6 w-6" />
                </Button>
            )}
        </div>
    );
}
