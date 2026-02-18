"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";

export type StreamPhase = "idle" | "connecting" | "analyzing" | "streaming";

const PHASE_LABELS: Record<Exclude<StreamPhase, "idle">, string> = {
    connecting: "Consultando disponibilidad",
    analyzing: "Analizando perfil",
    streaming: "Escribiendo",
};

interface StreamingIndicatorProps {
    phase: StreamPhase;
}

export function StreamingIndicator({ phase }: StreamingIndicatorProps) {
    const [dots, setDots] = useState("");

    useEffect(() => {
        if (phase === "idle") return;
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 400);
        return () => clearInterval(interval);
    }, [phase]);

    if (phase === "idle") return null;

    const label = PHASE_LABELS[phase];

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2.5 mb-4 pl-1"
        >
            {/* Avatar placeholder */}
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
                        key={phase}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 4 }}
                        className="text-xs text-muted-foreground/70 font-medium"
                    >
                        {label}{dots}
                    </motion.span>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
