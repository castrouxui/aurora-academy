"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export function PromotionalBanner() {
    return (
        <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-[#5D5CDE] to-[#3B82F6] p-1 shadow-2xl shadow-indigo-500/20 group">
            {/* Animated Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-[shimmer_3s_infinite] pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 bg-[#0B0F19]/90 backdrop-blur-xl rounded-[20px] p-6 md:p-8 h-full">

                {/* Content */}
                <div className="flex-1 space-y-2 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <Zap size={12} className="fill-current" />
                        <span>Oferta Especial</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-white italic tracking-tight">
                        Desbloquea tu Potencial <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5D5CDE] to-indigo-400">Completo</span>
                    </h2>
                    <p className="text-muted-foreground text-sm md:text-base max-w-xl">
                        Aún no has adquirido ningún curso. Únete a los miles de estudiantes que ya están transformando su futuro con Aurora Academy.
                    </p>
                </div>

                {/* CTA */}
                <div className="shrink-0 w-full md:w-auto">
                    <Link href="/membresias">
                        <Button className="w-full h-14 px-8 text-lg font-bold bg-white text-black hover:bg-gray-100 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] shiny-hover rounded-xl flex items-center justify-center gap-2 group-hover:gap-3">
                            <Sparkles size={20} className="text-amber-500 fill-current animate-pulse" />
                            Obtener Membresía
                            <ArrowRight size={20} />
                        </Button>
                    </Link>
                    <p className="text-center mt-3 text-xs text-muted-foreground">
                        Garantía de 7 días • Acceso inmediato
                    </p>
                </div>

                {/* Decorative Background Blobs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />
            </div>
        </div>
    );
}
