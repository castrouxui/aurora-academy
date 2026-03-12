"use client";

import { useState } from "react";
import { Bot, X, Sparkles, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function AiChatWidget() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end">

            {/* Chat Window */}
            <div
                className={cn(
                    "mb-4 w-[340px] bg-white/90 backdrop-blur-2xl border border-border shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2rem] overflow-hidden transition-all duration-500 origin-bottom-right",
                    isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none"
                )}
            >
                {/* Header */}
                <div className="bg-foreground text-background p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">Aurora Copilot</h4>
                            <p className="text-[10px] text-background/60">Asistente de IA (Beta)</p>
                        </div>
                    </div>
                </div>

                {/* Chat Body */}
                <div className="p-5 h-[250px] overflow-y-auto bg-muted/20 flex flex-col gap-4">
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 shrink-0 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-border/50 shadow-sm text-sm text-foreground/80 font-medium">
                            ¡Hola! Soy el asistente con IA de Aurora Academy. ¿Querés saber qué nivel de curso se adapta a tu perfil?
                        </div>
                    </div>
                    {/* Fake typing indicator */}
                    <div className="flex gap-1 ml-11 opacity-50">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-3 bg-white border-t border-border flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Preguntame lo que sea..."
                        className="flex-1 bg-muted/50 border-none rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                        disabled
                    />
                    <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-sm opacity-50 cursor-not-allowed">
                        <Send className="w-4 h-4 ml-0.5" />
                    </button>
                </div>
            </div>

            {/* Floating Orb Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center shadow-xl hover:shadow-[0_0_30px_rgba(93,92,222,0.4)] transition-all duration-500 hover:scale-110 active:scale-95 z-[1000]"
            >
                {/* Glowing ring animation */}
                <div className="absolute inset-0 rounded-full border border-primary/30 animate-[ping_3s_ease-out_infinite] pointer-events-none" />

                {isOpen ? (
                    <X className="w-7 h-7 transition-transform duration-300 rotate-90 group-hover:rotate-180" />
                ) : (
                    <Sparkles className="w-7 h-7 text-primary transition-transform duration-300 group-hover:scale-110" />
                )}
            </button>

        </div>
    );
}
