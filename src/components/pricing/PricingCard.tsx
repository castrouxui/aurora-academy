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
                "relative flex flex-col rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md",
                isRecommended
                    ? "border-primary bg-card/50 ring-1 ring-primary"
                    : "border-gray-800 bg-card/30",
                className
            )}
        >
            {isRecommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Recomendado
                </div>
            )}

            <div className="mb-5 text-center">
                <h3 className="text-xl font-bold text-foreground">{title}</h3>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-extrabold tracking-tight text-foreground">
                        {price}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                        ARS / {periodicity}
                    </span>
                </div>
                <p className="mt-2 text-sm text-gray-400">{students}</p>
            </div>

            <ul className="mb-6 flex-1 space-y-4">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <PricingCheckmark />
                        <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                ))}
            </ul>

            <Button
                onClick={onAction}
                className={cn(
                    "w-full",
                    isRecommended ? "bg-primary hover:bg-primary/90" : "bg-card hover:bg-card/80 border-gray-700"
                )}
                variant={isRecommended ? "default" : "outline"}
            >
                {buttonText}
            </Button>
        </div>
    );
}
