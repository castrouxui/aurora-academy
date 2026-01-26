"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, BookOpen, TrendingUp, ArrowRight, ShoppingCart, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>({
        revenue: 0,
        activeStudents: 0,
        publishedCourses: 0,
        recentSales: [],
        recentStudents: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/admin/stats");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const kpiData = [
        {
            title: "Ingresos Totales",
            value: new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", notation: "compact", maximumFractionDigits: 1 }).format(stats.revenue),
            change: "Histórico",
            icon: DollarSign,
            color: "text-emerald-500",
            href: "/admin/sales"
        },
        {
            title: "Estudiantes Activos",
            value: stats.activeStudents,
            change: "Registrados",
            icon: Users,
            color: "text-blue-500",
            href: "/admin/users"
        },
        {
            title: "Cursos Publicados",
            value: stats.publishedCourses,
            change: "Disponibles",
            icon: BookOpen,
            color: "text-purple-500",
            href: "/admin/cursos"
        },
        {
            title: "Ventas Totales",
            value: stats.recentSales.length > 0 ? "Activo" : "Sin ventas", // Placeholder metric
            change: "Estado actual",
            icon: TrendingUp,
            color: "text-amber-500",
            href: "/admin/sales"
        },
    ];

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5D5CDE]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-gray-400 mt-2">Bienvenido al panel de control de Aurora Academy.</p>
                </div>
                <div className="flex items-center gap-2">
                    <RecoveryButton />
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {kpiData.map((stat) => (
                    <Link href={stat.href} key={stat.title} className="block transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
                        <Card className="bg-white/5 border-white/5 h-full hover:border-[#5D5CDE]/30 hover:shadow-[0_0_20px_rgba(93,92,222,0.1)] transition-all">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                                    <stat.icon className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl md:text-2xl font-black text-white tracking-tight" title={String(stat.value)}>
                                    {stat.value}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-white/5 border-white/5 flex flex-col shadow-xl shadow-black/20">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
                        <CardTitle className="text-lg font-bold text-white">Ventas Recientes</CardTitle>
                        <Link href="/admin/sales">
                            <Button variant="ghost" className="text-xs text-[#5D5CDE] hover:text-white hover:bg-[#5D5CDE]/10 h-auto py-1 px-3 rounded-full gap-1">
                                Ver todo <ArrowRight size={12} />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="flex-1 pt-6">
                        {stats.recentSales.length === 0 ? (
                            <div className="text-sm text-gray-500 text-center py-8">
                                No hay ventas recientes.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {stats.recentSales.map((sale: any) => (
                                    <div key={sale.id} className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-[#5D5CDE]/10 p-2.5 rounded-full text-[#5D5CDE] group-hover:scale-110 transition-transform">
                                                <ShoppingCart size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">
                                                    {sale.course?.title || sale.bundle?.title || "Ítem desconocido"}
                                                </p>
                                                <p className="text-xs text-gray-400">{sale.user.name || sale.user.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-white">
                                                {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(sale.amount)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/5 flex flex-col shadow-xl shadow-black/20">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
                        <CardTitle className="text-lg font-bold text-white">Estudiantes Recientes</CardTitle>
                        <Link href="/admin/users">
                            <Button variant="ghost" className="text-xs text-[#5D5CDE] hover:text-white hover:bg-[#5D5CDE]/10 h-auto py-1 px-3 rounded-full gap-1">
                                Ver todo <ArrowRight size={12} />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="flex-1 pt-6">
                        {stats.recentStudents.length === 0 ? (
                            <div className="text-sm text-gray-500 text-center py-8">
                                No hay registros recientes.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {stats.recentStudents.map((student: any, i: number) => (
                                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors">
                                        <img
                                            src={student.image || `https://ui-avatars.com/api/?name=${student.name}&background=random`}
                                            alt={student.name}
                                            className="w-10 h-10 rounded-full border border-gray-700"
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-white">{student.name}</p>
                                            <p className="text-xs text-gray-400 font-medium">{student.email}</p>
                                        </div>
                                        <div className="ml-auto text-xs text-gray-500">
                                            Hace un momento
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function RecoveryButton() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<null | { recovered: number, message: string }>(null);

    const handleRecover = async () => {
        setLoading(true);
        setResult(null);
        try {
            const res = await fetch('/api/admin/recover', { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                setResult({
                    recovered: data.recovered,
                    message: data.recovered > 0
                        ? `¡Éxito! ${data.recovered} ventas recuperadas.`
                        : "Todo al día."
                });
                if (data.recovered > 0) {
                    setTimeout(() => window.location.reload(), 1500);
                }
            } else {
                setResult({ recovered: 0, message: `Error: ${data.error || "Fallo del servidor"}` });
            }
        } catch (error) {
            setResult({ recovered: 0, message: "Error de conexión" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            {result && (
                <span className={`text-sm font-medium ${result.message.includes("Error") ? "text-red-400" : "text-green-400"} animate-in fade-in`}>
                    {result.message}
                </span>
            )}
            <Button
                onClick={handleRecover}
                disabled={loading}
                variant="outline"
                className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
            >
                {loading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Actualizar datos
            </Button>
        </div>
    );
}
