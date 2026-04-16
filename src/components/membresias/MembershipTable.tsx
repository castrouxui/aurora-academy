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
    buttonOverrides?: Record<string, { label: string; disabled?: boolean }>;
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

export function MembershipTable({ bundles, billingCycle, onPurchase, buttonOverrides }: MembershipTableProps) {

    const displayItems = useMemo(() => {
        const sourceData = bundles.length > 0 ? bundles : PLANS.map(p => ({
            ...p,
            id: undefined,
            price: p.price.replace(/[^0-9]/g, '')
        }));

        const sorted = [...sourceData].sort((a, b) => {
            const priceA = parseFloat(a.price);
            const priceB = parseFloat(b.price);
            return priceA - priceB;
        });

        return sorted.map((item, index, arr) => {
            const staticPlan = PLANS[index];
            const isPortfolio = item.title.includes("Portfolio") || index === 2;
            const isElite = item.title.includes("Elite") || index === 1;

            const basePrice = parseFloat(item.price);
            let finalPrice = basePrice;
            let periodicity = "mes";
            let installmentsText = undefined;
            let savingsPct = undefined;
            let totalPriceDisplay = undefined;

            if (billingCycle === "annual") {
                finalPrice = basePrice * 9;
                periodicity = "año";

                const installmentAmount = finalPrice / 6;
                const formattedInstallment = new Intl.NumberFormat("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    maximumFractionDigits: 0
                }).format(installmentAmount);

                installmentsText = `6 cuotas sin interés de ${formattedInstallment}`;

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

            let displayFeatures: (string | React.ReactNode)[] = [];

            if (index > 0) {
                const prevBundle = arr[index - 1];
                displayFeatures.push(`Todo lo del Plan ${prevBundle.title} y:`);
            }

            if (index >= 1) {
                displayFeatures.push(
                    <span key={`benefit-15d-${index}`} className="inline-flex items-center gap-1.5 font-bold text-emerald-950 bg-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] shadow-[0_2px_8px_rgba(52,211,153,0.3)]">
                        <span>🔥</span> 1 curso nuevo cada 15 días
                    </span>
                );
            }

            if (bundles.length > 0) {
                const currentCourseTitles = item.courses.map((c: any) => c.title);

                if (index > 0) {
                    const prevBundle = arr[index - 1];
                    const prevCourseTitles = prevBundle.courses.map((c: any) => c.title);
                    const newCourses = currentCourseTitles.filter((t: string) => !prevCourseTitles.includes(t));
                    displayFeatures.push(...newCourses);
                } else {
                    displayFeatures.push(...currentCourseTitles);
                }

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
                const staticFeats = (staticPlan?.features || []).filter((f: any) => {
                    if (typeof f === 'string' && f.startsWith("Todo lo del Plan")) return false;
                    if (React.isValidElement(f)) return false;
                    return true;
                });
                displayFeatures.push(...staticFeats);
            }

            const fullAnnualPrice = basePrice * 12;
            const formattedAnchor = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(fullAnnualPrice);

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
                isRecommended: isPortfolio,
                formattedAnchor,
                courseValue,
                formattedCourseValue,
                isPortfolio,
                isElite,
                index
            };
        });
    }, [bundles, billingCycle]);

    const allStringFeatures: string[] = Array.from(
        new Set(
            displayItems.flatMap(plan =>
                plan.features.filter((f: any) => typeof f === 'string' && !f.startsWith("Todo lo del Plan"))
            )
        )
    );

    return (
        <div className="space-y-12">
            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch max-w-5xl mx-auto">
                {displayItems.map((plan, idx) => {
                    const isPortfolio = plan.isPortfolio;
                    const isElite = plan.isElite;

                    return (
                        /* Outer wrapper */
                        <div
                            key={idx}
                            className={cn(
                                "relative flex flex-col h-full pt-5",
                                /* Mobile: Portfolio → Elite → Inicial | Desktop: Inicial → Elite → Portfolio */
                                isPortfolio
                                    ? "order-first md:order-none"
                                    : isElite
                                    ? "order-2 md:order-none"
                                    : "order-3 md:order-none"
                            )}
                        >
                            {/* Tag — overlapping top border of card */}
                            {isPortfolio && (
                                <div className="absolute top-0 left-0 right-0 flex justify-center z-20">
                                    <span className="inline-flex items-center bg-[#5D5CDE] text-white text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase shadow-[0_2px_12px_rgba(93,92,222,0.5)]">
                                        Más elegido · Recomendado
                                    </span>
                                </div>
                            )}

                            {/* Card */}
                            <div className={cn(
                                "relative flex flex-col flex-1 rounded-2xl p-5 transition-all duration-300",
                                isPortfolio
                                    ? "bg-[#0D0F1A] border-[1.5px] border-[#5D5CDE]/60 shadow-[0_0_50px_-12px_rgba(93,92,222,0.4)]"
                                    : "bg-[#0D1120] border border-white/8 hover:border-white/15 hover:shadow-[0_4px_20px_-8px_rgba(93,92,222,0.1)]"
                            )}>

                                {/* Subtle gradient — Portfolio only */}
                                {isPortfolio && (
                                    <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 35% at 50% 0%, rgba(93,92,222,0.09) 0%, transparent 65%)" }} />
                                )}

                                <div className="relative z-10 flex flex-col">
                                    {/* ① Plan name + description */}
                                    <div className="mb-4">
                                        <h3 className={cn(
                                            "font-bold tracking-tight mb-1",
                                            isPortfolio
                                                ? "text-lg text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-300"
                                                : "text-base text-gray-200"
                                        )}>
                                            {plan.title}
                                        </h3>
                                        <p className="text-[12px] text-gray-500 leading-relaxed">
                                            {plan.description}
                                        </p>
                                    </div>

                                    {/* ② Price */}
                                    <div className="mb-4">
                                        <div className="flex items-baseline gap-1 flex-wrap">
                                            <span className="text-sm text-gray-400 font-medium">$</span>
                                            <span className={cn(
                                                "font-bold tracking-tighter text-white",
                                                isPortfolio ? "text-[28px]" : "text-2xl"
                                            )}>
                                                {new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(
                                                    billingCycle === 'annual'
                                                        ? plan.finalPrice / 12   // precio mensual efectivo
                                                        : plan.finalPrice
                                                )}
                                            </span>
                                            <span className="text-xs text-gray-500">/mes</span>
                                            {billingCycle === 'annual' && plan.savingsPct && (
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                                    -{plan.savingsPct}%
                                                </span>
                                            )}
                                        </div>

                                        {billingCycle === 'annual' ? (
                                            <div className="mt-1 space-y-0.5">
                                                <p className="text-[11px] text-emerald-400/80 font-medium">{plan.installmentsText}</p>
                                                <p className="text-[11px] text-gray-500">Se factura {plan.formattedTotal}/año</p>
                                            </div>
                                        ) : (
                                            <p className="mt-1 text-[11px] text-gray-500">Facturación mensual recurrente</p>
                                        )}
                                    </div>

                                    {/* ③ CTA — before features (Claude / SuperGrok style) */}
                                    {(() => {
                                        const override = buttonOverrides?.[plan.id ?? ''];
                                        const label = override?.label ?? (isPortfolio ? "Empezar Ahora" : "Elegir plan");
                                        const disabled = override?.disabled ?? false;
                                        return (
                                            <div className="mb-4">
                                                <Button
                                                    onClick={() => !disabled && onPurchase(plan.title, plan.finalPrice.toString(), undefined, plan.id, billingCycle === 'annual')}
                                                    disabled={disabled}
                                                    className={cn(
                                                        "w-full h-10 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 active:scale-95",
                                                        disabled
                                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default"
                                                            : isPortfolio
                                                            ? "bg-white text-background hover:bg-gray-100 shadow-[0_4px_14px_-5px_rgba(255,255,255,0.25)]"
                                                            : "bg-[#5D5CDE]/90 border border-[#5D5CDE] text-white hover:bg-[#5D5CDE] shadow-[0_4px_14px_-5px_rgba(93,92,222,0.4)]"
                                                    )}
                                                >
                                                    {label}
                                                </Button>
                                                <p className={cn(
                                                    "text-[10px] text-center mt-1.5",
                                                    isPortfolio ? "text-emerald-400/70" : "text-emerald-500/50"
                                                )}>
                                                    🛡️ Garantía 7 días · devolución 100%
                                                </p>
                                            </div>
                                        );
                                    })()}

                                    {/* Divider */}
                                    <div className={cn("h-px mb-4", isPortfolio ? "bg-[#5D5CDE]/20" : "bg-white/5")} />

                                    {/* ④ Feature list — compact */}
                                    <div className="space-y-1.5">
                                        {plan.features.map((feature: any, i: number) => {
                                            // Section Title (bridge)
                                            if (typeof feature === 'string' && feature.startsWith("Todo lo del Plan")) {
                                                return (
                                                    <p key={i} className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest pt-0.5 pb-0.5">
                                                        {isPortfolio ? "Todo lo del Plan Elite y:" : feature}
                                                    </p>
                                                );
                                            }

                                            // React Node (Pill)
                                            if (typeof feature !== 'string' || React.isValidElement(feature)) {
                                                return <div key={i} className="py-0.5">{feature}</div>;
                                            }

                                            // Standard Feature
                                            return (
                                                <div key={i} className="flex items-start gap-2 group">
                                                    <div className="mt-0.5 shrink-0 scale-75 origin-center">
                                                        <PricingCheckmark />
                                                    </div>
                                                    <span className="text-[12px] text-gray-400 group-hover:text-gray-300 transition-colors leading-snug">
                                                        {feature}
                                                    </span>
                                                </div>
                                            );
                                        })}

                                        {plan.excludedFeatures?.length > 0 && (
                                            <div className="pt-1.5 space-y-1.5 opacity-30 hover:opacity-60 transition-opacity duration-300">
                                                {plan.excludedFeatures.map((feature: any, i: number) => (
                                                    <div key={`ex-${i}`} className="flex items-start gap-2 text-gray-500">
                                                        <Lock className="w-3 h-3 mt-0.5 shrink-0" strokeWidth={1.5} />
                                                        <span className="text-[12px] leading-snug line-through decoration-white/20">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Comparison Table */}
            {allStringFeatures.length > 0 && (
                <div className="max-w-5xl mx-auto">
                    <h3 className="text-lg font-semibold text-white text-center mb-6">Comparación de Planes</h3>

                    <div className="overflow-x-auto rounded-xl border border-white/8 -mx-4 md:mx-0">
                        <table className="w-full min-w-[480px]">
                            <thead>
                                <tr className="bg-[#0D1120]">
                                    <th className="sticky left-0 z-20 bg-[#0D1120] text-left px-4 py-3 text-xs font-semibold text-gray-400 w-[130px] md:w-1/2 min-w-[130px]">
                                        Característica
                                    </th>
                                    {displayItems.map((plan, i) => (
                                        <th key={i} className={cn(
                                            "px-3 md:px-5 py-3 text-xs font-bold text-center min-w-[90px]",
                                            plan.isPortfolio ? "text-[#5D5CDE]" : "text-gray-300"
                                        )}>
                                            {plan.title}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {allStringFeatures.map((feature, fi) => {
                                    const rowBg = fi % 2 === 0 ? "bg-[#0D0F1A]" : "bg-[#0D1120]";
                                    return (
                                        <tr key={fi} className={cn("border-t border-white/5", rowBg)}>
                                            <td className={cn(
                                                "sticky left-0 z-10 px-4 py-2.5 text-xs text-gray-300 w-[130px] min-w-[130px] leading-snug",
                                                rowBg
                                            )}>
                                                {feature}
                                            </td>
                                            {displayItems.map((plan, pi) => {
                                                const included = displayItems
                                                    .slice(0, pi + 1)
                                                    .some(p => p.features.some((f: any) => typeof f === 'string' && f === feature));
                                                return (
                                                    <td key={pi} className="px-3 md:px-5 py-2.5 text-center min-w-[90px]">
                                                        {included ? (
                                                            <span className="text-emerald-400 font-bold text-sm">✓</span>
                                                        ) : (
                                                            <span className="text-gray-600 text-sm">×</span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
