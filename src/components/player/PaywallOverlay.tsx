"use client";

import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link"; // Assuming we link back to course page for purchase
// Or we can accept an onPurchase callback if we want to open a modal

interface PaywallOverlayProps {
    courseId?: string;
    onPurchase?: () => void;
}

export function PaywallOverlay({ courseId, onPurchase }: PaywallOverlayProps) {
    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm text-center p-6">
            <div className="bg-[#1F2937] p-4 rounded-full mb-6 shadow-lg shadow-purple-500/20">
                <Lock className="h-8 w-8 text-[#5D5CDE]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Contenido Bloqueado</h3>
            <p className="text-gray-300 max-w-md mb-8">
                Esta lección es parte del contenido premium. Adquiere el curso completo para desbloquear todas las clases y obtener tu certificado.
            </p>
            {onPurchase ? (
                <Button
                    onClick={onPurchase}
                    size="lg"
                    className="bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white font-bold px-8"
                >
                    Desbloquear Curso
                </Button>
            ) : (
                <Link href={`/cursos/${courseId}`}>
                    <Button
                        size="lg"
                        className="bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white font-bold px-8 active:scale-95 transition-all"
                    >
                        Ver Opciones de Compra
                    </Button>
                </Link>
            )}
        </div>
    );
}
