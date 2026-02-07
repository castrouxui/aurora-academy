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
    originalMonthlyPrice?: string;
    persona?: {
        label: string;
        description: string;
    };
    authorityBadge?: boolean | string;
    doubtRemoval?: string;
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
    originalMonthlyPrice,
    persona,
    authorityBadge,
    doubtRemoval,
}: PricingCardProps) {
    const [showAllFeatures, setShowAllFeatures] = useState(false);
    const MOBILE_VISIBLE_FEATURES = 3;

    return (
        <div
            className={cn(
                "relative flex flex-col rounded-[24px] border transition-all duration-300",
                "p-8 md:p-10",
                isRecommended
                    ? "border-[#5D5CDE] bg-[#10141d] ring-1 ring-[#5D5CDE] shadow-2xl shadow-[#5D5CDE]/10"
                    : "border-white/10 bg-[#10141d] hover:border-white/20",
                "h-full",
                className
            )}
        >
            {/* Tag - Mayúscula a minúscula */}
            {(isRecommended || tag) && !persona && (
                <div className="absolute top-0 left-0 right-0 h-4 rounded-t-[24px] bg-[#5D5CDE] flex items-center justify-center">
                    <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">MÁS POPULAR</span>
                </div>
            )}

            {/* Persona Header */}
            {persona && (
                <div className="mb-6">
                    <div className="inline-flex items-center gap-2">
                        <span className={cn(
                            "text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-lg",
                            isRecommended ? "bg-[#5D5CDE] text-white" : "bg-white/10 text-gray-400"
                        )}>
                            {persona.label}
                        </span>
                        {/* Authority Badge */}
                        {authorityBadge && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-400 tracking-wide uppercase">
                                <span className="text-xs">👑</span>
                                {typeof authorityBadge === 'string' ? authorityBadge : "Sugerencia de Fran Castro"}
                            </span>
                        )}
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col">
                <div className="mb-8 text-left">
                    <div className="flex justify-between items-center gap-3 mb-3">
                        <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">{title}</h3>
                        {savings && (
                            <span className="shrink-0 bg-[#10b981] text-white text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-emerald-500/20 uppercase tracking-wide">
                                3 MESES DE REGALO
                            </span>
                        )}
                    </div>
                    <div className="text-sm text-gray-400 font-medium leading-relaxed max-w-[90%] normal-case">
                        {description}
                    </div>
                </div>

                {/* Pricing Block */}
                <div className="mb-8 flex flex-col items-start">
                    {/* Original Price */}
                    <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                        <span className="text-sm font-medium">$</span>
                        <span className="text-lg font-bold line-through tracking-tight">
                            {isAnnual && originalMonthlyPrice
                                ? new Intl.NumberFormat("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(originalMonthlyPrice))
                                : new Intl.NumberFormat("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(price) * 1.3 / (isAnnual ? 12 : 1))
                            }
                        </span>
                    </div>

                    {/* Main Price */}
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl md:text-2xl font-bold text-white">$</span>
                        <span className="text-4xl md:text-5xl font-black tracking-tighter text-white font-display">
                            {new Intl.NumberFormat("es-AR", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(Number(price) / (isAnnual ? 12 : 1))}
                        </span>
                        <span className="text-lg md:text-xl font-bold text-gray-400">/mes</span>
                    </div>

                    {/* Annual Billing Context & Installments Highlight - Minimalist */}
                    {isAnnual && installments && (
                        <div className="mt-2 text-left">
                            <p className="text-[13px] text-emerald-400 font-bold flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 animate-pulse" />
                                3 cuotas sin interés de {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(Number(price) / 3)}
                            </p>
                        </div>
                    )}
                </div>

                {/* Action Section */}
                <div className="space-y-4 mb-10">
                    {/* Promo Banner Style */}
                    <div className="w-full py-1.5 rounded-lg bg-[#5D5CDE]/10 border border-[#5D5CDE]/20 flex items-center justify-center">
                        <span className="text-[11px] font-bold text-[#5D5CDE] tracking-wide">Oferta por tiempo limitado</span>
                    </div>

                    <Button
                        onClick={onAction}
                        className={cn(
                            "w-full h-14 text-base font-black transition-all duration-300 rounded-xl",
                            isRecommended
                                ? "bg-white text-black hover:bg-gray-100"
                                : "bg-transparent border-2 border-white text-white hover:bg-white hover:text-black"
                        )}
                    >
                        {buttonText || "Elegir plan"}
                    </Button>

                    {/* Fine Print - Translated and Fixed */}
                    {isAnnual && (
                        <div className="text-[11px] text-gray-500 font-medium space-y-1">
                            <p>
                                Suscripción de 12 meses. Pagás solo 9 meses. <br className="hidden md:block" />Precio total: <span className="text-gray-300 font-bold">{totalPrice}</span>.
                            </p>
                        </div>
                    )}

                    {/* Doubt Removal */}
                    {doubtRemoval && (
                        <div className="mt-3 pt-3 border-t border-white/5">
                            <p className="text-[11px] text-gray-400 font-medium text-center italic">
                                "{doubtRemoval}"
                            </p>
                        </div>
                    )}
                </div>

                {/* Features Divider */}
                <div className="h-px w-full bg-white/5 mb-10" />

                {/* Features List */}
                <div className="space-y-10">
                    {/* Main Features */}
                    <div className="space-y-4">
                        {/* Features List */}
                        {features.map((feature, index) => {
                            // Check for "Bridge Text" (Todo lo del plan...)
                            if (typeof feature === 'string' && feature.startsWith("Todo lo del Plan")) {
                                return (
                                    <div key={index} className="pt-2 pb-1">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                                            {feature}
                                        </p>
                                    </div>
                                );
                            }

                            return (
                                <div key={index} className="flex items-start gap-4 group">
                                    <div className="mt-1 shrink-0">
                                        <PricingCheckmark />
                                    </div>
                                    <div className="text-sm font-medium text-gray-300 leading-snug text-left">
                                        {feature}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Excluded Features */}
                    {excludedFeatures.length > 0 && (
                        <div className="space-y-4">
                            {excludedFeatures.map((feature, index) => (
                                <div key={index} className="flex items-start gap-4 opacity-30">
                                    <div className="mt-1 shrink-0">
                                        <Lock className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
                                    </div>
                                    <div className="text-sm text-gray-500 font-medium leading-snug line-through">
                                        {feature}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
