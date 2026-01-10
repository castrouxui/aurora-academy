"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, BookOpen, TrendingUp, ArrowRight, ShoppingCart } from "lucide-react";
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
            value: new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(stats.revenue),
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
            href: "/admin/courses"
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
                    <Link href={stat.href} key={stat.title} className="block transition-transform hover:scale-105">
                        <Card className="bg-[#1F2937] border-gray-700 h-full hover:border-[#5D5CDE]/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-[#1F2937] border-gray-700 flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-white">Ventas Recientes</CardTitle>
                        <Link href="/admin/sales">
                            <Button variant="ghost" className="text-xs text-[#5D5CDE] hover:text-white p-0 h-auto gap-1">
                                Ver todo <ArrowRight size={12} />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="flex-1">
                        {stats.recentSales.length === 0 ? (
                            <div className="text-sm text-gray-500 text-center py-8">
                                No hay ventas recientes.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {stats.recentSales.map((sale: any) => (
                                    <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg bg-[#111827]/50 border border-gray-800">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-emerald-500/10 p-2 rounded-full text-emerald-500">
                                                <ShoppingCart size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">{sale.course.title}</p>
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

                <Card className="bg-[#1F2937] border-gray-700 flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-white">Estudiantes Recientes</CardTitle>
                        <Link href="/admin/users">
                            <Button variant="ghost" className="text-xs text-[#5D5CDE] hover:text-white p-0 h-auto gap-1">
                                Ver todo <ArrowRight size={12} />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="flex-1">
                        {stats.recentStudents.length === 0 ? (
                            <div className="text-sm text-gray-500 text-center py-8">
                                No hay registros recientes.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {stats.recentStudents.map((student: any, i: number) => (
                                    <div key={i} className="flex items-center gap-3 p-2">
                                        <img
                                            src={student.image || `https://ui-avatars.com/api/?name=${student.name}&background=random`}
                                            alt={student.name}
                                            className="w-8 h-8 rounded-full border border-gray-700"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-white">{student.name}</p>
                                            <p className="text-xs text-gray-400">{student.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
// ... (previous code)

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
                } else {
                    setResult({ recovered: 0, message: "Error" });
                }
            } catch (error) {
                setResult({ recovered: 0, message: "Error" });
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
                    className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                        <TrendingUp className="w-4 h-4 mr-2" />
                    )}
                    Sincronizar Ventas
                </Button>
            </div>
        );
    }

    export default function AdminDashboard() {
        // ... (existing state)

        return (
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                        <p className="text-gray-400 mt-2">Bienvenido al panel de control de Aurora Academy.</p>
                    </div>
                    <RecoveryButton />
                </div>

                {/* KPI Grid ... */}

