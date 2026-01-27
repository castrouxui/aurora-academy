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
                "relative flex flex-col rounded-xl border p-8 shadow-xl transition-all duration-300 hover:scale-[1.01] h-full",
                isRecommended
                    ? "border-white ring-1 ring-white bg-[#10141d]" // Active state styling inspired by reference
                    : "border-white/10 bg-[#10141d] hover:border-white/20",
                className
            )}
        >
            {(isRecommended || tag) && (
                <div className="absolute top-4 right-4">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider border border-white/10">
                        {tag || "Recomendado"}
                    </span>
                </div>
            )}

            <div className="mb-8 text-left">
                <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold tracking-tighter text-white">
                        {new Intl.NumberFormat("es-AR", {
                            style: "currency",
                            currency: "ARS",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(Number(price.replace(/[^0-9]/g, "")))}
                    </span>
                    <span className="text-lg font-medium text-gray-400">
                        / {periodicity}
                    </span>
                </div>
                <div className="mt-4 text-sm text-gray-400 font-medium border-t border-white/5 pt-4">
                    {description}
                </div>
            </div>

            <ul className="mb-auto space-y-4 flex-1">
                {features.map((feature, index) => (
                    <li key={`inc-${index}`} className="flex items-start gap-3">
                        <PricingCheckmark />
                        <span className="text-sm text-gray-300 leading-tight w-full">
                            {feature}
                        </span>
                    </li>
                ))}

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

            {/* Special Feature Banner */}
            {specialFeature && (
                <div className="mt-6 rounded-lg bg-[#5D5CDE]/10 border border-[#5D5CDE]/30 p-4">
                    <p className="text-sm font-bold text-[#5D5CDE] mb-1 flex items-center gap-2">
                        <PricingCheckmark />
                        {specialFeature.title}
                    </p>
                    <p className="text-xs text-gray-400 pl-6">
                        {specialFeature.description}
                    </p>
                </div>
            )}

            <div className="mt-8">
                <Button
                    onClick={onAction}
                    className={cn(
                        "w-full h-12 text-base font-bold transition-all duration-300",
                        isRecommended
                            ? "bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white shadow-lg shiny-hover rounded-md"
                            : "bg-transparent border border-white/20 hover:bg-white hover:text-black text-white rounded-md"
                    )}
                >
                    {buttonText}
                </Button>
            </div>
        </div>
    );
}
