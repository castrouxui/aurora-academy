"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, X } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface UpsellModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: () => void;
    onUpgrade: (bundleId: string, bundleTitle: string, bundlePrice: string) => void;
    courseTitle: string;
    coursePrice: string; // "$40.000"
    courseId: string;
}

export function UpsellModal({
    isOpen,
    onClose,
    onContinue,
    onUpgrade,
    courseTitle,
    coursePrice,
    courseId
}: UpsellModalProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [recommendedBundle, setRecommendedBundle] = useState<any>(null);
    const router = useRouter();

    // Parse course price
    const numericCoursePrice = Number(coursePrice.replace(/[^0-9]/g, ''));

    useEffect(() => {
        if (!isOpen) return;

        async function fetchBundles() {
            try {
                const res = await fetch("/api/bundles");
                if (res.ok) {
                    const bundles = await res.json();
                    if (bundles.length > 0) {
                        // 1. Filter: Only consider bundles that INCLUDE this course
                        const validBundles = bundles.filter((b: any) =>
                            b.courses && b.courses.some((c: any) => c.id === courseId)
                        );

                        if (validBundles.length === 0) {
                            // If NO bundle includes this course, we cannot upsell.
                            // In this case, we might want to auto-close or not show.
                            // However, since isOpen is true, we should probably just set null and let the UI decide?
                            // Better yet, if we can't upsell, immediately trigger onContinue?
                            // Or show a specific "Error" state? 
                            // SAFEST: Set null, effectively hiding it, but we need to tell parent?
                            // Ideally, `isOpen` shouldn't be set true if no bundle exists, but we verify async.
                            setRecommendedBundle(null);
                            // Optional: Auto-redirect if we wanted to be aggressive
                            // onContinue(); 
                            return;
                        }

                        // 2. Sort available bundles by price
                        const sorted = validBundles.sort((a: any, b: any) => Number(a.price) - Number(b.price));

                        // 3. Strategy: Find the best value upgrade
                        // Prefer the first one that is > coursePrice (Upsell)
                        let target = sorted.find((b: any) => Number(b.price) > numericCoursePrice);

                        // If all valid bundles are cheaper (unlikely for a bundle vs single course, but possible),
                        // suggest the most expensive one (highest tier) or the cheapest one (best deal)?
                        // Usually, suggest the one closest to price but higher (The "Next Step").
                        if (!target) {
                            // If no bundle is more expensive, pick the most expensive valid one (Top Tier)
                            target = sorted[sorted.length - 1];
                        }

                        setRecommendedBundle(target);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch bundles for upsell", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchBundles();
    }, [isOpen, numericCoursePrice, courseId]);

    // Auto-continue if no upsell is available
    useEffect(() => {
        if (!isLoading && !recommendedBundle && isOpen) {
            onContinue();
        }
    }, [isLoading, recommendedBundle, isOpen, onContinue]);

    // If loading or no bundle found, we render nothing (waiting for auto-continue)
    if (!isLoading && !recommendedBundle) return null;

    // While loading, show nothing or spinner
    if (isLoading) return null;

    const bundlePrice = Number(recommendedBundle.price);
    const diff = bundlePrice - numericCoursePrice;

    // Formatting
    const format = (n: number) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(n);

    const isSaving = diff < 0; // If bundle is CHEAPER than course (e.g. deal)
    const isUpgrade = diff >= 0;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#0B0F19] border-white/10 text-white p-0 overflow-hidden max-w-2xl">
                {/* Header Banner */}
                <div className="p-6 md:p-8 text-center relative overflow-hidden border-b border-white/10 bg-[#5D5CDE]/5">
                    {/* Top gradient line */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#5D5CDE] to-transparent opacity-50"></div>

                    <h2 className="text-xl md:text-2xl font-black text-white relative z-10 uppercase tracking-wide">
                        {isSaving ? "¡OFERTA IMPERDIBLE!" : "RECOMENDACIÓN INTELIGENTE"}
                    </h2>
                    <p className="text-gray-400 font-medium mt-2 relative z-10 text-sm">
                        {isSaving
                            ? `Llevate TODO por menos dinero`
                            : `Por solo ${format(diff)} de diferencia...`
                        }
                    </p>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        {/* Option A: Single Course */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 opacity-60 hover:opacity-100 transition-opacity text-center flex flex-col justify-center h-full">
                            <p className="text-gray-400 text-sm font-bold uppercase mb-2">Solo querés</p>
                            <h3 className="text-lg font-bold text-white line-clamp-2 mb-2">{courseTitle}</h3>
                            <div className="mt-auto">
                                <span className="text-2xl font-bold text-gray-300">{coursePrice}</span>
                                <p className="text-xs text-gray-500 mt-1">Acceso a 1 curso</p>
                            </div>
                        </div>

                        {/* Option B: Bundle */}
                        <div className="bg-emerald-500/10 border-2 border-emerald-500 rounded-xl p-4 relative text-center flex flex-col justify-center h-full transform md:scale-105 shadow-xl shadow-emerald-900/20">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                                Recomendado
                            </div>
                            <p className="text-emerald-400 text-sm font-bold uppercase mb-2 mt-2">Llevate el Plan</p>
                            <h3 className="text-xl font-bold text-white mb-2">{recommendedBundle.title}</h3>
                            <div className="mt-auto">
                                <span className="text-3xl font-black text-white">{format(bundlePrice)}</span>
                                <p className="text-xs text-emerald-400/80 mt-1 font-bold">+ {recommendedBundle.courses?.length || "Muchos"} cursos incluidos</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 text-sm text-gray-300">
                        <p className="font-bold mb-2 flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-emerald-400" />
                            Con el plan {recommendedBundle.title} obtenés:
                        </p>
                        <ul className="space-y-1 pl-6 list-disc marker:text-emerald-400">
                            <li>Acceso a <strong>{courseTitle}</strong> incluido.</li>
                            <li>Más de {recommendedBundle.courses?.length || 5} cursos adicionales.</li>
                            <li>Actualizaciones y nuevos contenidos.</li>
                        </ul>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 pt-2">
                        <Button
                            onClick={onContinue}
                            variant="ghost"
                            className="flex-1 h-14 text-sm font-bold transition-all duration-300 rounded-xl bg-transparent border border-white/20 hover:bg-white hover:text-black text-white"
                        >
                            No, solo quiero el curso
                        </Button>
                        <Button
                            onClick={() => onUpgrade(recommendedBundle.id, recommendedBundle.title, recommendedBundle.price.toString())}
                            className="flex-[2] h-14 text-sm font-bold transition-all duration-300 rounded-xl bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white shadow-lg shiny-hover"
                        >
                            Quiero la Membresía
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
