"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { LoginModal } from "@/components/auth/LoginModal";
import { CourseGateModal } from "@/components/auth/CourseGateModal";
import { PaymentModal } from "@/components/checkout/PaymentModal";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UpsellModal } from "@/components/checkout/UpsellModal";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface MobileCourseCTAProps {
    title: string;
    price: string;
    courseId: string;
    hasAccess?: boolean;
    className?: string; // Allow external styling
    rawPrice?: number;
}

export function MobileCourseCTA({
    title,
    price,
    courseId,
    hasAccess = false,
    className,
    rawPrice
}: MobileCourseCTAProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isUpsellModalOpen, setIsUpsellModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isGateModalOpen, setIsGateModalOpen] = useState(false);
    const [isEnrolling, setIsEnrolling] = useState(false);

    const isFree = rawPrice === 0;

    // State for bundle purchase
    const [selectedBundle, setSelectedBundle] = useState<{ id: string, title: string, price: string } | null>(null);

    const handlePurchase = () => {
        if (!session) {
            setIsLoginModalOpen(true);
            return;
        }
        setIsUpsellModalOpen(true);
    };

    const handleContinueSingle = () => {
        setIsUpsellModalOpen(false);
        setSelectedBundle(null);
        setIsPaymentModalOpen(true);
    };

    const handleUpgradeToBundle = (bundleId: string, bundleTitle: string, bundlePrice: string) => {
        setIsUpsellModalOpen(false);
        setSelectedBundle({ id: bundleId, title: bundleTitle, price: bundlePrice });
        setIsPaymentModalOpen(true);
    };

    const handleFreeEnroll = async () => {
        if (courseId === 'cml05hq7n00025z0eogogsnge' && !session) {
            setIsGateModalOpen(true);
            return;
        }

        if (!session) {
            setIsLoginModalOpen(true);
            return;
        }

        setIsEnrolling(true);
        try {
            const res = await fetch("/api/enroll/free", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId }),
            });

            if (res.ok) {
                toast.success("¡Inscripción exitosa!");
                toast.success("¡Inscripción exitosa!");
                router.refresh();
            } else {
                const data = await res.json();
                toast.error(data.message || "Error al inscribirse");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error de conexión");
        } finally {
            setIsEnrolling(false);
        }
    };

    return (
        <>
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                redirectUrl={`/cursos/${courseId}`}
                view="purchase"
            />

            <CourseGateModal
                isOpen={isGateModalOpen}
                onClose={() => setIsGateModalOpen(false)}
                courseId={courseId}
            />

            <UpsellModal
                isOpen={isUpsellModalOpen}
                onClose={() => setIsUpsellModalOpen(false)}
                onContinue={handleContinueSingle}
                onUpgrade={handleUpgradeToBundle}
                courseTitle={title}
                coursePrice={price}
                courseId={courseId}
            />

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                courseTitle={selectedBundle ? selectedBundle.title : title}
                coursePrice={selectedBundle ? selectedBundle.price : price}
                courseId={selectedBundle ? undefined : courseId}
                bundleId={selectedBundle ? selectedBundle.id : undefined}
            />

            <div className={cn("fixed bottom-0 left-0 right-0 p-4 bg-[#0B0F19]/95 backdrop-blur-md border-t border-white/10 z-50 md:hidden safe-area-pb", className)}>
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-0.5">Precio Total</p>
                        {isFree ? (
                            <div className="flex items-center gap-2">
                                <p className="text-2xl font-black text-white">GRATIS</p>
                                {/* We hide extended details on mobile specific bar to save space, or show small tag */}
                            </div>
                        ) : (
                            <p className="text-2xl font-black text-white">{price}</p>
                        )}
                    </div>

                    {hasAccess ? (
                        <Link href={`/learn/${courseId}`} className="flex-1">
                            <Button className="w-full h-12 text-sm font-bold transition-all duration-300 rounded-xl bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white shadow-lg shiny-hover">
                                Ver Curso
                            </Button>
                        </Link>
                    ) : isFree ? (
                        <Button
                            onClick={handleFreeEnroll}
                            disabled={isEnrolling}
                            className="flex-[1.5] h-12 text-sm font-bold transition-all duration-300 rounded-xl bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white shadow-lg shiny-hover flex items-center justify-center gap-2"
                        >
                            {isEnrolling ? <Loader2 className="animate-spin" /> : "Obtener Oferta"}
                        </Button>
                    ) : (
                        <Button
                            onClick={handlePurchase}
                            className="flex-[1.5] h-12 text-sm font-bold transition-all duration-300 rounded-xl bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white shadow-lg shiny-hover"
                        >
                            Comprar Ahora
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
}
