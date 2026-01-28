"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaymentModal } from "@/components/checkout/PaymentModal";
import { Play, PlayCircle, Clock, BarChart, Users, Globe, Captions, CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";
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
    videoUrl
}: CourseFloatingCardProps) {
    const { data: session } = useSession();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isUpsellModalOpen, setIsUpsellModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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
                    <div className="space-y-2">
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-black text-white">{price}</span>
                            <span className="text-lg text-gray-500 line-through font-medium">{originalPrice}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-sm font-bold">{discount} OFF</span>
                            <span className="text-emerald-400 text-sm font-medium">¡Oferta por tiempo limitado!</span>
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="space-y-3">
                        {hasAccess ? (
                            <Link href={`/learn/${courseId}`} className="block w-full">
                                <Button className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shiny-hover transition-all">
                                    Continuar Aprendiendo
                                </Button>
                            </Link>
                        ) : (
                            <Button
                                onClick={handlePurchase}
                                className="w-full h-14 text-lg font-bold bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white rounded-xl shadow-lg shiny-hover transition-all"
                            >
                                Comprar Ahora
                            </Button>
                        )}
                        <p className="text-center text-xs text-gray-500 font-medium">Garantía de devolución de dinero de 30 días</p>
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
