"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

export function TopBanner() {
    const pathname = usePathname();

    if (pathname === "/membresias") return null;

    return (
        <Link
            href="/membresias"
            className="group block w-full bg-primary text-white py-2.5 px-4 relative z-[501] transition-colors duration-200 hover:bg-primary/90"
        >
            <div className="container mx-auto flex items-center justify-center gap-3 text-center">
                <span className="text-sm font-semibold tracking-wide flex items-center gap-1.5 flex-wrap justify-center">
                    25% OFF + 6 cuotas sin interés en planes anuales <span className="opacity-80 text-xs font-medium ml-1 bg-white/10 px-2 py-0.5 rounded-full">(válido solo por el mes de marzo)</span>
                </span>
                <ArrowRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </div>
        </Link>
    );
}
