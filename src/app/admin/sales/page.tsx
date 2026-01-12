"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

interface Sale {
    id: string;
    amount: string;
    status: string;
    createdAt: string;
    user: { name: string; email: string };
    course: { title: string };
    paymentId: string;
}

export default function AdminSalesPage() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState("all");

    useEffect(() => {
        async function fetchSales() {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/admin/sales?period=${period}`);
                if (res.ok) {
                    const data = await res.json();
                    setSales(data);
                }
            } catch (error) {
                console.error("Failed to fetch sales", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchSales();
    }, [period]);

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(Number(amount));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge variant="success" className="gap-1"><CheckCircle size={10} /> Aprobado</Badge>;
            case 'rejected':
                return <Badge variant="destructive" className="gap-1"><XCircle size={10} /> Rechazado</Badge>;
            default:
                return <Badge variant="warning" className="gap-1"><Clock size={10} /> Pendiente</Badge>;
        }
    };

    const totalAmount = sales.reduce((acc, sale) => {
        return acc + Number(sale.amount);
    }, 0);

    const periodLabel = {
        'today': 'Hoy',
        'week': 'Esta Semana',
        'month': 'Este Mes',
        'all': 'Histórico'
    }[period] || 'Periodo';

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-white">Ventas</h1>

                <div className="flex items-center gap-2 bg-[#1F2937] p-1 rounded-lg border border-gray-700">
                    <button
                        onClick={() => setPeriod('today')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${period === 'today' ? 'bg-[#5D5CDE] text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Hoy
                    </button>
                    <button
                        onClick={() => setPeriod('week')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${period === 'week' ? 'bg-[#5D5CDE] text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Semana
                    </button>
                    <button
                        onClick={() => setPeriod('month')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${period === 'month' ? 'bg-[#5D5CDE] text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Mes
                    </button>
                    <button
                        onClick={() => setPeriod('all')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${period === 'all' ? 'bg-[#5D5CDE] text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Histórico
                    </button>
                </div>
            </div>

            {/* Total Sales Card */}
            <Card className="bg-gradient-to-r from-[#1F2937] to-[#111827] border-gray-700">
                <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-center">
                    <div>
                        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Ventas ({periodLabel})</p>
                        <h2 className="text-4xl font-bold text-white mt-1">{formatCurrency(totalAmount.toString())}</h2>
                    </div>
                    <div className="mt-4 sm:mt-0 bg-emerald-500/10 p-3 rounded-full">
                        <DollarSign className="text-emerald-400 h-8 w-8" />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-[#1F2937] border-gray-700">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Registro de Transacciones ({sales.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="animate-spin text-primary h-8 w-8" />
                        </div>
                    ) : sales.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No se encontraron transacciones.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-400 bg-[#111827] uppercase">
                                    <tr>
                                        <th className="px-4 py-3 rounded-tl-lg">Curso</th>
                                        <th className="px-4 py-3">Usuario</th>
                                        <th className="px-4 py-3">Monto</th>
                                        <th className="px-4 py-3">Estado</th>
                                        <th className="px-4 py-3">Fecha</th>
                                        <th className="px-4 py-3 rounded-tr-lg">ID Pago</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sales.map((sale) => (
                                        <tr key={sale.id} className="border-b border-gray-800 hover:bg-[#111827]/50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-white">{sale.course.title}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-300">{sale.user.name || "Sin nombre"}</span>
                                                    <span className="text-gray-500 text-xs">{sale.user.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-bold text-emerald-400">{formatCurrency(sale.amount)}</td>
                                            <td className="px-4 py-3">{getStatusBadge(sale.status)}</td>
                                            <td className="px-4 py-3 text-gray-400">{formatDate(sale.createdAt)}</td>
                                            <td className="px-4 py-3 text-gray-500 font-mono text-xs">{sale.paymentId}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
