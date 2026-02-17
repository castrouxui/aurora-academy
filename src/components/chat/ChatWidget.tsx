"use client";

import { useChat } from "@ai-sdk/react";
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

    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        append,
        setMessages,
    } = useChat({
        api: "/api/chat",
        initialMessages: [
            {
                id: "welcome",
                role: "assistant",
                content: "¡Hola! Soy tu asistente de Aurora Academy. ¿En qué puedo ayudarte hoy?",
            },
        ],
        body: {
            pathname, // Pass current path to context
        },
    });

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
                                            input={input}
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
