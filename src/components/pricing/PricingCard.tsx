import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PricingCheckmark } from "./PricingCheckmark";

interface PricingCardProps {
    title: string;
    price: string;
    periodicity: string;
    description: React.ReactNode;
    features: string[];
    isRecommended?: boolean;
    tag?: string;
    buttonText?: string;
    onAction?: () => void;
    className?: string; // Allow custom classes
    specialFeature?: { title: string; description: string };
}

export function PricingCard({
    title,
    price,
    periodicity,
    description,
    features,
    isRecommended = false,
    tag,
    buttonText = "Suscribirse",
    onAction,
    className,
    specialFeature, // Destructure new prop
}: PricingCardProps) {
    // Create a local props object for internal usage consistency if needed, 
    // but better to just use the destructured variable.
    // I will adjust the usage in the previous step's replacement mentally or via correction if needed.
    // Actually, in the previous step I used `props.specialFeature`, which will fail because I didn't have `props` defined.
    // I need to correct that usage here. Or rather, I can't "correct" the previous step, so I must match the variable name `specialFeature` here and ensure the usages use `specialFeature` not `props.specialFeature`.

    // Wait, since I already wrote `props.specialFeature` in the file, this file is currently broken.
    // I need to use `replace_file_content` to fix the usage of `props.specialFeature` to `specialFeature` AND update the interface.
    // But since I can't edit multiple distinct chunks easily in one go if they are far apart, I'll do the interface first, then fix the usage.
    // Actually, the previous tool call might have succeeded in writing the bad code.

    // Strategy: 
    // 1. Update Interface.
    // 2. Fix the usage of `props.specialFeature` -> `specialFeature` in the component body to match the destructuring.

    return (
        <div
            className={cn(
                "relative flex flex-col rounded-2xl border p-6 shadow-xl transition-all duration-300 hover:scale-[1.02]",
                isRecommended
                    ? "border-[#5D5CDE] bg-white/10 shadow-[0_0_30px_rgba(93,92,222,0.15)]"
                    : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10",
                className
            )}
        >
            {(isRecommended || tag) && (
                <div className={cn(
                    "absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-xs font-bold text-white shadow-lg uppercase tracking-wide whitespace-nowrap",
                    isRecommended ? "bg-[#5D5CDE]" : "bg-emerald-500"
                )}>
                    {tag || "Recomendado"}
                </div>
            )}

            <div className="mb-6 text-center">
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                        {price}
                    </span>
                    <span className="text-sm font-medium text-gray-400">
                        ARS / {periodicity}
                    </span>
                </div>
                <div className="mt-4 text-sm text-gray-400 font-medium space-y-2">
                    {description}
                </div>
            </div>

            <ul className="mb-8 flex-1 space-y-4">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <PricingCheckmark />
                        <span className="text-sm text-gray-300 leading-relaxed">{feature}</span>
                    </li>
                ))}
            </ul>

            {/* Special Feature Banner (e.g. for Master Plan) */}
            {specialFeature && (
                <div className="mb-6 rounded-xl bg-gradient-to-br from-[#5D5CDE]/20 to-purple-900/40 border border-[#5D5CDE]/30 p-4">
                    <p className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                        <span className="text-lg">🌟</span>
                        {specialFeature.title}
                    </p>
                    <p className="text-xs text-gray-300 leading-relaxed">
                        {specialFeature.description}
                    </p>
                </div>
            )}

            <Button
                onClick={onAction}
                className={cn(
                    "w-full h-12 rounded-xl text-base font-bold transition-all duration-300",
                    isRecommended
                        ? "bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white shadow-lg shiny-hover"
                        : "bg-white/5 border border-white/10 hover:bg-white hover:text-black text-white shiny-hover"
                )}
                variant={isRecommended ? "default" : "outline"}
            >
                {buttonText}
            </Button>
        </div>
    );
}
