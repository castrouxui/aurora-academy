"use client";

import { useState } from "react";
import { Send, X, ArrowRight } from "lucide-react";
import Link from "next/link";

export function TelegramReminder({ isVerified }: { isVerified: boolean }) {
    const [isVisible, setIsVisible] = useState(!isVerified);

    if (!isVisible || isVerified) return null;

    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0088cc]/20 to-[#0088cc]/5 border border-[#0088cc]/30 rounded-2xl p-4 mb-8 group animate-in slide-in-from-top-4 duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0088cc]/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-[#0088cc]/20 flex items-center justify-center text-[#0088cc] shadow-lg shadow-[#0088cc]/20">
                        <Send size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white">¡Potenciá tu trading!</h4>
                        <p className="text-xs text-gray-400">Vinculá tu perfil con Telegram para recibir señales y alertas exclusivas.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Link href="/dashboard/configuracion" className="flex-1 sm:flex-initial">
                        <button className="w-full flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-bold py-2.5 px-5 rounded-lg transition-all active:scale-95">
                            Vincular Ahora
                            <ArrowRight size={14} />
                        </button>
                    </Link>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
