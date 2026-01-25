import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PricingCheckmark } from "./PricingCheckmark";

interface PricingCardProps {
    title: string;
    price: string;
    periodicity: string;
    description: React.ReactNode;
    features: (string | React.ReactNode)[];
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
                    "absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold text-white shadow-lg uppercase tracking-wide whitespace-nowrap",
                    isRecommended ? "bg-[#5D5CDE]" : "bg-emerald-500"
                )}>
                    {tag || "Recomendado"}
                </div>
            )}

            <div className="mb-4 text-center">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <div className="mt-3 flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
                        {price}
                    </span>
                    <span className="text-xs font-medium text-gray-400">
                        ARS / {periodicity}
                    </span>
                </div>
                <div className="mt-2 text-xs text-gray-400 font-medium space-y-1">
                    {description}
                </div>
            </div>

            <ul className="mb-6 flex-1 space-y-3">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                        <PricingCheckmark />
                        <span className="text-xs text-gray-300 leading-relaxed w-full">
                            {feature}
                        </span>
                    </li>
                ))}
            </ul>

            {/* Special Feature Banner (e.g. for Master Plan) */}
            {specialFeature && (
                <div className="mb-4 rounded-lg bg-gradient-to-br from-[#5D5CDE]/20 to-purple-900/40 border border-[#5D5CDE]/30 p-3">
                    <p className="text-xs font-bold text-white mb-0.5 flex items-center gap-1.5">
                        <span className="text-base">🌟</span>
                        {specialFeature.title}
                    </p>
                    <p className="text-[10px] text-gray-300 leading-relaxed">
                        {specialFeature.description}
                    </p>
                </div>
            )}

            <Button
                onClick={onAction}
                className={cn(
                    "w-full h-10 rounded-lg text-sm font-bold transition-all duration-300",
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
