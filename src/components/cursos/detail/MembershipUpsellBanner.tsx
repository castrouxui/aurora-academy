"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface MembershipUpsellBannerProps {
    isFree?: boolean;
    hasAccess?: boolean;
}

/**
 * Sticky top banner shown on the free course page to drive users toward /membresias.
 * Only shown when the course is free and the user doesn't have a paid membership.
 */
export function MembershipUpsellBanner({ isFree, hasAccess }: MembershipUpsellBannerProps) {
    // Only show on the free course to upsell membership
    if (!isFree || hasAccess) return null;

    return (
        <Link
            href="/membresias"
            className={cn(
                "fixed top-0 left-0 right-0 z-[200]",
                "flex items-center justify-center gap-2 px-4 py-2.5",
                "bg-[#5D5CDE] hover:bg-[#4B4AC0] transition-colors duration-200",
                "text-white text-sm font-semibold text-center"
            )}
        >
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 shrink-0" />
            <span>
                Este curso está incluido en la membresía — Ver planes
            </span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </Link>
    );
}
