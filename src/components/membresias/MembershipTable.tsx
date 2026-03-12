"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/constants/pricing";

interface MembershipTableProps {
    bundles: any[];
    billingCycle: "monthly" | "annual";
    onPurchase: (title: string, price: string, courseId?: string, bundleId?: string, isAnnual?: boolean) => void;
}

// Tier metadata per plan index
const TIER_META = [
    { label: "Inicial",   icon: "◆" },
    { label: "Elite",     icon: "◈" },
    { label: "Pro",       icon: "◉" },
];

function CheckIcon({ recommended }: { recommended?: boolean }) {
    return (
        <svg
            className={cn("w-4 h-4 flex-shrink-0 mt-0.5", recommended ? "text-primary" : "text-white/40")}
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M13.25 4.75L6 12L2.75 8.75"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function XIcon() {
    return (
        <svg
            className="w-4 h-4 flex-shrink-0 mt-0.5 text-white/20"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
        >
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

function formatPrice(n: number) {
    return new Intl.NumberFormat("es-AR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(n);
}

export function MembershipTable({ bundles, billingCycle, onPurchase }: MembershipTableProps) {
    const displayItems = useMemo(() => {
        const sourceData = PLANS.map((p, idx) => {
            const matchedBundle = bundles.find((b: any) =>
                b.title.toLowerCase().includes(p.title.toLowerCase().split(" ")[0]) ||
                (idx === 1 && b.title.toLowerCase().includes("elite")) ||
                (idx === 2 && b.title.toLowerCase().includes("portfolio"))
            );
            return { ...p, id: matchedBundle?.id };
        });

        return sourceData.map((item, index, arr) => {
            const basePrice = parseFloat(item.price);

            let finalPrice = basePrice;
            let monthlyDisplay = basePrice;
            let installmentsText: string | undefined;
            let annualTotal: string | undefined;

            if (billingCycle === "annual") {
                finalPrice = basePrice * 9;
                monthlyDisplay = Math.round(finalPrice / 12);
                const installmentAmount = finalPrice / 6;
                installmentsText = `6 cuotas sin interés de ${new Intl.NumberFormat("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    maximumFractionDigits: 0,
                }).format(installmentAmount)}`;
                annualTotal = new Intl.NumberFormat("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    maximumFractionDigits: 0,
                }).format(finalPrice);
            }

            let displayFeatures: string[] = [];
            if (index > 0) {
                displayFeatures.push(`__INCLUDE__${arr[index - 1].title}`);
            }
            displayFeatures.push(...item.features);

            return {
                ...item,
                basePrice,
                finalPrice,
                monthlyDisplay,
                installmentsText,
                annualTotal,
                displayFeatures,
            };
        });
    }, [bundles, billingCycle]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start max-w-[1060px] mx-auto">
            {displayItems.map((plan, idx) => {
                const { isRecommended } = plan;
                const tier = TIER_META[idx] ?? TIER_META[0];

                return (
                    <div
                        key={idx}
                        className={cn(
                            "relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300",
                            isRecommended
                                ? "border border-primary/40 shadow-2xl shadow-primary/10 ring-1 ring-primary/15 md:-mt-4 md:mb-4"
                                : "border border-white/[0.08] hover:border-white/[0.14]"
                        )}
                    >
                        {/* ── CARD HEADER ────────────────────────────────────── */}
                        <div className={cn(
                            "px-6 pt-6 pb-5 border-b",
                            isRecommended
                                ? "bg-gradient-to-br from-primary/[0.18] via-primary/[0.08] to-transparent border-primary/20"
                                : "bg-white/[0.025] border-white/[0.06]"
                        )}>
                            {/* Tier badge row */}
                            <div className="flex items-center justify-between mb-3">
                                <span className={cn(
                                    "inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] px-2.5 py-1 rounded-md",
                                    isRecommended
                                        ? "bg-primary/25 text-primary border border-primary/30"
                                        : "bg-white/[0.06] text-white/40 border border-white/[0.08]"
                                )}>
                                    <span className="text-[11px]">{tier.icon}</span>
                                    {tier.label}
                                </span>

                                {isRecommended && (
                                    <span className="text-[10px] font-bold text-amber-400/90 flex items-center gap-1">
                                        👑 Más elegido
                                    </span>
                                )}
                            </div>

                            {/* Plan name */}
                            <h3 className={cn(
                                "text-[21px] font-black tracking-tight leading-tight",
                                isRecommended ? "text-white" : "text-white/80"
                            )}>
                                {plan.title}
                            </h3>

                            {/* Description */}
                            <p className="text-[13px] text-white/45 leading-relaxed mt-1.5 min-h-[36px]">
                                {plan.description}
                            </p>
                        </div>

                        {/* ── CARD BODY ──────────────────────────────────────── */}
                        <div className={cn(
                            "flex flex-col flex-1 px-6 pt-5 pb-6",
                            isRecommended ? "bg-[#0e0e12]" : "bg-[#0c0c0f]"
                        )}>

                            {/* Price block */}
                            <div className="mb-5">
                                {/* Crossed-out original price */}
                                <p className="text-[12px] text-white/30 line-through font-medium mb-0.5">
                                    ${formatPrice(plan.basePrice)}/mes
                                </p>

                                {/* Main price row */}
                                <div className="flex items-baseline gap-1 leading-none">
                                    <span className="text-base font-bold text-white/40">$</span>
                                    <span className={cn(
                                        "text-[42px] font-black tracking-tighter leading-none",
                                        isRecommended ? "text-white" : "text-white/80"
                                    )}>
                                        {formatPrice(plan.monthlyDisplay)}
                                    </span>
                                    <span className="text-[13px] font-medium text-white/35 ml-0.5 self-end mb-1.5">
                                        {billingCycle === "annual" ? "/mes equiv." : "/mes"}
                                    </span>
                                </div>

                                {/* Annual context */}
                                {billingCycle === "annual" && plan.installmentsText && (
                                    <div className="mt-2.5 space-y-0.5">
                                        <p className={cn(
                                            "text-[11.5px] font-bold leading-snug",
                                            isRecommended ? "text-primary" : "text-primary/70"
                                        )}>
                                            {plan.installmentsText}
                                        </p>
                                        <p className="text-[11px] text-white/35">
                                            Total anual: {plan.annualTotal} · ahorrás 25%
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* CTA */}
                            <Button
                                onClick={() => onPurchase(
                                    plan.title,
                                    plan.finalPrice.toString(),
                                    undefined,
                                    plan.id,
                                    billingCycle === "annual"
                                )}
                                className={cn(
                                    "w-full h-11 rounded-xl text-[13.5px] font-bold tracking-wide transition-all duration-200 mb-5",
                                    isRecommended
                                        ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                                        : "bg-transparent border border-white/[0.12] text-white/70 hover:border-white/25 hover:bg-white/[0.04]"
                                )}
                            >
                                {isRecommended ? "Comenzar ahora" : "Elegir este plan"}
                            </Button>

                            {/* Dashed divider + "Incluye" label */}
                            <div className="border-t border-dashed border-white/[0.08] mb-4" />
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.18em] mb-3.5">
                                Incluye:
                            </p>

                            {/* Feature list */}
                            <div className="flex flex-col gap-2.5 flex-1">
                                {plan.displayFeatures.map((feature: string, i: number) => {
                                    if (feature.startsWith("__INCLUDE__")) {
                                        const prevName = feature.replace("__INCLUDE__", "");
                                        return (
                                            <p
                                                key={i}
                                                className="text-[10px] font-bold text-white/25 uppercase tracking-[0.16em] pt-3 mt-1 border-t border-white/[0.05]"
                                            >
                                                Todo lo de {prevName}, más:
                                            </p>
                                        );
                                    }
                                    return (
                                        <div key={i} className="flex items-start gap-2.5">
                                            <CheckIcon recommended={isRecommended} />
                                            <span className="text-[13px] text-white/65 leading-snug">{feature}</span>
                                        </div>
                                    );
                                })}

                                {plan.excludedFeatures && plan.excludedFeatures.length > 0 && (
                                    <>
                                        <div className="border-t border-white/[0.05] mt-1 pt-3" />
                                        {plan.excludedFeatures.map((feature: string, i: number) => (
                                            <div key={`x-${i}`} className="flex items-start gap-2.5">
                                                <XIcon />
                                                <span className="text-[13px] text-white/25 leading-snug line-through">
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>

                            {/* Guarantee footnote */}
                            <p className="text-center text-[11px] text-white/25 font-medium mt-6 pt-4 border-t border-white/[0.05]">
                                7 días de garantía · Cancelá cuando quieras
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
