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
}

export function UpsellModal({
    isOpen,
    onClose,
    onContinue,
    onUpgrade,
    courseTitle,
    coursePrice
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
                        // Sort by price ascending
                        const sorted = bundles.sort((a: any, b: any) => Number(a.price) - Number(b.price));

                        // Strategy: Find the first bundle that is MORE expensive than the course
                        // If course is more expensive than all bundles (unlikely), pick the top one.
                        let target = sorted.find((b: any) => Number(b.price) > numericCoursePrice);

                        // If no bundle is more expensive (e.g. course is 200k, bundles are up to 150k),
                        // suggest the top bundle anyway as it contains "More value".
                        if (!target) {
                            target = sorted[sorted.length - 1];
                        }

                        // Just in case, if the course IS the bundle (unlikely context), ignore

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
    }, [isOpen, numericCoursePrice]);

    // If loading or no bundle found, we render nothing (or could auto-skip)
    // For now, render loading spinner or specific state
    if (isLoading) {
        return null;
    }

    // If no bundle found after load, we should probably just call onContinue automatically?
    // But we can't emit events during render. We'll show a "Proceed" fallback or just nothing.
    // Ideally the parent waits or we show a simple view. 
    // Let's show nothing and effects handle it? No, React warnings.
    // Let's just show a fallback "Confirming..." and then skip.
    if (!recommendedBundle) {
        // Fallback UI if API failed
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="bg-[#0B0F19] border-white/10 text-white p-0 overflow-hidden max-w-md">
                    <div className="p-6 text-center">
                        <p>Preparando tu compra...</p>
                        <Button onClick={onContinue} className="mt-4 w-full bg-[#5D5CDE]">Continuar</Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

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
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <CheckCircle2 size={100} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-white relative z-10 uppercase tracking-wide">
                        {isSaving ? "¡OFERTA IMPERDIBLE!" : "¡ESPERÁ! HAY ALGO MEJOR"}
                    </h2>
                    <p className="text-white/90 font-medium mt-2 relative z-10">
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
                            className="flex-1 text-gray-400 hover:text-white hover:bg-white/10"
                        >
                            No, solo quiero el curso
                        </Button>
                        <Button
                            onClick={() => onUpgrade(recommendedBundle.id, recommendedBundle.title, recommendedBundle.price.toString())}
                            className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 text-base shadow-lg shadow-emerald-900/20 shiny-hover"
                        >
                            ¡Quiero la Membresía!
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
