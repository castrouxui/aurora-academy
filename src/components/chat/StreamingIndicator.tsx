"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";

export type StreamPhase = "idle" | "thinking" | "streaming";

// Rotating contextual messages while waiting
const THINKING_MESSAGES = [
    "Aurora está pensando…",
    "Buscando la mejor respuesta…",
    "Preparando respuesta…",
    "Consultando información…",
    "Un momento…",
];

interface StreamingIndicatorProps {
    phase: StreamPhase;
}

export function StreamingIndicator({ phase }: StreamingIndicatorProps) {
    const [messageIndex, setMessageIndex] = useState(0);

    // Rotate through messages every 2.5s
    useEffect(() => {
        if (phase !== "thinking") return;
        // Pick a random starting index
        setMessageIndex(Math.floor(Math.random() * THINKING_MESSAGES.length));

        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % THINKING_MESSAGES.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [phase]);

    if (phase === "idle") return null;

    const label = phase === "thinking" ? THINKING_MESSAGES[messageIndex] : "Escribiendo…";

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2.5 mb-4 pl-1"
        >
            {/* Avatar */}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted/60 border border-border/40">
                <Bot className="h-3.5 w-3.5 text-primary animate-pulse" />
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl rounded-bl-lg bg-muted/30 border border-border/20">
                {/* Animated dots */}
                <div className="flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="h-1.5 w-1.5 rounded-full bg-primary/60"
                            animate={{
                                scale: [1, 1.4, 1],
                                opacity: [0.4, 1, 0.4],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.span
                        key={label}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 4 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs text-muted-foreground/70 font-medium"
                    >
                        {label}
                    </motion.span>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
