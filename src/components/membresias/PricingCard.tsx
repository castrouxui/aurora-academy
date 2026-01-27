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
                "relative flex flex-col rounded-[24px] border p-6 shadow-xl transition-all duration-300 hover:scale-[1.01] h-full",
                isRecommended
                    ? "border-white/20 bg-[#10141d]" // Removed ring, kept subtle border or just bg
                    : "border-white/10 bg-[#10141d] hover:border-white/20",
                className
            )}
        >
            {(isRecommended || tag) && (
                <div className="absolute top-5 right-5">
                    <span className="rounded-full bg-gradient-to-r from-[#5D5CDE] to-[#9233EA] px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg border border-white/10">
                        {tag || "Recomendado"}
                    </span>
                </div>
            )}

            <div className="mb-4 text-left">
                <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
                <div className="flex items-baseline gap-1">
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
                <div className="mt-3 text-sm text-gray-400 font-medium border-t border-white/5 pt-3 leading-snug">
                    {description}
                </div>
            </div>

            <ul className="mb-auto space-y-3 flex-1">
                {features.map((feature, index) => (
                    <li key={`inc-${index}`} className="flex items-start gap-3">
                        <PricingCheckmark />
                        <span className="text-sm font-medium text-gray-100 leading-tight w-full">
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

            {/* Special Feature Banner Removed as per request, logic handled in parent/constants */}
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

            <div className="mt-6">
                <Button
                    onClick={onAction}
                    className={cn(
                        "w-full h-14 text-sm font-bold transition-all duration-300 rounded-xl", // Increased radius to rounded-xl
                        isRecommended
                            ? "bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white shadow-lg shiny-hover"
                            : "bg-transparent border border-white/20 hover:bg-white hover:text-black text-white"
                    )}
                >
                    {buttonText}
                </Button>
            </div>
        </div>
    );
}
