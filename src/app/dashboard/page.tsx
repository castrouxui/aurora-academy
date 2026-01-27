"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Award, ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TelegramReminder } from "@/components/dashboard/TelegramReminder";
import { PromotionalBanner } from "@/components/dashboard/PromotionalBanner";

export default function StudentDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({
        inProgress: 0,
        completed: 0,
        totalCourses: 0
    });
    const [recentCourse, setRecentCourse] = useState<any>(null);
    const [membershipItems, setMembershipItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!session) return;
            try {
                // Parallel fetch for courses and bundles
                const [coursesRes, bundlesRes] = await Promise.all([
                    fetch("/api/my-courses"),
                    fetch("/api/my-bundles")
                ]);

                if (coursesRes.ok) {
                    const courses = await coursesRes.json();

                    const inProgress = courses.filter((c: any) => c.progress > 0 && c.progress < 100).length;
                    const completed = courses.filter((c: any) => c.progress === 100).length;

                    setStats({
                        inProgress,
                        completed,
                        totalCourses: courses.length
                    });

                    const recent = courses.find((c: any) => c.progress > 0 && c.progress < 100) || courses[0];
                    setRecentCourse(recent);
                }

                if (bundlesRes.ok) {
                    const bundles = await bundlesRes.json();
                    // Extract all unique items from bundles
                    const allItems = bundles.flatMap((b: any) => b.items || []);
                    // Filter duplicates by name + content if needed, or just show all
                    setMembershipItems(allItems);
                }

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [session]);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Cargando tu progreso...</div>;
    }

    const statCards = [
        {
            title: "Cursos en Progreso",
            value: stats.inProgress.toString(),
            description: stats.inProgress === 1 ? "Curso activo" : "Cursos activos",
            icon: BookOpen,
            color: "text-blue-500",
        },
        {
            title: "Certificados",
            value: stats.completed.toString(),
            description: "Completados hasta ahora",
            icon: Award,
            color: "text-purple-500",
        },
        // Only show resources stat if they have any
        ...(membershipItems.length > 0 ? [{
            title: "Recursos Extra",
            value: membershipItems.length.toString(),
            description: "Enlaces de membresía",
            icon: Award, // Reusing Award or similar, usually LinkIcon but importing specifically
            color: "text-amber-500",
        }] : [])
    ];

    const hasPurchases = stats.totalCourses > 0 || membershipItems.length > 0;

    // REMOVED: Early return "if (!hasPurchases && !loading)"
    // The Dashboard will now always render, showing zeroes + Banner if applicable.

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                    Hola, {session?.user?.name?.split(" ")[0]} 👋
                </h1>
                <p className="text-gray-400">
                    Bienvenido a tu panel de aprendizaje. Aquí tienes un resumen de tu progreso.
                </p>
            </div>

            {/* <TelegramReminder isVerified={session?.user?.telegramVerified || false} /> */}{/* DISABLED */}

            {/* Promotional Banner for Users with 0 Purchases */}
            {!hasPurchases && <PromotionalBanner />}

            {/* Stats Grid */}
            <div className={`grid gap-4 md:grid-cols-2 ${membershipItems.length > 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
                {statCards.map((stat) => (
                    <Card key={stat.title} className="bg-white/5 border-white/5 shadow-lg group hover:border-[#5D5CDE]/30 hover:bg-white/10 transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-bold text-gray-300">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-white">{stat.value}</div>
                            <p className="text-xs text-gray-500 font-medium mt-1">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Resources Section - Show only if items exist */}
            {membershipItems.length > 0 && (
                <Card className="bg-[#131722] border-amber-500/20 shadow-xl shadow-amber-500/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
                    <CardHeader className="border-b border-white/5 pb-4">
                        <CardTitle className="text-white flex items-center gap-2">
                            <span className="text-amber-500">✨</span> Recursos de tu Membresía
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            Acceso exclusivo a grupos y herramientas de tus planes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {membershipItems.map((item, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/50 transition-colors gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 shrink-0 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-500">
                                            {/* Generic link icon */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm">{item.name}</p>
                                            <p className="text-xs text-gray-400 w-full truncate max-w-[200px]">
                                                {item.type === 'LINK' ? 'Enlace externo' : 'Recurso descargable'}
                                            </p>
                                        </div>
                                    </div>
                                    {item.content && (item.content.startsWith('http') || item.content.startsWith('www')) ? (
                                        <Link href={item.content} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                                            <Button size="sm" className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold">
                                                Acceder
                                            </Button>
                                        </Link>
                                    ) : (
                                        <div className="bg-black/30 px-3 py-2 rounded text-sm text-gray-300 font-mono w-full sm:w-auto text-center select-all">
                                            {item.content || "Sin contenido"}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recent Activity / Continue Learning */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-white/5 border-white/5 flex flex-col shadow-xl shadow-black/20">
                    <CardHeader className="border-b border-white/5 pb-4">
                        <CardTitle className="text-white">Continuar Aprendiendo</CardTitle>
                        <CardDescription className="text-gray-400">
                            Tu actividad reciente
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-center pt-6">
                        {recentCourse ? (
                            <>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 mb-6 hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-[#5D5CDE]/20 flex items-center justify-center text-[#5D5CDE]">
                                            <BookOpen size={24} />
                                        </div>
                                        <div>
                                            <p className="text-base font-bold text-white mb-1">{recentCourse.title}</p>
                                            <div className="flex items-center gap-3">
                                                <div className="h-1.5 w-24 bg-gray-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#5D5CDE]" style={{ width: `${recentCourse.progress}%` }} />
                                                </div>
                                                <span className="text-xs font-bold text-[#5D5CDE]">{recentCourse.progress}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Link href={`/learn/${recentCourse.id}`}>
                                        <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10">
                                            <ArrowRight size={20} />
                                        </Button>
                                    </Link>
                                </div>
                                <Link href={`/learn/${recentCourse.id}`}>
                                    <Button className="w-full h-12 bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white rounded-xl font-bold shiny-hover shadow-[0_0_20px_rgba(93,92,222,0.3)]">
                                        Continuar curso
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-400 mb-6 font-medium">No has iniciado ningún curso aún.</p>
                                <Link href="/cursos">
                                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 hover:text-white rounded-xl font-bold shiny-hover">
                                        Explorar Cursos
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/5 flex flex-col shadow-xl shadow-black/20">
                    <CardHeader className="border-b border-white/5 pb-4">
                        <CardTitle className="text-white">Logros Recientes</CardTitle>
                        <CardDescription className="text-gray-400">
                            Medallas y certificados
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col items-center justify-center py-8 text-center space-y-4">
                        {stats.completed > 0 ? (
                            <>
                                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center text-emerald-500 mb-2 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                    <Award size={40} />
                                </div>
                                <div>
                                    <p className="text-lg text-white font-bold">¡Excelente trabajo!</p>
                                    <p className="text-sm text-gray-400">Has completado {stats.completed} curso(s)</p>
                                </div>
                                <Link href="/dashboard/certificados">
                                    <Button variant="outline" className="text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-300 rounded-lg">
                                        Ver Mis Certificados
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <div className="h-20 w-20 rounded-2xl bg-gray-800/50 flex items-center justify-center text-gray-600 border border-gray-700">
                                    <Award size={40} />
                                </div>
                                <div>
                                    <p className="text-base text-gray-300 font-medium">Aún no tienes certificados</p>
                                    <p className="text-sm text-gray-500">¡Completa tu primer curso para ganar uno!</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
