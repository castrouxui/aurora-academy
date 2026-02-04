"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
        const interval = setInterval(fetchBalance, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value);
    };

    return (
        <Card className="bg-[#111827] border-[#1F2937] text-white shadow-lg overflow-hidden">
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
                            <div className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                                {data ? formatCurrency(data.available_amount) : "---"}
                                <div className="text-blue-500 cursor-pointer hover:text-blue-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                                </div>
                            </div>
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
