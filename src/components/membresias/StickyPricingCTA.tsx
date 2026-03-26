"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StickyPricingCTAProps {
    onScrollToPlans: () => void;
    lowestPlanPrice?: string;
}

/**
 * Sticky bottom bar visible on mobile when scrolling /membresias.
 * Appears after 300px of scroll and scrolls user back to the pricing cards.
 */
export function StickyPricingCTA({ onScrollToPlans, lowestPlanPrice }: StickyPricingCTAProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className={cn(
                "fixed bottom-0 left-0 right-0 z-50 md:hidden",
                "px-4 pb-6 pt-3",
                "bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/97 to-transparent",
                "border-t border-white/5",
                "transition-all duration-300",
                visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
            )}
        >
            <Button
                onClick={onScrollToPlans}
                className="w-full h-13 text-base font-black rounded-xl bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white shadow-xl shadow-indigo-500/25 active:scale-95 transition-all"
            >
                {lowestPlanPrice
                    ? `Ver planes desde ${lowestPlanPrice}/mes`
                    : "Ver planes"}
            </Button>
            <p className="text-center text-[11px] text-emerald-400 font-semibold mt-2">
                🛡️ Garantía de 7 días — sin riesgo
            </p>
        </div>
    );
}
