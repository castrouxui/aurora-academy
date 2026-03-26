"use client";

import { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PreviewModal() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText("LANZAMIENTO10");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
            <div className="relative w-full max-w-[480px] overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F19] p-6 sm:p-8 shadow-2xl shadow-purple-500/10">
                <button className="absolute right-4 top-4 p-1 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                    <X className="h-5 w-5" />
                </button>

                <div className="text-center space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                        <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Oferta exclusiva</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                        Antes de irte — 10% OFF en tu primer mes
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                        Válido para membresías mensuales, cursos, mentorías y micro-cursos. <span className="text-gray-500">No aplica en planes anuales.</span>
                    </p>
                    <button
                        onClick={handleCopy}
                        className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-xl py-3 px-4 flex items-center justify-between gap-3 transition-colors group"
                    >
                        <div className="text-left">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">Tu cupón — tocá para copiar</p>
                            <p className="text-lg font-black text-white font-mono tracking-widest">LANZAMIENTO10</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-lg px-3 py-2 text-center">
                                <p className="text-emerald-400 font-black text-xl leading-none">10%</p>
                                <p className="text-emerald-500 text-[10px] font-bold">OFF</p>
                            </div>
                            <div className="text-gray-500 group-hover:text-gray-300 transition-colors">
                                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                            </div>
                        </div>
                    </button>
                    {copied && (
                        <p className="text-center text-xs text-emerald-400 font-semibold animate-in fade-in duration-200">
                            ¡Cupón copiado!
                        </p>
                    )}
                    <div className="space-y-2 pt-1">
                        <Link href="/membresias?billing=monthly#precios">
                            <Button className="w-full h-12 text-sm sm:text-base font-black bg-[#5D5CDE] hover:bg-[#4b4ac0] text-white shadow-lg shadow-purple-500/25 active:scale-95 transition-all">
                                Quiero mi 10% off →
                            </Button>
                        </Link>
                        <button className="text-xs text-gray-600 hover:text-gray-500 transition-colors w-full py-1">
                            No gracias, prefiero pagar precio completo
                        </button>
                    </div>
                    <p className="text-xs text-gray-500">🛡️ Garantía de 7 días — sin riesgo</p>
                </div>
            </div>
        </div>
    );
}
