"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Wallet } from "lucide-react";

export function LiquidityWidget() {
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBalance = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/financial/mercadopago/balance");
            if (!response.ok) throw new Error("Failed to fetch");
            const data = await response.json();
            // The API returns { total_amount, available_amount, ... }
            // We'll show available_amount as "Liquidity"
            setBalance(data.available_amount ?? 0);
        } catch (err) {
            console.error(err);
            setError("Error al cargar saldo");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, []);

    return (
        <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-blue-100 flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Mercado Pago Disponibilidad
                </CardTitle>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-100 hover:text-white hover:bg-blue-700/50"
                    onClick={fetchBalance}
                    disabled={loading}
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
            </CardHeader>
            <CardContent>
                {error ? (
                    <div className="text-sm text-red-200">{error}</div>
                ) : (
                    <div className="text-3xl font-bold">
                        {balance !== null
                            ? new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(balance)
                            : "Cargando..."}
                    </div>
                )}
                <p className="text-xs text-blue-200 mt-2">
                    Liquidez inmediata para publicidad
                </p>
            </CardContent>
        </Card>
    );
}
