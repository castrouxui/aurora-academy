import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PricingCheckmark } from "./PricingCheckmark";

interface PricingCardProps {
    title: string;
    price: string;
    periodicity: string;
    students: string;
    features: string[];
    isRecommended?: boolean;
    buttonText?: string;
    onAction?: () => void;
    className?: string; // Allow custom classes
}

// ... props interface remains same

export function PricingCard({
    title,
    price,
    periodicity,
    students,
    features,
    isRecommended = false,
    buttonText = "Suscribirse",
    onAction,
    className,
}: PricingCardProps) {
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
            {isRecommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#5D5CDE] px-4 py-1.5 text-xs font-bold text-white shadow-lg uppercase tracking-wide">
                    Recomendado
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
                <p className="mt-2 text-sm text-gray-400 font-medium">{students}</p>
            </div>

            <ul className="mb-8 flex-1 space-y-4">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <PricingCheckmark />
                        <span className="text-sm text-gray-300 leading-relaxed">{feature}</span>
                    </li>
                ))}
            </ul>

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
