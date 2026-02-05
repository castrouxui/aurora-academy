"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { X, Copy, CheckCircle } from "lucide-react";

interface RewardModalProps {
    isOpen: boolean;
    onClose: () => void;
    couponCode: string;
}

export function RewardModal({ isOpen, onClose, couponCode }: RewardModalProps) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Trigger confetti
            const duration = 5 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);

                // since particles fall down, start a bit higher than random
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [isOpen]);

    const handleCopy = () => {
        navigator.clipboard.writeText(couponCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-md bg-[#101319] border border-[#5D5CDE]/30 rounded-2xl shadow-2xl shadow-[#5D5CDE]/20 overflow-hidden transform transition-all scale-100">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
                >
                    <X size={20} />
                </button>

                {/* Decoration */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#5D5CDE] to-transparent" />
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#5D5CDE]/20 blur-3xl rounded-full" />
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#5D5CDE]/20 blur-3xl rounded-full" />

                <div className="p-8 text-center relative z-10">
                    {/* Icon / Badge */}
                    <div className="w-16 h-16 bg-[#5D5CDE]/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-[#5D5CDE]/40">
                        <span className="text-3xl">🎓</span>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">¡Objetivo Cumplido!</h2>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                        Completaste el curso con éxito. Como premio a tu constancia, tenés un <span className="text-[#5D5CDE] font-bold">10% de descuento</span> en tu primer mes de membresía.
                    </p>

                    {/* Coupon Box */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 flex items-center justify-between gap-3 group hover:border-[#5D5CDE]/50 transition-colors">
                        <div className="flex flex-col items-start">
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Tu Cupón</span>
                            <span className="text-lg font-mono font-bold text-white tracking-widest">{couponCode}</span>
                        </div>
                        <button
                            onClick={handleCopy}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white relative"
                            title="Copiar código"
                        >
                            {copied ? <CheckCircle size={20} className="text-green-400" /> : <Copy size={20} />}
                        </button>
                    </div>

                    {/* CTA */}
                    <div className="space-y-3">
                        <a
                            href="https://auroracademy.net/membresias"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-[#5D5CDE]/25"
                        >
                            Canjear mi descuento ahora
                        </a>
                        <button
                            onClick={onClose}
                            className="block w-full py-2 text-sm text-gray-500 hover:text-white transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
