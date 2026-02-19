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
    originalPrice?: string;
    courseId: string;
    hasAccess?: boolean;
    className?: string;
    rawPrice?: number;
}

export function MobileCourseCTA({
    title,
    price,
    originalPrice,
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

            <div className={cn("fixed bottom-0 left-0 right-0 p-4 bg-[#0B0F19]/95 backdrop-blur-xl border-t border-white/[0.06] z-50 lg:hidden safe-area-pb", className)}>
                <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                        {isFree ? (
                            <div className="flex items-baseline gap-2">
                                {originalPrice && (
                                    <span className="text-sm text-gray-500 line-through">{originalPrice}</span>
                                )}
                                <span className="text-xl font-black text-white">GRATIS</span>
                            </div>
                        ) : (
                            <p className="text-xl font-black text-white truncate">{price}</p>
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
                            {isEnrolling ? <Loader2 className="animate-spin" /> : "Comenzar ahora"}
                        </Button>
                    ) : (
                        <Button
                            onClick={handlePurchase}
                            className="flex-[1.5] h-12 text-sm font-bold transition-all duration-300 rounded-xl bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white shadow-lg shiny-hover"
                        >
                            Acceder al curso
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
}
