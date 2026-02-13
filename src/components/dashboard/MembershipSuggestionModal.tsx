"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { X, ArrowRight, CheckCircle2, Crown, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MembershipSuggestionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MembershipSuggestionModal({ isOpen, onClose }: MembershipSuggestionModalProps) {
    useEffect(() => {
        if (isOpen) {
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
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg bg-[#0B0F19] border border-amber-500/30 rounded-3xl shadow-2xl shadow-amber-500/10 overflow-hidden transform transition-all scale-100">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20"
                >
                    <X size={24} />
                </button>

                {/* Background Effects */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />

                <div className="p-8 md:p-10 text-center relative z-10">

                    {/* Icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30 ring-4 ring-amber-500/20 animate-pulse">
                        <Crown size={40} className="text-black fill-current" />
                    </div>

                    <h2 className="text-3xl font-black text-white mb-3 tracking-tight">¡Eres un Estratega!</h2>
                    <p className="text-gray-400 text-base mb-8 leading-relaxed max-w-sm mx-auto">
                        Has completado los pilares fundamentales. Estás listo para operar en vivo con nosotros y recibir señales diarias.
                    </p>

                    {/* Offer Card */}
                    <div className="relative bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/20 rounded-2xl p-6 mb-8 text-left group hover:border-amber-500/40 transition-colors">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-amber-500/20">
                            Recomendado para ti
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500">
                                <Zap size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Membresía Aurora Pro</h3>
                                <p className="text-xs text-gray-400">Acceso total a educación y señales</p>
                            </div>
                        </div>

                        <ul className="space-y-2 mb-0">
                            <li className="flex items-center gap-2 text-sm text-gray-300">
                                <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                                <span>Señales de trading en vivo</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-300">
                                <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                                <span>Mentoria semanal exclusiva</span>
                            </li>
                        </ul>
                    </div>

                    {/* CTAs */}
                    <div className="space-y-3">
                        <Link href="/membresias" className="block w-full">
                            <Button className="w-full h-14 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold rounded-xl shadow-lg shadow-amber-500/20 gap-2 group text-base border-0">
                                <span>Ver Planes de Membresía</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>

                        <button
                            onClick={onClose}
                            className="block w-full py-2 text-sm text-gray-500 hover:text-white transition-colors font-medium"
                        >
                            Ver más tarde
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
