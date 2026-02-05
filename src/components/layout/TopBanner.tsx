"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

export function TopBanner() {
    const pathname = usePathname();
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const TARGET_DATE = new Date("2026-03-02T00:00:00").getTime();

    if (pathname === "/membresias") return null;

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = TARGET_DATE - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full bg-emerald-600 text-white py-2.5 px-4 relative z-[501] shadow-lg overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 animate-shimmer bg-[length:200%_100%] opacity-50" />

            <div className="container mx-auto relative z-10 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center">
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    <span className="text-[11px] md:text-sm font-black tracking-wide uppercase">
                        ¡Oferta de lanzamiento oficial! 25% OFF
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 font-display tabular-nums">
                        <div className="flex flex-col items-center">
                            <span className="text-xs md:text-base font-black">{String(timeLeft.days).padStart(2, '0')}</span>
                            <span className="text-[7px] md:text-[8px] uppercase font-bold opacity-70">Días</span>
                        </div>
                        <span className="text-xs md:text-base font-black opacity-50">:</span>
                        <div className="flex flex-col items-center">
                            <span className="text-xs md:text-base font-black">{String(timeLeft.hours).padStart(2, '0')}</span>
                            <span className="text-[7px] md:text-[8px] uppercase font-bold opacity-70">Hrs</span>
                        </div>
                        <span className="text-xs md:text-base font-black opacity-50">:</span>
                        <div className="flex flex-col items-center">
                            <span className="text-xs md:text-base font-black">{String(timeLeft.minutes).padStart(2, '0')}</span>
                            <span className="text-[7px] md:text-[8px] uppercase font-bold opacity-70">Min</span>
                        </div>
                        <span className="text-xs md:text-base font-black opacity-50">:</span>
                        <div className="flex flex-col items-center">
                            <span className="text-xs md:text-base font-black">{String(timeLeft.seconds).padStart(2, '0')}</span>
                            <span className="text-[7px] md:text-[8px] uppercase font-bold opacity-70">Seg</span>
                        </div>
                    </div>

                    <Link
                        href="/membresias"
                        className="hidden md:flex items-center gap-2 bg-white text-emerald-700 px-4 py-1 rounded-full text-xs font-black hover:scale-105 transition-transform shadow-xl"
                    >
                        Ver ofertas
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
