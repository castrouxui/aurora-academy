import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PricingCheckmark } from "./PricingCheckmark";
import { Lock } from "lucide-react";

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
    className?: string; // Allow custom classes
    specialFeature?: { title: string; description: string };
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
    specialFeature, // Destructure new prop
}: PricingCardProps) {

    return (
        <div
            className={cn(
                "relative flex flex-col rounded-2xl border p-8 shadow-xl transition-all duration-300 hover:scale-[1.02]",
                isRecommended
                    ? "border-[#5D5CDE] bg-white/10 shadow-[0_0_30px_rgba(93,92,222,0.15)]"
                    : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10",
                className
            )}
        >
            {(isRecommended || tag) && (
                <div className={cn(
                    "absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-sm font-bold text-white shadow-lg uppercase tracking-wide whitespace-nowrap",
                    isRecommended ? "bg-[#5D5CDE]" : "bg-emerald-500"
                )}>
                    {tag || "Recomendado"}
                </div>
            )}

            <div className="mb-4 text-center">
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <div className="mt-3 flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                        {price}
                    </span>
                    <span className="text-sm font-medium text-gray-400">
                        ARS / {periodicity}
                    </span>
                </div>
                <div className="mt-3 text-sm text-gray-300 font-medium space-y-1">
                    {description}
                </div>
            </div>

            <ul className="mb-0 space-y-4">
                {features.map((feature, index) => (
                    <li key={`inc-${index}`} className="flex items-start gap-3">
                        <PricingCheckmark />
                        <span className="text-sm text-gray-200 leading-tight w-full">
                            {feature}
                        </span>
                    </li>
                ))}

                {excludedFeatures.map((feature, index) => (
                    <li key={`exc-${index}`} className="flex items-start gap-3 opacity-50">
                        <div className="mt-0.5 min-w-[20px] flex justify-center">
                            <Lock className="h-4 w-4 text-gray-500" />
                        </div>
                        <span className="text-sm text-gray-400 leading-tight w-full">
                            {feature}
                        </span>
                    </li>
                ))}
            </ul>

            {/* Special Feature Banner (e.g. for Master Plan) */}
            {specialFeature && (
                <div className="mt-4 rounded-lg bg-gradient-to-br from-[#5D5CDE]/40 to-purple-900/60 border border-[#5D5CDE]/60 p-4 shadow-lg shadow-[#5D5CDE]/10">
                    <p className="text-sm font-bold text-white mb-1 flex items-start gap-3">
                        <PricingCheckmark />
                        <span className="leading-tight">{specialFeature.title}</span>
                    </p>
                    <p className="text-sm text-gray-200 leading-relaxed pl-8">
                        {specialFeature.description}
                    </p>
                </div>
            )}



            <Button
                onClick={onAction}
                className={cn(
                    "w-full h-12 rounded-xl text-sm font-bold transition-all duration-300",
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
