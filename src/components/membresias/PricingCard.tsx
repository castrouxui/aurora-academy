"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PricingCheckmark } from "./PricingCheckmark";
import { Lock, CreditCard, ChevronDown } from "lucide-react";
import { useState } from "react";

interface PricingCardProps {
    title: string;
    price: string;
    periodicity: string;
    description: React.ReactNode;
    features: (string | React.ReactNode)[];
    excludedFeatures?: string[];
    isRecommended?: boolean;
    tag?: string;
    buttonText?: string;
    onAction?: () => void;
    className?: string;
    specialFeature?: { title: string; description: string };
    benefitBadge?: string;
    savingsBadge?: string;
    installments?: string;
    isAnnual?: boolean;
    totalPrice?: string;
    savings?: string;
}

export function PricingCard({
    title,
    price,
    periodicity,
    description,
    features,
    excludedFeatures = [],
    isRecommended = false,
    tag,
    buttonText = "Suscribirse",
    onAction,
    className,
    specialFeature,
    benefitBadge,
    savingsBadge,
    installments,
    isAnnual = false,
    totalPrice,
    savings,
}: PricingCardProps) {
    const [showAllFeatures, setShowAllFeatures] = useState(false);
    const MOBILE_VISIBLE_FEATURES = 3;

    return (
        <div
            className={cn(
                "relative flex flex-col rounded-[20px] md:rounded-[24px] border shadow-xl transition-all duration-300 hover:scale-[1.01]",
                // Reduced mobile padding for above-the-fold optimization
                "p-6 md:p-8",
                isRecommended
                    ? "border-white/20 bg-[#10141d] h-full"
                    : "border-white/10 bg-[#10141d] hover:border-white/20 h-full",
                className
            )}
        >
            {/* External Savings Badge (Top Center, Floating) */}
            {savingsBadge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-flex whitespace-nowrap rounded-full bg-gray-900/95 backdrop-blur-sm border border-white/20 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest shadow-lg">
                        {savingsBadge}
                    </span>
                </div>
            )}

            {/* Recommended Tag (Top Right) */}
            {(isRecommended || tag) && (
                <div className="absolute top-4 right-4 md:top-5 md:right-5">
                    <span className="rounded-full bg-gradient-to-r from-[#5D5CDE] to-[#9233EA] px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-[11px] font-bold text-white uppercase tracking-wider shadow-lg shadow-purple-900/50 border border-white/20 animate-pulse">
                        {tag || "Recomendado"}
                    </span>
                </div>
            )}

            <div className="mb-4 md:mb-6 text-left mt-2">
                <div className="flex flex-col gap-2 mb-2">
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">{title}</h3>
                    {/* Internal Benefit Badge (Solid Emerald) */}
                    {benefitBadge && (
                        <span className="inline-block w-fit rounded-lg bg-emerald-600 border border-emerald-500 px-3 py-1.5 text-[11px] md:text-xs font-bold text-white uppercase tracking-wide shadow-lg shadow-emerald-900/30">
                            {benefitBadge}
                        </span>
                    )}
                </div>

                {/* Pricing Display - Different hierarchy for Annual */}
                {isAnnual && installments ? (
                    <div className="mt-2">
                        {/* Installments - Clean Single Line */}
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 shrink-0" />
                            <div className="flex flex-wrap items-baseline gap-1">
                                <span className="text-xs md:text-sm text-gray-500 font-normal">4 cuotas fijas de</span>
                                <span className="text-xl md:text-2xl font-medium tracking-tight text-white">
                                    {installments}
                                </span>
                                <span className="text-xs md:text-sm text-gray-500 font-normal">sin interés</span>
                            </div>
                        </div>
                        {/* Secondary: Total + Savings (Smaller) */}
                        <div className="mt-2 text-xs text-gray-500 font-medium">
                            Total: <span className="text-gray-300 font-semibold">{totalPrice}</span> anual
                            {savings && (
                                <span className="ml-2 text-emerald-400 font-bold">
                                    (Ahorrás {savings})
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-3xl font-black tracking-tighter text-white">
                            {new Intl.NumberFormat("es-AR", {
                                style: "currency",
                                currency: "ARS",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(Number(price.replace(/[^0-9]/g, "")))}
                        </span>
                        <span className="text-sm font-medium text-gray-400">
                            / {periodicity}
                        </span>
                    </div>
                )}
                <div className="mt-3 text-sm text-gray-500 font-normal border-t border-white/5 pt-3 leading-relaxed">
                    {description}
                </div>
            </div>

            <ul className="mb-auto space-y-2.5 flex-1">
                {features.map((feature, index) => {
                    // On mobile, show only first 3 features unless expanded
                    const isHiddenOnMobile = index >= MOBILE_VISIBLE_FEATURES && !showAllFeatures;

                    return (
                        <li
                            key={`inc-${index}`}
                            className={cn(
                                "flex items-start gap-3",
                                isHiddenOnMobile && "hidden md:flex"
                            )}
                        >
                            <PricingCheckmark />
                            <span className="text-sm font-normal text-gray-400 leading-tight w-full">
                                {feature}
                            </span>
                        </li>
                    );
                })}

                {/* Mobile "Show All" Button */}
                {features.length > MOBILE_VISIBLE_FEATURES && !showAllFeatures && (
                    <li className="md:hidden">
                        <button
                            onClick={() => setShowAllFeatures(true)}
                            className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 font-medium"
                        >
                            Ver todos los beneficios ({features.length - MOBILE_VISIBLE_FEATURES} más)
                            <ChevronDown className="w-3 h-3" />
                        </button>
                    </li>
                )}

                {excludedFeatures.map((feature, index) => (
                    <li key={`exc-${index}`} className="flex items-start gap-3 opacity-40">
                        <div className="mt-0.5 min-w-[20px] flex justify-center">
                            <Lock className="h-4 w-4 text-gray-500" />
                        </div>
                        <span className="text-sm text-gray-400 leading-tight w-full">
                            {feature}
                        </span>
                    </li>
                ))}
            </ul>

            {specialFeature && (
                <div className="mt-4 mb-2 rounded-xl bg-[#5D5CDE]/10 border border-[#5D5CDE]/30 p-3">
                    <p className="text-xs font-bold text-[#5D5CDE] mb-0.5 flex items-center gap-2">
                        <PricingCheckmark />
                        {specialFeature.title}
                    </p>
                    <p className="text-[10px] text-gray-400 pl-6 leading-tight">
                        {specialFeature.description}
                    </p>
                </div>
            )}

            <div className="mt-auto pt-6">
                <Button
                    onClick={onAction}
                    className={cn(
                        "w-full h-12 md:h-14 text-sm font-bold transition-all duration-300 rounded-xl relative overflow-hidden",
                        isRecommended
                            ? "bg-gradient-to-r from-[#5D5CDE] via-[#7B68EE] to-[#9233EA] hover:from-[#4B4AC0] hover:via-[#6B58DE] hover:to-[#8123DA] text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-[1.02] animate-shimmer"
                            : "bg-transparent border border-white/30 hover:border-white/50 hover:bg-white text-white hover:text-black hover:scale-[1.01] shadow-sm hover:shadow-md"
                    )}
                >
                    {buttonText}
                </Button>
            </div>
        </div>
    );
}
