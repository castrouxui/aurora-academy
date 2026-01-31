"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function TopBanner() {
    return (
        <div className="w-full bg-[#00D415] text-black py-2 px-4 relative z-[501]">
            <div className="container mx-auto flex items-center justify-center gap-2 text-center text-xs md:text-sm font-bold tracking-wide">
                <Link
                    href="/cursos/cml05hq7n00025z0eogogsnge"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                    <span>
                        Registrate en &apos;El camino del inversor&apos; totalmente GRATIS (100% OFF)
                    </span>
                    <ArrowRight size={14} className="animate-pulse" />
                </Link>
            </div>
        </div>
    );
}
