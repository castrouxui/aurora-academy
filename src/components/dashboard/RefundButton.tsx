"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import toast from "react-hot-toast";
import { Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface RefundButtonProps {
    purchaseId: string;
    createdAt: string;
}

export function RefundButton({ purchaseId, createdAt }: RefundButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const purchaseDate = new Date(createdAt);
    const now = new Date();
    const diffHours = (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60);
    const isEligible = diffHours < 24;

    if (!isEligible) return null;

    const handleRefund = async () => {
        if (!confirm("¿Estás seguro/a? Perderás acceso inmediato al curso y el dinero se te reembolsará en 5-10 días hábiles.")) {
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/user/refund", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ purchaseId }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Error al procesar reembolso");
            }

            toast.success("Reembolso procesado exitosamente");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Error: No se pudo procesar el reembolso. Contacta soporte.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleRefund}
            disabled={isLoading}
            className="text-xs text-red-400 hover:text-red-300 underline underline-offset-4 flex items-center gap-1 mt-2"
        >
            {isLoading ? <Loader2 className="animate-spin h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
            Solicitar Reembolso (Disponible por {Math.max(0, 24 - Math.floor(diffHours))}hs más)
        </button>
    );
}
