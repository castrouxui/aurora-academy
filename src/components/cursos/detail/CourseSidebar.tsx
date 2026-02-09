"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaymentModal } from "@/components/checkout/PaymentModal";
import { PlayCircle, Download, Infinity, Trophy, Smartphone, Clock, BarChart, Users, Globe, Captions, Heart, Gift } from "lucide-react";

interface CourseSidebarProps {
    title: string;
    price: string;
    originalPrice: string;
    discount: string;
    duration: string;
    level: string;
    students: number;
    language: string;
    subtitles: string;
    className?: string;
    courseId: string;
    hasAccess?: boolean;
}

import { useSession } from "next-auth/react";
import { LoginModal } from "@/components/auth/LoginModal";
import Link from "next/link";

export function CourseSidebar({
    title,
    price,
    originalPrice,
    discount,
    duration,
    level,
    students,
    language,
    subtitles,
    className,
    courseId,
    hasAccess = false
}: CourseSidebarProps) {
    const { data: session } = useSession();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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
            <div className={`bg-[#1F2937] border border-gray-700 rounded-xl overflow-hidden shadow-2xl ${className || ''}`}>


                <div className="p-6 space-y-6">
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-white">{price}</span>
                        <span className="text-lg text-gray-400 line-through">{originalPrice}</span>
                        <span className="text-sm font-medium text-primary">{discount} OFF</span>
                    </div>

                    <div className="flex items-center gap-2 text-primary text-sm font-medium">
                        <span className="animate-pulse">⏰</span>
                        <span>¡Quedan 5 horas a este precio!</span>
                    </div>

                    <div className="space-y-3 border-t border-gray-700 pt-4 pb-4">
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2 text-gray-300">
                                <Clock size={16} />
                                <span>Duración</span>
                            </div>
                            <span className="text-white font-medium">{duration}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2 text-gray-300">
                                <BarChart size={16} />
                                <span>Nivel</span>
                            </div>
                            <span className="text-white font-medium">{level}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2 text-gray-300">
                                <Users size={16} />
                                <span>Estudiantes</span>
                            </div>
                            <span className="text-white font-medium">{students.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2 text-gray-300">
                                <Globe size={16} />
                                <span>Idioma</span>
                            </div>
                            <span className="text-white font-medium">{language}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2 text-gray-300">
                                <Captions size={16} />
                                <span>Subtítulos</span>
                            </div>
                            <span className="text-white font-medium">{subtitles}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="space-y-3">
                            {hasAccess ? (
                                <Link href={`/learn/${courseId}`} className="block w-full">
                                    <Button className="w-full h-12 text-lg font-bold bg-green-600 hover:bg-green-700 text-white">
                                        Ir al curso
                                    </Button>
                                </Link>
                            ) : (
                                <Button onClick={handlePurchase} className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 text-white">
                                    Comprar ahora
                                </Button>
                            )}
                        </div>
                    </div>

                    <p className="text-center text-xs text-gray-400">Garantía de satisfacción de 7 días.</p>

                    <div className="space-y-4 pt-4 border-t border-gray-700">
                        <h4 className="font-bold text-white text-sm">Este curso incluye:</h4>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li className="flex items-center gap-3">
                                <Clock size={18} className="shrink-0 text-primary" />
                                <span>Acceso completo 24/7</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Trophy size={18} className="shrink-0 text-primary" />
                                <span>Certificado de finalización</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Download size={18} className="shrink-0 text-primary" />
                                <span>30 recursos descargables</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Smartphone size={18} className="shrink-0 text-primary" />
                                <span>Acceso en dispositivos móviles y TV</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
