"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

export function TopBanner() {
    const pathname = usePathname();

    if (pathname === "/membresias" || pathname.startsWith("/learn")) return null;

    return (
        <Link
            href="/membresias"
            className="group block w-full text-white py-2 sm:py-2.5 px-3 sm:px-4 relative z-[501] transition-colors duration-200"
            style={{ backgroundColor: '#5D5CDE' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#4f4ec8')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#5D5CDE')}
        >
            <div className="container mx-auto flex items-center justify-center gap-2 sm:gap-3 text-center">
                <span className="text-xs sm:text-sm font-semibold tracking-wide leading-snug flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
                    <span className="hidden sm:inline">Invertí en tu educación financiera hoy</span>
                    <span className="sm:hidden">25% OFF en planes anuales</span>
                    <span className="relative inline-flex items-center overflow-hidden opacity-90 text-[11px] sm:text-xs font-medium bg-white/15 px-2 py-0.5 rounded-full">
                        <span className="hidden sm:inline">25% OFF + 6 cuotas sin interés</span>
                        <span className="sm:hidden">6 cuotas sin interés</span>
                        <span
                            className="absolute inset-y-0 w-6 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                            style={{ animation: 'shine 3.5s ease-in-out 1.5s infinite', left: '-100%' }}
                        />
                    </span>
                </span>
                <ArrowRight size={13} className="hidden sm:block shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </div>
        </Link>
    );
}
