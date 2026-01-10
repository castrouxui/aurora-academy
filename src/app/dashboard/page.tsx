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
                    <Card key={stat.title} className="bg-[#111827] border-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-200">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <p className="text-xs text-gray-500">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity / Continue Learning */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-[#111827] border-gray-800 flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-white">Continuar Aprendiendo</CardTitle>
                        <CardDescription className="text-gray-400">
                            Tu actividad reciente
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-center">
                        {recentCourse ? (
                            <>
                                <div className="flex items-center justify-between p-4 rounded-lg bg-[#1F2937]/50 border border-gray-700/50 mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded bg-[#5D5CDE]/20 flex items-center justify-center text-[#5D5CDE]">
                                            <BookOpen size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{recentCourse.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="h-1.5 w-20 bg-gray-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#5D5CDE]" style={{ width: `${recentCourse.progress}%` }} />
                                                </div>
                                                <span className="text-xs text-gray-500">{recentCourse.progress}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Link href={`/learn/${recentCourse.id}`}>
                                        <Button size="sm" variant="ghost" className="text-[#5D5CDE] hover:text-[#5D5CDE] hover:bg-[#5D5CDE]/10">
                                            <ArrowRight size={16} />
                                        </Button>
                                    </Link>
                                </div>
                                <Link href={`/learn/${recentCourse.id}`}>
                                    <Button className="w-full bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white rounded-lg">
                                        Continuar curso
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-gray-500 mb-4">No has iniciado ningún curso aún.</p>
                                <Link href="/dashboard/explore">
                                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white rounded-lg">
                                        Explorar Cursos
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-[#111827] border-gray-800 flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-white">Logros Recientes</CardTitle>
                        <CardDescription className="text-gray-400">
                            Medallas y certificados
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col items-center justify-center py-8 text-center space-y-3">
                        {stats.completed > 0 ? (
                            <>
                                <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-2">
                                    <Award size={32} />
                                </div>
                                <p className="text-sm text-white font-medium">¡Has completado {stats.completed} curso(s)!</p>
                                <Link href="/dashboard/certificates">
                                    <Button variant="link" className="text-emerald-400 hover:text-emerald-300 p-0 h-auto">
                                        Ver Certificados
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center text-gray-600">
                                    <Award size={32} />
                                </div>
                                <p className="text-sm text-gray-400">Aún no tienes certificados.</p>
                                <p className="text-xs text-gray-500">¡Completa tu primer curso para ganar uno!</p>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
