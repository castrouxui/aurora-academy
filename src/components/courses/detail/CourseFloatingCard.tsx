"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaymentModal } from "@/components/checkout/PaymentModal";
import { Play, PlayCircle, Clock, BarChart, Users, Globe, Captions, CheckCircle2, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { LoginModal } from "@/components/auth/LoginModal";
import Link from "next/link";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VideoPlayer } from "@/components/player/VideoPlayer";

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
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handlePurchase = () => {
        if (!session) {
            setIsLoginModalOpen(true);
            return;
        }
        setIsPaymentModalOpen(true);
    };

    return (
        <>
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                redirectUrl={`/courses/${courseId}`}
                view="purchase"
            />
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                courseTitle={title}
                coursePrice={price}
                courseId={courseId}
            />

            {/* Preview Modal */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="sm:max-w-4xl p-0 bg-black border-gray-800 overflow-hidden relative">
                    <button
                        onClick={() => setIsPreviewOpen(false)}
                        className="absolute top-4 right-4 z-[60] bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <div className="aspect-video w-full">
                        {videoUrl ? (
                            <VideoPlayer
                                url={videoUrl}
                                thumbnail={videoThumbnail}
                                title={`Vista Previa: ${title}`}
                                isLocked={false}
                                previewMode={true}
                                onPurchase={() => {
                                    setIsPreviewOpen(false);
                                    handlePurchase();
                                }}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-white">
                                Video no disponible
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 sticky top-24">
                {/* Video Preview Header */}
                <div
                    className="relative h-48 bg-black/50 cursor-pointer group"
                    onClick={() => setIsPreviewOpen(true)}
                >
                    {videoThumbnail ? (
                        <div className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-60 transition-opacity" style={{ backgroundImage: `url(${videoThumbnail})` }}></div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                            <PlayCircle size={48} />
                        </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-[#5D5CDE]/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="text-white ml-1" size={32} />
                        </div>
                    </div>
                    <div className="absolute bottom-4 left-0 right-0 text-center font-bold text-white text-sm tracking-wide">
                        Ver preview del curso
                    </div>
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
