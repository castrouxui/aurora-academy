"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface SyncPaymentsButtonProps {
    variant?: "default" | "outline" | "ghost" | "link";
    className?: string;
    onSuccess?: () => void;
}

export function SyncPaymentsButton({ variant = "outline", className, onSuccess }: SyncPaymentsButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSync = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/user/sync-payments", { method: "POST" });
            const data = await res.json();

            if (res.ok) {
                if (data.synced > 0) {
                    toast.success(`Se encontraron y sincronizaron ${data.synced} items correctamente.`);
                    if (onSuccess) onSuccess();
                    else window.location.reload();
                } else {
                    toast.info("No se encontraron pagos nuevos aprobados en tu cuenta.");
                }
            } else {
                toast.error(data.error || "Error al sincronizar pagos.");
            }
        } catch (error) {
            console.error("Sync error:", error);
            toast.error("Error de conexión al intentar sincronizar.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant={variant}
            className={className}
            disabled={isLoading}
            onClick={handleSync}
        >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? "Sincronizando..." : "Verificar mi compra"}
        </Button>
    );
}
