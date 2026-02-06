"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, BookOpen, TrendingUp, ArrowRight, ShoppingCart, RefreshCw, Wrench, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>({
        revenue: 0,
        activeStudents: 0,
        publishedCourses: 0,
        recentSales: [],
        recentStudents: []
    });
    const [loading, setLoading] = useState(true);

    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [timeAgo, setTimeAgo] = useState("Sincronizando...");

    async function fetchStats() {
        // No loading state change to prevent flickers on auto-refresh
        try {
            // Explicitly prevent caching
            const res = await fetch("/api/admin/stats", {
                cache: 'no-store',
                headers: { 'Pragma': 'no-cache' }
            });

            if (res.ok) {
                const data = await res.json();

                // Soft Deduplication for Recent Sales Widget
                if (data.recentSales) {
                    const uniqueSales: any[] = [];
                    data.recentSales.forEach((sale: any) => {
                        const itemId = sale.course?.title || sale.bundle?.title || "unknown";
                        const key = itemId + sale.amount + sale.user.email;

                        const isDuplicate = uniqueSales.some((existing: any) => {
                            const existingKey = (existing.course?.title || existing.bundle?.title || "unknown") + existing.amount + existing.user.email;
                            return existingKey === key && Math.abs(new Date(existing.createdAt).getTime() - new Date(sale.createdAt).getTime()) < 60000;
                        });

                        if (!isDuplicate) uniqueSales.push(sale);
                    });
                    data.recentSales = uniqueSales;
                }

                setStats(data);
                setLastUpdated(new Date()); // This triggers the "Just now" status
            } else {
                // If error, maybe clear status or show offline? 
                // For now, let's keep old data but log error.
                console.error("Stats API returned error:", res.status);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchStats(); // Initial fetch

        // Auto-refresh every 60 seconds
        const interval = setInterval(() => {
            fetchStats();
        }, 60000);

        return () => clearInterval(interval);
    }, []); // Empty dependency array to run once on mount

    // Timer update every second for UI
    useEffect(() => {
        const timer = setInterval(() => {
            if (lastUpdated) {
                const diff = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
                if (diff < 60) setTimeAgo(`Actualizado hace ${diff} seg`);
                else if (diff < 3600) setTimeAgo(`Actualizado hace ${Math.floor(diff / 60)} min`);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [lastUpdated]);

    const refreshDashboard = () => {
        setLoading(true);
        fetchStats();
    };

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
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-2">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Dashboard</h1>
                    <p className="text-gray-400 mt-2 max-w-2xl">
                        Bienvenido al panel de control de Aurora Academy. Gestiona registros, ventas y accesos desde un solo lugar.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    {lastUpdated && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-xs font-medium mr-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            {timeAgo}
                        </div>
                    )}
                    <FixLegacySubsButton />
                    <GrantAccessModal onSuccess={refreshDashboard} />
                    <RecoveryButton onRefresh={refreshDashboard} />
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
                                                    {sale.course?.title || sale.bundle?.title || sale.productName || "Ítem desconocido"}
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
                                        <div className="ml-auto text-xs text-gray-500 whitespace-nowrap">
                                            {new Date(student.createdAt).toLocaleDateString("es-AR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
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

function RecoveryButton({ onRefresh }: { onRefresh: () => void }) {
    const [loading, setLoading] = useState(false);

    const handleRecover = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/recover', { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                if (data.recovered > 0) {
                    toast.success(`¡Éxito! ${data.recovered} ventas recuperadas.`);
                    onRefresh();
                } else {
                    toast.info("Todo al día. No se encontraron nuevas ventas.");
                }
            } else {
                toast.error(`Error: ${data.error || "Fallo del servidor"}`);
            }
        } catch (error) {
            toast.error("Error de conexión al intentar recuperar datos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleRecover}
            disabled={loading}
            variant="outline"
            className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition-all bg-transparent"
        >
            {loading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Sincronizar Pagos
        </Button>
    );
}


function FixLegacySubsButton() {
    const [loading, setLoading] = useState(false);

    const handleFix = async () => {
        if (!confirm("Esto buscará compras de membresías antiguas sin acceso y les creará una suscripción manual por 30 días. ¿Continuar?")) return;

        setLoading(true);
        try {
            const res = await fetch('/api/maintenance/fix-legacy-subs', { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                toast.success(`Resultado: ${data.message}`);
            } else {
                toast.error(`Error: ${data.error || "Fallo del servidor"}`);
            }
        } catch (error) {
            toast.error("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleFix}
            disabled={loading}
            variant="ghost"
            className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 border border-amber-500/10 transition-all font-medium"
        >
            {loading ? (
                <Wrench className="w-4 h-4 mr-2 animate-spin" />
            ) : (
                <Wrench className="w-4 h-4 mr-2" />
            )}
            Reparar Suscripciones
        </Button>
    );
}

function GrantAccessModal({ onSuccess }: { onSuccess?: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState<any[]>([]);
    const [bundles, setBundles] = useState<any[]>([]);

    // Form state
    const [email, setEmail] = useState("");
    const [selectedId, setSelectedId] = useState("");
    const [type, setType] = useState<"COURSE" | "BUNDLE">("COURSE");
    const [status, setStatus] = useState<{ success: boolean; msg: string } | null>(null);

    useEffect(() => {
        if (isOpen) {
            // Fetch catalog for dropdown
            const fetchCatalog = async () => {
                try {
                    // Quick fetch of ALL courses/bundles via stats or public API? 
                    // Let's assume we can fetch from our exploration APIs or similar.
                    // For simplicity in Admin, let's fetch from the explorer APIs which are public.
                    const [resCourses, resBundles] = await Promise.all([
                        fetch('/api/courses'),
                        fetch('/api/bundles')
                    ]);

                    if (resCourses.ok) setCourses(await resCourses.json());
                    if (resBundles.ok) setBundles(await resBundles.json());
                } catch (e) {
                    console.error("Error fetching catalog", e);
                }
            };
            fetchCatalog();
        }
    }, [isOpen]);

    const handleGrant = async () => {
        if (!email || !selectedId) return;

        setLoading(true);
        setStatus(null);
        try {
            const body = {
                email,
                courseId: type === "COURSE" ? selectedId : undefined,
                bundleId: type === "BUNDLE" ? selectedId : undefined
            };

            const res = await fetch('/api/admin/grant-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();
            if (res.ok) {
                setStatus({ success: true, msg: "¡Acceso otrogado exitosamente!" });
                if (onSuccess) onSuccess();
                setTimeout(() => {
                    setIsOpen(false);
                    setStatus(null);
                    setEmail("");
                    setSelectedId("");
                }, 2000);
            } else {
                setStatus({ success: false, msg: data.error || "Error al otorgar acceso" });
            }
        } catch (error) {
            setStatus({ success: false, msg: "Error de conexión" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className="bg-[#5D5CDE] hover:bg-[#4b4ac0] text-white gap-2 font-bold shadow-lg shadow-[#5D5CDE]/20"
            >
                <Plus size={16} /> Otorgar Acceso
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#1a1b26] border border-white/10 w-full max-w-md p-6 rounded-2xl shadow-2xl relative">
                        <h2 className="text-xl font-bold text-white mb-4">Otorgar Acceso Manual</h2>
                        <p className="text-sm text-gray-400 mb-6">
                            Habilita un curso o paquete a un usuario registrado que tuvo problemas con el pago.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email del Usuario</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="usuario@ejemplo.com"
                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#5D5CDE] outline-none"
                                />
                            </div>

                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        checked={type === "COURSE"}
                                        onChange={() => { setType("COURSE"); setSelectedId(""); }}
                                    /> Curso
                                </label>
                                <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        checked={type === "BUNDLE"}
                                        onChange={() => { setType("BUNDLE"); setSelectedId(""); }}
                                    /> Paquete
                                </label>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                    Seleccionar {type === "COURSE" ? "Curso" : "Paquete"}
                                </label>
                                <select
                                    value={selectedId}
                                    onChange={(e) => setSelectedId(e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#5D5CDE] outline-none appearance-none"
                                >
                                    <option value="">-- Seleccionar --</option>
                                    {type === "COURSE"
                                        ? courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)
                                        : bundles.map(b => <option key={b.id} value={b.id}>{b.title}</option>)
                                    }
                                </select>
                            </div>

                            {status && (
                                <div className={`p-3 rounded-lg text-sm font-medium text-center ${status.success ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                                    {status.msg}
                                </div>
                            )}

                            <div className="flex gap-3 mt-6">
                                <Button
                                    variant="ghost"
                                    className="flex-1 text-gray-400 hover:text-white"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    className="flex-1 bg-[#5D5CDE] hover:bg-[#4b4ac0] text-white"
                                    onClick={handleGrant}
                                    disabled={loading || !email || !selectedId}
                                >
                                    {loading ? "Procesando..." : "Confirmar Acceso"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
