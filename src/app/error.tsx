"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { AlertCircle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
            <Container className="flex flex-col items-center gap-6 text-center max-w-md">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">¡Ups! Algo salió mal</h2>
                <p className="text-gray-400">
                    Ocurrió un error inesperado al cargar esta página. Por favor, intentá nuevamente.
                </p>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => window.location.href = "/"}>
                        Ir al Inicio
                    </Button>
                    <Button
                        className="bg-[#5D5CDE] hover:bg-[#4B4AC0]"
                        onClick={() => reset()}
                    >
                        Reintentar
                    </Button>
                </div>
            </Container>
        </div>
    );
}
