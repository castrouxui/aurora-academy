"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign, Calendar, CheckCircle, XCircle, Clock, TrendingUp, CreditCard, ShoppingCart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface Sale {
    id: string;
    amount: string;
    status: string;
    createdAt: string;
    user: { name: string; email: string };
    course?: { title: string };
    bundle?: { title: string };
    paymentId: string;
}

export default function AdminSalesPage() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState("all");
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [timeAgo, setTimeAgo] = useState("Actualizando...");

    const fetchSales = async () => {
        if (!lastUpdated) setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/sales?period=${period}`);
            if (res.ok) {
                const data: Sale[] = await res.json();

                // --- SOFT DEDUPLICATION LOGIC ---
                const uniqueSales: Sale[] = [];
                const seen = new Set<string>();

                data.forEach(sale => {
                    const itemId = sale.course?.title || sale.bundle?.title || "unknown";
                    const key = `${sale.user.email}-${itemId}-${sale.amount}`;
                    const timeBucket = new Date(sale.createdAt).getTime();

                    const isDuplicate = uniqueSales.some(existing => {
                        const existingKey = `${existing.user.email}-${existing.course?.title || existing.bundle?.title || "unknown"}-${existing.amount}`;
                        if (existingKey !== key) return false;
                        const timeDiff = Math.abs(new Date(existing.createdAt).getTime() - new Date(sale.createdAt).getTime());
                        return timeDiff < 60000;
                    });

                    if (!isDuplicate) {
                        uniqueSales.push(sale);
                    }
                });

                setSales(uniqueSales);
                setLastUpdated(new Date());
            }
        } catch (error) {
            console.error("Failed to fetch sales", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
        const interval = setInterval(fetchSales, 60000);
        return () => clearInterval(interval);
    }, [period]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (lastUpdated) {
                const diff = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
                if (diff < 60) setTimeAgo(`Actualizado hace ${diff} seg`);
                else if (diff < 3600) setTimeAgo(`Actualizado hace ${Math.floor(diff / 60)} min`);
                else setTimeAgo(`Actualizado hace ${Math.floor(diff / 3600)} h`);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [lastUpdated]);

    // --- AGGREGATION LOGIC ---
    const chartData = useMemo(() => {
        if (!sales.length) return [];

        const groupedData: Record<string, { date: string; amount: number; count: number }> = {};

        sales.forEach(sale => {
            if (sale.status !== 'approved') return; // Only count approved revenue

            const date = new Date(sale.createdAt);
            let key = '';
            let label = '';

            if (period === 'today') {
                key = `${date.getHours()}:00`;
                label = `${date.getHours()}:00`;
            } else if (period === 'month' || period === 'week') {
                key = date.toLocaleDateString("es-AR", { day: '2-digit', month: '2-digit' });
                label = key;
            } else {
                // All time: Group by Month if too many, or Week? Let's do Month for All.
                key = date.toLocaleDateString("es-AR", { month: 'short', year: '2-digit' });
                label = key;
            }

            if (!groupedData[key]) {
                groupedData[key] = { date: label, amount: 0, count: 0 };
            }
            groupedData[key].amount += Number(sale.amount);
            groupedData[key].count += 1;
        });

        // Convert to array and sort
        const result = Object.values(groupedData);
        // We need to sort by date. But keys are strings. 
        // Quick fix: user sales array order (it is DESC). we reverse it for chart (ASC).
        // A robust way is to re-sort:
        // Actually, since we iterate linearly over sorted sales, we might construct it in reverse or sort later.
        // Let's rely on sales being DESC, so we process latest first. 
        // We should reverse the final array so graph goes Left->Right (Old->New).
        return result.reverse();
    }, [sales, period]);

    const totalRevenue = sales.filter(s => s.status === 'approved').reduce((acc, s) => acc + Number(s.amount), 0);
    const totalTransactions = sales.filter(s => s.status === 'approved').length;
    const avgTicket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;


    const formatCurrency = (amount: string | number) => {
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
            case 'approved': return <Badge variant="success" className="gap-1"><CheckCircle size={10} /> Aprobado</Badge>;
            case 'rejected': return <Badge variant="destructive" className="gap-1"><XCircle size={10} /> Rechazado</Badge>;
            case 'refunded':
            case 'refund': return <Badge variant="outline" className="gap-1 border-orange-500 text-orange-500 bg-orange-500/10"><Clock size={10} /> Reembolsado</Badge>;
            default: return <Badge variant="warning" className="gap-1"><Clock size={10} /> Pendiente</Badge>;
        }
    };

    const periodLabel = { 'today': 'Hoy', 'week': 'Esta Semana', 'month': 'Este Mes', 'all': 'Histórico' }[period] || 'Periodo';

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard de Ventas</h1>
                    {lastUpdated && <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Clock size={10} /> {timeAgo}</p>}
                </div>
                <div className="flex items-center gap-2 bg-[#1F2937] p-1 rounded-lg border border-gray-700">
                    {['today', 'week', 'month', 'all'].map(p => (
                        <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${period === p ? 'bg-[#5D5CDE] text-white' : 'text-gray-400 hover:text-white'}`}>
                            {{ 'today': 'Hoy', 'week': 'Semana', 'month': 'Mes', 'all': 'Histórico' }[p]}
                        </button>
                    ))}
                </div>
            </div>

            {/* METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-r from-[#1F2937] to-[#111827] border-gray-700">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Ingresos Totales</p>
                                <h2 className="text-3xl font-bold text-white mt-2">{formatCurrency(totalRevenue)}</h2>
                            </div>
                            <div className="bg-emerald-500/10 p-3 rounded-full"><DollarSign className="text-emerald-400 h-6 w-6" /></div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-[#1F2937] border-gray-700">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Transacciones</p>
                                <h2 className="text-3xl font-bold text-white mt-2">{totalTransactions}</h2>
                            </div>
                            <div className="bg-blue-500/10 p-3 rounded-full"><ShoppingCart className="text-blue-400 h-6 w-6" /></div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-[#1F2937] border-gray-700">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Ticket Promedio</p>
                                <h2 className="text-3xl font-bold text-white mt-2">{formatCurrency(avgTicket)}</h2>
                            </div>
                            <div className="bg-purple-500/10 p-3 rounded-full"><TrendingUp className="text-purple-400 h-6 w-6" /></div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* CHART */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 bg-[#1F2937] border-gray-700">
                    <CardHeader><CardTitle className="text-white text-lg">Tendencia de Ingresos</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#5D5CDE" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#5D5CDE" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: 'white' }}
                                    formatter={(value: any) => [formatCurrency(value), 'Ingresos']}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#5D5CDE" fillOpacity={1} fill="url(#colorAmount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* DISTRIBUTION / STATUS OR TOP ITEMS? For now simple list or pie? Keep it simple. */}
                <Card className="bg-[#1F2937] border-gray-700">
                    <CardHeader><CardTitle className="text-white text-lg">Resumen de Actividad</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 rounded-lg bg-[#374151]/30">
                                <span className="text-gray-300 text-sm">Aprobadas</span>
                                <Badge variant="success">{sales.filter(s => s.status === 'approved').length}</Badge>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-[#374151]/30">
                                <span className="text-gray-300 text-sm">Rechazadas</span>
                                <Badge variant="destructive">{sales.filter(s => s.status === 'rejected').length}</Badge>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-[#374151]/30">
                                <span className="text-gray-300 text-sm">Pendientes</span>
                                <Badge variant="warning">{sales.filter(s => s.status === 'pending').length}</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* TABLE */}
            <Card className="bg-[#1F2937] border-gray-700">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Detalle de Transacciones</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="animate-spin text-primary h-8 w-8" />
                        </div>
                    ) : sales.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No se encontraron transacciones en este periodo.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-400 bg-[#111827] uppercase">
                                    <tr>
                                        <th className="px-4 py-3 rounded-tl-lg">Ítem</th>
                                        <th className="px-4 py-3">Usuario</th>
                                        <th className="px-4 py-3">Monto</th>
                                        <th className="px-4 py-3">Estado</th>
                                        <th className="px-4 py-3">Fecha</th>
                                        <th className="px-4 py-3 rounded-tr-lg">ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sales.map((sale) => (
                                        <tr key={sale.id} className="border-b border-gray-800 hover:bg-[#111827]/50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-white max-w-[200px] truncate" title={sale.course?.title || sale.bundle?.title}>
                                                {sale.course?.title || sale.bundle?.title || "Ítem desconocido"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-300">{sale.user.name || "Sin nombre"}</span>
                                                    <span className="text-gray-500 text-xs">{sale.user.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-bold text-emerald-400">{formatCurrency(sale.amount)}</td>
                                            <td className="px-4 py-3">{getStatusBadge(sale.status)}</td>
                                            <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{formatDate(sale.createdAt)}</td>
                                            <td className="px-4 py-3 text-gray-500 font-mono text-xs max-w-[100px] truncate" title={sale.paymentId}>{sale.paymentId}</td>
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
