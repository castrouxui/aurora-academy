"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaymentModal } from "@/components/checkout/PaymentModal";
import { Play, PlayCircle, Clock, BarChart, Users, Globe, Captions, CheckCircle2, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoginModal } from "@/components/auth/LoginModal";
import Link from "next/link";
import { UpsellModal } from "@/components/checkout/UpsellModal";


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
        setSelectedBundle(null); // Ensure no bundle is selected
        setIsPaymentModalOpen(true);
    };

    const handleUpgradeToBundle = (bundleId: string, bundleTitle: string, bundlePrice: string) => {
        setIsUpsellModalOpen(false);
        setSelectedBundle({ id: bundleId, title: bundleTitle, price: bundlePrice });
        setIsPaymentModalOpen(true);
    };

    const handleFreeEnroll = async () => {
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
                router.push(`/learn/${courseId}`);
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
                // Dynamic Props: If bundle selected, use bundle info, else course info
                courseTitle={selectedBundle ? selectedBundle.title : title}
                coursePrice={selectedBundle ? selectedBundle.price : price}
                courseId={selectedBundle ? undefined : courseId}
                bundleId={selectedBundle ? selectedBundle.id : undefined}
            />

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 sticky top-24">
                {/* Course Cover Image */}
                <div className="relative aspect-video bg-black/50 border-b border-white/5">
                    {videoThumbnail ? (
                        <img
                            src={videoThumbnail}
                            alt={`Portada de ${title}`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                            <PlayCircle size={48} />
                        </div>
                    )}
                </div>

                <div className="p-6 md:p-8 space-y-6">
                    {/* Price Section */}
                    {/* Price Section */}
                    <div className="space-y-2">
                        {isFree ? (
                            <>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-black text-white">GRATIS</span>
                                    {originalPrice && (
                                        <span className="text-lg text-gray-500 line-through font-medium">{originalPrice}</span>
                                    )}
                                </div>
                                {discount && (
                                    <div className="flex items-center gap-2">
                                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-sm font-bold">{discount} OFF</span>
                                        <span className="text-emerald-400 text-sm font-medium">¡Oferta por tiempo limitado!</span>
                                    </div>
                                )}
                                {!discount && (
                                    <span className="text-sm text-gray-500 font-medium">Por tiempo limitado</span>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-black text-white">{price}</span>
                                    <span className="text-lg text-gray-500 line-through font-medium">{originalPrice}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-sm font-bold">{discount} OFF</span>
                                    <span className="text-emerald-400 text-sm font-medium">¡Oferta por tiempo limitado!</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* CTAs */}
                    <div className="space-y-3">
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
                                {isEnrolling ? <Loader2 className="animate-spin" /> : "Inscribirse Gratis"}
                            </Button>
                        ) : (
                            <Button
                                onClick={handlePurchase}
                                className="w-full h-14 text-sm font-bold transition-all duration-300 rounded-xl bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white shadow-lg shiny-hover"
                            >
                                Comprar Ahora
                            </Button>
                        )}
                        <p className="text-center text-xs text-gray-500 font-medium">Garantía de devolución de dinero de 24 hs.</p>
                    </div>

                    {/* Course Include List */}
                    <div className="space-y-4 pt-6 border-t border-white/10">
                        <h4 className="font-bold text-white">Este curso incluye:</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-center gap-3">
                                <Clock size={18} className="shrink-0 text-[#5D5CDE]" />
                                <span>{duration} de video bajo demanda</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <BarChart size={18} className="shrink-0 text-[#5D5CDE]" />
                                <span>Nivel: {level}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Users size={18} className="shrink-0 text-[#5D5CDE]" />
                                <span>{students.toLocaleString()} estudiantes</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle2 size={18} className="shrink-0 text-[#5D5CDE]" />
                                <span>Certificado de finalización</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Globe size={18} className="shrink-0 text-[#5D5CDE]" />
                                <span>Acceso de por vida</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
