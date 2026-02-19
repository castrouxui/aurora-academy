"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaymentModal } from "@/components/checkout/PaymentModal";
import { Clock, BarChart, Users, Globe, CheckCircle2, Loader2, Shield, CreditCard } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoginModal } from "@/components/auth/LoginModal";
import Link from "next/link";
import { UpsellModal } from "@/components/checkout/UpsellModal";
import { CourseGateModal } from "@/components/auth/CourseGateModal";


interface CourseFloatingCardProps {
    title: string;
    price: string;
    originalPrice: string;
    discount: string;
    duration: string;
    level: string;
    students: number;
    language: string;
    subtitles: string;
    courseId: string;
    hasAccess?: boolean;
    videoThumbnail: string;
    videoUrl?: string;
    rawPrice?: number;
}

export function CourseFloatingCard({
    title,
    price,
    originalPrice,
    discount,
    duration,
    level,
    students,
    language,
    subtitles,
    courseId,
    hasAccess = false,
    videoThumbnail,
    videoUrl,
    rawPrice
}: CourseFloatingCardProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isUpsellModalOpen, setIsUpsellModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isGateModalOpen, setIsGateModalOpen] = useState(false);
    const [isEnrolling, setIsEnrolling] = useState(false);

    const isFree = rawPrice === 0;

    // State for bundle purchase (Upsell accepted)
    const [selectedBundle, setSelectedBundle] = useState<{ id: string, title: string, price: string } | null>(null);

    const handlePurchase = () => {
        if (!session) {
            setIsLoginModalOpen(true);
            return;
        }
        // Open Upsell instead of direct Payment
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
        // Special Logic for "Trojan Horse" Course
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
                courseTitle={title}
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

            <div className="bg-[#111827] rounded-2xl overflow-hidden shadow-[0_8px_60px_rgba(0,0,0,0.6)] border border-white/[0.1]">
                <div className="p-7 space-y-6">
                    {/* Price Section */}
                    <div className="space-y-3">
                        {isFree ? (
                            <>
                                <div className="flex items-baseline gap-3">
                                    {originalPrice && (
                                        <span className="text-xl text-gray-500 line-through font-medium">{originalPrice}</span>
                                    )}
                                    <span className="text-4xl font-black text-white">$0</span>
                                    <span className="text-lg text-gray-400 font-medium">hoy</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="bg-[#5D5CDE]/15 text-[#5D5CDE] border border-[#5D5CDE]/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                                        OFERTA DE LANZAMIENTO
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-black text-white">{price}</span>
                                    {originalPrice && (
                                        <span className="text-lg text-gray-500 line-through font-medium">{originalPrice}</span>
                                    )}
                                </div>
                                {discount && (
                                    <div className="flex items-center gap-2">
                                        <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                                            {discount} OFF
                                        </span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* CTA */}
                    <div className="space-y-4">
                        {hasAccess ? (
                            <Link href={`/learn/${courseId}`} className="block w-full">
                                <Button className="w-full h-14 text-sm font-bold transition-all duration-300 rounded-xl bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white shadow-lg shiny-hover">
                                    Continuar Aprendiendo
                                </Button>
                            </Link>
                        ) : isFree ? (
                            <Button
                                onClick={handleFreeEnroll}
                                disabled={isEnrolling}
                                className="w-full h-14 text-sm font-bold transition-all duration-300 rounded-xl bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white shadow-lg shiny-hover flex items-center justify-center gap-2"
                            >
                                {isEnrolling ? <Loader2 className="animate-spin" /> : "Comenzar ahora"}
                            </Button>
                        ) : (
                            <Button
                                onClick={handlePurchase}
                                className="w-full h-14 text-sm font-bold transition-all duration-300 rounded-xl bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white shadow-lg shiny-hover"
                            >
                                Acceder al curso
                            </Button>
                        )}

                        {/* Trust strip */}
                        <div className="space-y-3 pt-1">
                            <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                                <Shield size={14} className="text-emerald-500/70" />
                                <span className="font-medium">Garantía de 7 días</span>
                            </div>
                            <div className="flex items-center justify-center gap-4 text-gray-600">
                                <CreditCard size={16} />
                                <span className="text-xs">Visa • Mastercard • MercadoPago</span>
                            </div>
                            {students > 0 && (
                                <p className="text-center text-xs text-gray-500">
                                    <span className="font-semibold text-gray-400">{students.toLocaleString()}</span> estudiantes activos
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Course includes */}
                    <div className="space-y-4 pt-5 border-t border-white/[0.06]">
                        <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider">Este curso incluye</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-center gap-3">
                                <Clock size={16} className="shrink-0 text-[#5D5CDE]/70" />
                                <span>{duration} de video bajo demanda</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <BarChart size={16} className="shrink-0 text-[#5D5CDE]/70" />
                                <span>Nivel: {level}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle2 size={16} className="shrink-0 text-[#5D5CDE]/70" />
                                <span>Certificado de finalización</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Globe size={16} className="shrink-0 text-[#5D5CDE]/70" />
                                <span>Acceso completo 24/7</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
