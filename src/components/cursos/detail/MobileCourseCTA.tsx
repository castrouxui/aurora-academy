"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { LoginModal } from "@/components/auth/LoginModal";
import { PaymentModal } from "@/components/checkout/PaymentModal";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MobileCourseCTAProps {
    title: string;
    price: string;
    courseId: string;
    hasAccess?: boolean;
    className?: string; // Allow external styling
}

export function MobileCourseCTA({
    title,
    price,
    courseId,
    hasAccess = false,
    className
}: MobileCourseCTAProps) {
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
                redirectUrl={`/cursos/${courseId}`}
                view="purchase"
            />
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                courseTitle={title}
                coursePrice={price}
                courseId={courseId}
            />

            <div className={cn("fixed bottom-0 left-0 right-0 p-4 bg-[#0B0F19]/95 backdrop-blur-md border-t border-white/10 z-50 md:hidden safe-area-pb", className)}>
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-0.5">Precio Total</p>
                        <p className="text-2xl font-black text-white">{price}</p>
                    </div>

                    {hasAccess ? (
                        <Link href={`/learn/${courseId}`} className="flex-1">
                            <Button className="w-full font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg h-12 rounded-lg">
                                Ver Curso
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            onClick={handlePurchase}
                            className="flex-[1.5] font-bold bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white shadow-lg h-12 rounded-lg"
                        >
                            Comprar Ahora
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
}
