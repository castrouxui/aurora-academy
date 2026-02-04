"use client";

import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, Wallet, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { KPICard } from "./KPICard";
import { LiquidityWidget } from "./LiquidityWidget";
import { RevenueChart } from "./RevenueChart";
import { ExpenseTable } from "./ExpenseTable";
import { toast } from "sonner";
import { format, add, sub, Duration } from "date-fns";
import { es } from "date-fns/locale";
import { getDateRange, PeriodType } from "@/lib/date-utils";

export default function FinancialDashboard() {
    const [period, setPeriod] = useState<PeriodType>("monthly");
    const [currentDate, setCurrentDate] = useState(new Date());

    const [summary, setSummary] = useState({
        revenue: 0,
        expenses: 0,
        netMargin: 0,
        roi: 0,
    });
    const [loading, setLoading] = useState(false);

    // Derive Date Range
    const { startDate, endDate } = getDateRange(period, currentDate);

    const fetchSummary = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            });

            const res = await fetch(`/api/financial/summary?${params.toString()}`);
            if (!res.ok) throw new Error("Failed");
            const data = await res.json();
            setSummary(data);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar datos financieros");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, [startDate.toISOString(), endDate.toISOString()]); // Dependency on the calculated range strings

    const handlePrevious = () => {
        if (period === 'historical') return;
        const map: Record<string, Duration> = {
            weekly: { weeks: 1 },
            monthly: { months: 1 },
            quarterly: { months: 3 },
            semiannual: { months: 6 },
            annual: { years: 1 },
        };
        setCurrentDate(sub(currentDate, map[period] || { months: 1 }));
    };

    const handleNext = () => {
        if (period === 'historical') return;
        const map: Record<string, Duration> = {
            weekly: { weeks: 1 },
            monthly: { months: 1 },
            quarterly: { months: 3 },
            semiannual: { months: 6 },
            annual: { years: 1 },
        };
        setCurrentDate(add(currentDate, map[period] || { months: 1 }));
    };

    const formatRangeLabel = () => {
        if (period === 'historical') return "Histórico Completo";
        // Removed invalid daily check
        if (period === 'weekly') return `Semana del ${format(startDate, "d MMM", { locale: es })}`;
        if (period === 'monthly') return format(currentDate, "MMMM yyyy", { locale: es });
        if (period === 'quarterly') return `Q${Math.floor(currentDate.getMonth() / 3) + 1} ${currentDate.getFullYear()}`;
        if (period === 'semiannual') return `${currentDate.getMonth() < 6 ? "1º" : "2º"} Semestre ${currentDate.getFullYear()}`;
        if (period === 'annual') return format(currentDate, "yyyy");
        return "";
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value);
    };

    const periodOptions: { value: PeriodType; label: string }[] = [
        { value: "weekly", label: "Semanal" },
        { value: "monthly", label: "Mensual" },
        { value: "quarterly", label: "Trimestral" },
        { value: "semiannual", label: "Semestral" },
        { value: "annual", label: "Anual" },
        { value: "historical", label: "Histórico" },
    ];

    return (
        <div className="space-y-6">
            {/* Header & Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-3xl font-bold tracking-tight">Finanzas</h2>

                <div className="flex flex-col sm:flex-row items-center gap-2 bg-muted/30 p-1 rounded-lg">
                    {/* Period Selector */}
                    <select
                        className="h-9 rounded-md border-0 bg-transparent px-3 py-1 text-sm focus:ring-0 cursor-pointer font-medium"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as PeriodType)}
                    >
                        {periodOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    <div className="h-4 w-px bg-border hidden sm:block"></div>

                    {/* Date Navigation */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handlePrevious}
                            disabled={period === 'historical'}
                            className="p-1 hover:bg-background rounded-md disabled:opacity-30 transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        <span className="text-sm font-medium w-32 text-center capitalize truncate">
                            {formatRangeLabel()}
                        </span>

                        <button
                            onClick={handleNext}
                            disabled={period === 'historical'}
                            className="p-1 hover:bg-background rounded-md disabled:opacity-30 transition-colors"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* KPI Cards Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Ingresos"
                    value={formatCurrency(summary.revenue)}
                    icon={DollarSign}
                    className="border-l-4 border-l-green-500"
                />
                <KPICard
                    title="Margen Neto"
                    value={formatCurrency(summary.netMargin)}
                    icon={Wallet}
                    className={`border-l-4 ${summary.netMargin >= 0 ? "border-l-green-500" : "border-l-red-500"}`}
                    valueClassName={summary.netMargin >= 0 ? "text-green-600" : "text-red-600"}
                />
                <KPICard
                    title="ROI"
                    value={`${summary.roi.toFixed(1)}%`}
                    icon={TrendingUp}
                    className={`border-l-4 ${summary.roi >= 20 ? "border-l-green-500" : summary.roi > 0 ? "border-l-yellow-500" : "border-l-red-500"}`}
                />
                <div className="md:col-span-1">
                    <LiquidityWidget />
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
                <div className="lg:col-span-4">
                    <RevenueChart revenue={summary.revenue} expenses={summary.expenses} />
                </div>
                <div className="lg:col-span-3">
                    <div className="grid gap-4">
                        <div className="bg-muted/20 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">Resumen del Periodo</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Inicio:</span>
                                    <span className="font-medium">{format(startDate, "PP", { locale: es })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Fin:</span>
                                    <span className="font-medium">{format(endDate, "PP", { locale: es })}</span>
                                </div>
                                <div className="border-t my-2"></div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Gastos:</span>
                                    <span className="font-medium text-red-600">-{formatCurrency(summary.expenses)}</span>
                                </div>
                                <div className="flex justify-between border-t pt-2">
                                    <span className="font-medium">Resultado:</span>
                                    <span className={`font-bold ${summary.netMargin >= 0 ? "text-green-600" : "text-red-600"}`}>
                                        {formatCurrency(summary.netMargin)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expenses Management */}
            <ExpenseTable
                startDate={startDate}
                endDate={endDate}
                onUpdate={fetchSummary}
            />
        </div>
    );
}
