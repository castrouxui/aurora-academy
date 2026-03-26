"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PLANS, PLAN_COURSE_VALUES_FALLBACK } from "@/constants/pricing";
import { PricingCheckmark } from "./PricingCheckmark";
import { Lock } from "lucide-react";

interface MembershipTableProps {
    bundles: any[];
    billingCycle: "monthly" | "annual";
    onPurchase: (title: string, price: string, courseId?: string, bundleId?: string, isAnnual?: boolean) => void;
}

const PERSONA_DATA = [
    {
        label: "Inicial",
        description: "Ideal para dar tus primeros pasos. El escalón de entrada para dominar los conceptos base.",
        authorityBadge: false,
        doubtRemoval: undefined
    },
    {
        label: "Elite",
        description: "Para traders que buscan consistencia e IA. Operá activamente con actualización constante.",
        authorityBadge: false,
        doubtRemoval: undefined
    },
    {
        label: "Portfolio",
        description: "La experiencia definitiva para profesionales. Networking de alto nivel y visión macro.",
        authorityBadge: true,
        doubtRemoval: "La mejor inversión para tu carrera profesional"
    }
];

export function MembershipTable({ bundles, billingCycle, onPurchase }: MembershipTableProps) {

    // Process and sort items to display
    const displayItems = useMemo(() => {
        const sourceData = bundles.length > 0 ? bundles : PLANS.map(p => ({
            ...p,
            id: undefined,
            // Simulate bundle structure for simpler mapping if needed, or handle differently
            price: p.price.replace(/[^0-9]/g, '') // Normalize static price
        }));

        // Sort by price (assumption: price is numeric or numeric-string)
        const sorted = [...sourceData].sort((a, b) => {
            const priceA = parseFloat(a.price);
            const priceB = parseFloat(b.price);
            return priceA - priceB;
        });

        return sorted.map((item, index, arr) => {
            // Determine Plan Identity
            const staticPlan = PLANS[index]; // Fallback to static meta-data by index
            const isPortfolio = item.title.includes("Portfolio") || index === 2;
            const isElite = item.title.includes("Elite") || index === 1;

            // --- Price Logic ---
            const basePrice = parseFloat(item.price);
            let finalPrice = basePrice;
            let periodicity = "mes";
            let installmentsText = undefined;
            let savingsPct = undefined;
            let totalPriceDisplay = undefined;

            if (billingCycle === "annual") {
                finalPrice = basePrice * 9; // 12 months for price of 9
                periodicity = "año";

                // Installments: 6 cuotas sin interés
                const installmentAmount = finalPrice / 6;
                const formattedInstallment = new Intl.NumberFormat("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    maximumFractionDigits: 0
                }).format(installmentAmount);

                installmentsText = `6 cuotas sin interés de ${formattedInstallment}`;

                // Savings calc
                const annualFull = basePrice * 12;
                savingsPct = Math.round(((annualFull - finalPrice) / annualFull) * 100);

                totalPriceDisplay = new Intl.NumberFormat("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    maximumFractionDigits: 0
                }).format(finalPrice);

            } else {
                totalPriceDisplay = new Intl.NumberFormat("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    maximumFractionDigits: 0
                }).format(finalPrice);
            }

            // --- Features Logic ---
            let displayFeatures: (string | React.ReactNode)[] = [];

            // 1. HEADER: Value Bridge (Todo lo del Plan Anterior) - ALWAYS FIRST
            if (index > 0) {
                const prevBundle = arr[index - 1];
                // Forced header as the very first item
                displayFeatures.push(`Todo lo del Plan ${prevBundle.title} y:`);
            }

            // 2. HIGHLIGHT: Fixed Extras (Marketing) - "1 curso nuevo..."
            if (index >= 1) { // Elite & Portfolio
                displayFeatures.push(
                    <span key={`benefit-15d-${index}`} className="inline-flex items-center gap-2 font-bold text-emerald-950 bg-emerald-400 px-3 py-1 rounded-full text-[11px] shadow-[0_2px_10px_rgba(52,211,153,0.3)]">
                        <span>🔥</span> 1 curso nuevo cada 15 días
                    </span>
                );
            }

            // 3. CONTENT: Courses & Items
            if (bundles.length > 0) {
                const currentCourseTitles = item.courses.map((c: any) => c.title);

                if (index > 0) {
                    const prevBundle = arr[index - 1];
                    const prevCourseTitles = prevBundle.courses.map((c: any) => c.title);

                    // Filter out duplicate courses (show only what's NEW)
                    const newCourses = currentCourseTitles.filter((t: string) => !prevCourseTitles.includes(t));
                    displayFeatures.push(...newCourses);
                } else {
                    displayFeatures.push(...currentCourseTitles);
                }

                // Dynamic Items
                if (item.items && item.items.length > 0) {
                    const dynItems = item.items.map((i: any) => {
                        let name = i.name;
                        if ((name.toLowerCase().includes("canal") || name.toLowerCase().includes("telegram")) && !name.toLowerCase().startsWith("acceso a")) {
                            return `Acceso a ${name}`;
                        }
                        return name;
                    });

                    const existing = displayFeatures.filter(f => typeof f === 'string') as string[];
                    const newDyns = dynItems.filter((di: string) => !existing.includes(di) && !di.toLowerCase().includes("comunidad de inversores"));
                    displayFeatures.push(...newDyns);
                }
            } else {
                // Static Fallback — omitir header y pill que ya fueron agregados arriba
                const staticFeats = (staticPlan?.features || []).filter((f: any) => {
                    if (typeof f === 'string' && f.startsWith("Todo lo del Plan")) return false;
                    if (React.isValidElement(f)) return false; // pill ya agregado
                    return true;
                });
                displayFeatures.push(...staticFeats);
            }

            // Precio sin descuento = mensual × 12
            const fullAnnualPrice = basePrice * 12;
            const formattedAnchor = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(fullAnnualPrice);

            // Valor individual de los cursos — dinámico desde DB en prod, fallback estático en local
            const courseValue = bundles.length > 0
                ? item.courses.reduce((sum: number, c: any) => sum + parseFloat(c.price || '0'), 0)
                : PLAN_COURSE_VALUES_FALLBACK[index] ?? null;
            const formattedCourseValue = courseValue
                ? new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(courseValue)
                : null;

            return {
                ...item,
                finalPrice,
                periodicity,
                installmentsText,
                features: displayFeatures,
                excludedFeatures: staticPlan?.excludedFeatures || [],
                description: PERSONA_DATA[index]?.description || item.description,
                formattedTotal: totalPriceDisplay,
                savingsPct,
                isRecommended: isPortfolio, // Portfolio is Hero
                formattedAnchor,
                formattedCourseValue,
                // Identifying marks
                isPortfolio,
                isElite,
                index
            };
        });
    }, [bundles, billingCycle]);


    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-7xl mx-auto scoll-mt-32">
            {displayItems.map((plan, idx) => {
                const isPortfolio = plan.isPortfolio;
                const isElite = plan.isElite;

                return (
                    <div
                        key={idx}
                        className={cn(
                            "relative flex flex-col h-full rounded-3xl p-8 transition-all duration-300",
                            // Mobile: Portfolio first, Elite second, Inicial third
                            isPortfolio ? "order-first md:order-none" : isElite ? "order-2 md:order-none" : "order-3 md:order-none",
                            isPortfolio
                                ? "bg-[#0D0F1A] border-[1.5px] border-[#5D5CDE]/60 shadow-[0_0_60px_-10px_rgba(93,92,222,0.35)] z-10 pb-10"
                                : "bg-[#0D1120] border border-white/8 hover:border-white/15 hover:shadow-[0_4px_24px_-8px_rgba(93,92,222,0.12)] transition-all pb-10"
                        )}
                    >
                        {/* Gradiente interno — solo Portfolio */}
                        {isPortfolio && (
                            <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(93,92,222,0.08) 0%, transparent 70%)" }} />
                        )}

                        {/* WRAPPER FOR TOP CONTENT TO PUSH CTA DOWN */}
                        <div className="flex-grow flex flex-col">

                            {/* BADGE for Portfolio */}
                            {isPortfolio && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-full flex justify-center z-20">
                                    <div className="backdrop-blur-md bg-white/80 border border-white/30 text-background px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-xl whitespace-nowrap">
                                        El más elegido / Sugerencia de Fran Castro
                                    </div>
                                </div>
                            )}

                            {/* Header */}
                            <div className="mb-6">
                                <h3 className={cn(
                                    "font-bold font-display tracking-tight mb-2 min-h-[32px] flex items-center",
                                    isPortfolio ? "text-2xl text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-300" : "text-xl text-gray-200"
                                )}>
                                    {plan.title}
                                </h3>
                                <p className="text-sm text-gray-400 font-light leading-relaxed min-h-[44px]">
                                    {plan.description}
                                </p>
                            </div>

                            {/* Anchor Pricing — comparación cursos individuales vs membresía */}
                            {plan.formattedCourseValue && (
                                <div className={cn(
                                    "mb-5 rounded-xl p-3 border",
                                    isPortfolio
                                        ? "bg-indigo-500/8 border-indigo-500/20"
                                        : "bg-white/3 border-white/8"
                                )}>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Si compraras los cursos por separado</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-gray-500 line-through">{plan.formattedCourseValue}</span>
                                        <span className="text-gray-600 text-sm">→</span>
                                        <div className="flex flex-col">
                                            <span className={cn(
                                                "text-sm font-black",
                                                isPortfolio ? "text-indigo-300" : "text-white"
                                            )}>
                                                con tu membresía
                                            </span>
                                        </div>
                                    </div>
                                    {billingCycle === "annual" && (
                                        <p className="mt-1.5 text-[10px] text-emerald-400 font-semibold">💰 Ahorrás el equivalente a 3 meses vs. plan mensual</p>
                                    )}
                                </div>
                            )}

                            {/* Price */}
                            <div className="mb-8 min-h-[84px] flex flex-col justify-end">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-lg font-medium text-gray-400">$</span>
                                        <span className="font-display font-bold tracking-tighter text-white text-4xl">
                                            {new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(plan.finalPrice / (billingCycle === 'annual' ? 365 : 1))}
                                        </span>
                                        <span className="text-sm font-medium text-gray-500">{billingCycle === 'annual' ? '/día' : '/mes'}</span>
                                    </div>
                                    {billingCycle === 'annual' && plan.savingsPct && (
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
                                            -{plan.savingsPct}%
                                        </span>
                                    )}
                                </div>

                                {billingCycle === 'annual' && (
                                    <div className="mt-2 space-y-0.5">
                                        <p className={cn(
                                            "text-xs font-bold",
                                            isPortfolio ? "text-emerald-400" : "text-emerald-500/80"
                                        )}>
                                            {plan.installmentsText}
                                        </p>
                                        <p className="text-[11px] text-gray-400 font-medium">
                                            Se factura {plan.formattedTotal} al año
                                        </p>
                                    </div>
                                )}

                                {billingCycle === 'monthly' && (
                                    <div className="mt-2">
                                        <p className="text-[11px] text-gray-400 font-medium h-[32px] flex items-center">
                                            Facturación mensual recurrente
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Features List */}
                            <div className="flex flex-col justify-start">
                                {plan.features.map((feature: any, i: number) => {
                                    // 1. Section Title (Bridge)
                                    if (typeof feature === 'string' && feature.startsWith("Todo lo del Plan")) {
                                        // Specific text replacement for Portfolio
                                        const displayParams = isPortfolio
                                            ? "Todo lo del Plan Elite y:"
                                            : feature;

                                        return (
                                            <div key={i} className="mt-2 mb-3">
                                                <p className={cn(
                                                    "text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed",
                                                    isPortfolio ? "max-w-[90%]" : ""
                                                )}>
                                                    {displayParams}
                                                </p>
                                            </div>
                                        );
                                    }

                                    // 2. React Node (Pill)
                                    if (typeof feature !== 'string' || React.isValidElement(feature)) {
                                        return (
                                            <div key={i} className="mb-3 last:mb-0">
                                                {/* Ensure pill text is always black if it's the specific green pill, though style is likely passed in object. 
                                                    We assume component passed in `feature` has correct styles, but we verified it earlier. */}
                                                {feature}
                                            </div>
                                        );
                                    }

                                    // 3. Standard Feature
                                    return (
                                        <div key={i} className={cn(
                                            "flex items-start gap-3 group last:mb-0",
                                            "mb-3" // Consistent tight spacing for all plans
                                        )}>
                                            <div className="mt-0.5 shrink-0">
                                                <PricingCheckmark />
                                            </div>
                                            <div className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                                                {feature}
                                            </div>
                                        </div>
                                    );
                                })}

                                {plan.excludedFeatures && plan.excludedFeatures.length > 0 && (
                                    <div className="mt-4 space-y-3 opacity-40 hover:opacity-100 transition-opacity duration-300">
                                        {plan.excludedFeatures.map((feature: any, i: number) => (
                                            <div key={`ex-${i}`} className="flex items-start gap-3 text-gray-500">
                                                <div className="mt-0.5 shrink-0">
                                                    <Lock className="w-4 h-4" strokeWidth={1.5} />
                                                </div>
                                                <div className="text-sm font-medium leading-relaxed line-through decoration-white/20">
                                                    {feature}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CTA Button & Guarantee - ALWAYS AT BOTTOM */}
                        <div className="mt-auto pt-8">
                            <Button
                                onClick={() => onPurchase(plan.title, plan.finalPrice.toString(), undefined, plan.id, billingCycle === 'annual')}
                                className={cn(
                                    "w-full h-12 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 active:scale-95",
                                    isPortfolio
                                        ? "bg-white text-background hover:bg-gray-200 shadow-[0_4px_20px_-5px_rgba(255,255,255,0.2)]"
                                        : "bg-[#5D5CDE]/90 border border-[#5D5CDE] text-white hover:bg-[#5D5CDE] shadow-[0_4px_20px_-5px_rgba(93,92,222,0.4)]"
                                )}
                            >
                                {isPortfolio ? "Empezar Ahora" : "Elegir plan"}
                            </Button>

                            <div className="mt-3 flex items-center gap-2 min-h-[32px]">
                                <span className="text-base">🛡️</span>
                                <p className={cn(
                                    "text-sm leading-snug font-semibold",
                                    isPortfolio ? "text-emerald-400" : "text-emerald-500/90"
                                )}>
                                    Garantía de 7 días — devolvemos el 100%
                                </p>
                            </div>
                        </div>

                    </div>
                );
            })}
        </div>
    );
}
