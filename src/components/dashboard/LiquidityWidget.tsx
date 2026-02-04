"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Wallet } from "lucide-react";

export function LiquidityWidget() {
    const [data, setData] = useState<{ available_amount: number; unavailable_amount: number; total_amount: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBalance = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/financial/mercadopago/balance");
            if (!response.ok) throw new Error("Failed to fetch");
            const result = await response.json();
            setData({
                available_amount: result.available_amount ?? 0,
                unavailable_amount: result.unavailable_total_amount ?? 0,
                total_amount: result.total_amount ?? 0,
            });
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

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value);
    };

    return (
        <Card className="bg-[#111827] border-[#1F2937] text-white shadow-lg overflow-hidden">
            <CardHeader className="pb-2 border-b border-[#1F2937]/50">
                <div className="flex items-center gap-6">
                    <button className="text-sm font-semibold border-b-2 border-white pb-1">Saldo</button>
                    <button className="text-sm font-medium text-gray-500 hover:text-gray-300 pb-1">Reservas</button>
                </div>
            </CardHeader>
            <CardContent className="pt-6 relative">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-white"
                    onClick={fetchBalance}
                    disabled={loading}
                >
                    <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
                </Button>

                {error ? (
                    <div className="text-sm text-red-400 py-4">{error}</div>
                ) : (
                    <div className="space-y-6">
                        {/* Main Balance */}
                        <div>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-xs font-medium text-green-400 uppercase tracking-wider">Rinde ▲ 25,7%</span>
                            </div>
                            <div className="text-4xl font-bold tracking-tight">
                                {data ? formatCurrency(data.available_amount) : "---"}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 bg-transparent border-[#1F2937] text-blue-400 hover:text-blue-300 hover:bg-[#1F2937]"
                                onClick={() => window.open('https://www.mercadopago.com.ar/home', '_blank')}
                            >
                                Ir a Tu dinero
                            </Button>
                            <Button className="flex-1 bg-[#009EE3] hover:bg-[#0081B9] text-white font-medium">
                                Transferir
                            </Button>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-[#1F2937]" />

                        {/* Uneavailable / To Liquidate */}
                        <div className="flex items-center gap-3 text-gray-400">
                            <Wallet className="h-4 w-4" />
                            <span className="text-sm">Dinero a liquidar</span>
                            <span className="text-sm font-medium text-white ml-auto">
                                {data ? formatCurrency(data.unavailable_amount) : "---"}
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
