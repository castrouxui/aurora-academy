"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StudentDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({
        inProgress: 0,
        completed: 0,
        totalCourses: 0
    });
    const [recentCourse, setRecentCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!session) return;
            try {
                const res = await fetch("/api/my-courses");
                if (res.ok) {
                    const courses = await res.json();

                    const inProgress = courses.filter((c: any) => c.progress > 0 && c.progress < 100).length;
                    const completed = courses.filter((c: any) => c.progress === 100).length;

                    setStats({
                        inProgress,
                        completed,
                        totalCourses: courses.length
                    });

                    // Find the first course in progress, or just the first course if none are in progress
                    const recent = courses.find((c: any) => c.progress > 0 && c.progress < 100) || courses[0];
                    setRecentCourse(recent);
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
    ];

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

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                                <Link href="/courses">
                                    <Button variant="outline" className="border-white/10 text-white hover:bg-white hover:text-black rounded-xl font-bold shiny-hover">
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
                                <Link href="/dashboard/certificates">
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
