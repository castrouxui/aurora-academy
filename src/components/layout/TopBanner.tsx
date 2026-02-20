"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function TopBanner() {
    const pathname = usePathname();

    if (pathname === "/membresias") return null;

    return (
        <Link
            href="/membresias"
            className="block w-full bg-emerald-600 text-white py-2.5 px-4 relative z-[501] shadow-lg overflow-hidden group hover:bg-emerald-700 transition-colors duration-300"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 animate-shimmer bg-[length:200%_100%] opacity-50 group-hover:opacity-75 transition-opacity" />

            <div className="container mx-auto relative z-10 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center">
                <span className="text-sm md:text-base font-black tracking-wide uppercase flex items-center gap-2">
                    🚀 25% OFF + 12 CUOTAS SIN INTERÉS EN PLANES ANUALES.
                </span>
            </div>
        </Link>
    );
}
