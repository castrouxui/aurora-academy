"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { X, ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";
import Link from "next/link";

interface TripwireModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TripwireModal({ isOpen, onClose }: TripwireModalProps) {
    useEffect(() => {
        if (isOpen) {
            // Trigger confetti
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg bg-[#0B0F19] border border-[#5D5CDE]/30 rounded-3xl shadow-2xl shadow-[#5D5CDE]/20 overflow-hidden transform transition-all scale-100">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20"
                >
                    <X size={24} />
                </button>

                {/* Background Effects */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#5D5CDE] to-transparent" />
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#5D5CDE]/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#5D5CDE]/10 blur-[80px] rounded-full pointer-events-none" />

                <div className="p-8 md:p-10 text-center relative z-10">

                    {/* Icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-[#5D5CDE] to-[#3b3a9e] rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-[#5D5CDE]/30 rotate-3 ring-4 ring-[#5D5CDE]/20">
                        <CheckCircle2 size={40} className="text-white" />
                    </div>

                    <h2 className="text-3xl font-black text-white mb-3 tracking-tight">¡Primer Paso Completado!</h2>
                    <p className="text-gray-400 text-base mb-8 leading-relaxed max-w-sm mx-auto">
                        Has finalizado "El camino del inversor". Para convertirte en un profesional, el siguiente paso es dominar los fundamentos.
                    </p>

                    {/* Offer Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 text-left group hover:border-[#5D5CDE]/40 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <div className="bg-[#5D5CDE]/20 text-[#5D5CDE] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-[#5D5CDE]/20">
                                Siguiente Nivel
                            </div>
                            <div className="text-right">
                                <span className="block text-xs text-gray-500 line-through">USD 150</span>
                                <span className="block text-xl font-bold text-white">$7.000 ARS</span>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#5D5CDE] transition-colors">Los 7 Pilares del Éxito en Bolsa</h3>
                        <p className="text-xs text-gray-400 flex items-center gap-1.5">
                            <TrendingUp size={12} />
                            <span>Domina la psicología y gestión de riesgo</span>
                        </p>
                    </div>

                    {/* CTAs */}
                    <div className="space-y-3">
                        <Link
                            href="/cursos/cmleeinzo0000lk6ifkpg84m1"
                            className="flex items-center justify-center w-full bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-[#5D5CDE]/25 gap-2 group"
                        >
                            <span>Obtener Oferta Especial</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            href="/dashboard/carrera/career-trader-100"
                            onClick={onClose}
                            className="block w-full py-2 text-sm text-gray-500 hover:text-white transition-colors font-medium"
                        >
                            Volver a la Ruta de Carrera
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
