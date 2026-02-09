"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Award, ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TelegramReminder } from "@/components/dashboard/TelegramReminder";
import { PromotionalBanner } from "@/components/dashboard/PromotionalBanner";
import { QuoteOfTheWeek } from "@/components/dashboard/QuoteOfTheWeek";
import { CareerProgressCard } from "@/components/dashboard/CareerProgressCard";

export default function StudentDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({
        inProgress: 0,
        completed: 0,
        totalCourses: 0
    });
    const [courses, setCourses] = useState<any[]>([]);
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
                    const data = await coursesRes.json();
                    const coursesList = Array.isArray(data) ? data : [];
                    setCourses(coursesList);

                    const inProgress = coursesList.filter((c: any) => c.progress > 0 && c.progress < 100).length;
                    const completed = coursesList.filter((c: any) => c.progress === 100).length;

                    setStats({
                        inProgress,
                        completed,
                        totalCourses: coursesList.length
                    });

                    const recent = coursesList.find((c: any) => c.progress > 0 && c.progress < 100) || coursesList[0];
                    setRecentCourse(recent);
                }

                if (bundlesRes.ok) {
                    const data = await bundlesRes.json();
                    const bundlesList = Array.isArray(data) ? data : [];
                    // Extract all unique items from bundles
                    const allItems = bundlesList.flatMap((b: any) => b.items || []);
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

    useEffect(() => {
        if (session?.user?.role === "ADMIN") {
            window.location.href = "/admin";
        }
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

            <QuoteOfTheWeek />

            {/* <TelegramReminder isVerified={session?.user?.telegramVerified || false} /> */}{/* DISABLED */}

            {/* Promotional Banner for Users with 0 Purchases, but hide for Admins */}
            {!hasPurchases && session?.user?.role !== "ADMIN" && <PromotionalBanner />}

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

            {/* Career Progress Card */}
            {session?.user?.id && (
                <div className="max-w-md">
                    <CareerProgressCard userId={session.user.id} careerReferenceId="career-trader-100" />
                </div>
            )}

            {/* Resources Section - Show only if items exist */}
            {/* Resources Section - Show only if items exist */}
            {membershipItems.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">✨</span>
                        <h2 className="text-2xl font-bold text-white">Recursos de tu Membresía</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {membershipItems.map((item, idx) => (
                            <div key={idx} className="group relative bg-[#1A1F2E] border border-white/5 hover:border-amber-500/50 rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10 flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                                            {item.type === 'LINK' ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                            )}
                                        </div>
                                        <div className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-gray-400 border border-white/5">
                                            {item.type === 'LINK' ? 'Enlace' : 'Archivo'}
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-white text-lg mb-1 group-hover:text-amber-500 transition-colors line-clamp-2">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                        Acceso exclusivo incluido en tu plan.
                                    </p>
                                </div>

                                {item.content && (item.content.startsWith('http') || item.content.startsWith('www')) ? (
                                    <Link href={item.content} target="_blank" rel="noopener noreferrer" className="mt-auto">
                                        <Button className="w-full bg-white/5 hover:bg-amber-500 hover:text-black text-white border border-white/5 group-hover:border-amber-500/50 transition-all font-medium">
                                            Acceder al Recurso
                                        </Button>
                                    </Link>
                                ) : (
                                    <div className="mt-auto bg-black/40 px-3 py-2 rounded border border-white/5 text-xs text-gray-400 font-mono text-center select-all break-all">
                                        {item.content || "Sin contenido"}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* My Learning Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Mis Cursos</h2>
                        <p className="text-gray-400 text-sm">Continúa donde dejaste</p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-48 bg-white/5 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course: any) => (
                            <Link key={course.id} href={`/learn/${course.id}`} className="group">
                                <Card className="bg-[#121620] border-white/5 overflow-hidden hover:border-[#5D5CDE]/50 transition-all duration-300 h-full flex flex-col">
                                    <div className="relative h-40 w-full overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#121620] to-transparent z-10" />
                                        <img
                                            src={course.imageUrl || "/course-placeholder.jpg"}
                                            alt={course.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute bottom-3 left-3 z-20">
                                            <div className="flex items-center gap-2">
                                                <span className="bg-[#5D5CDE] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                    Curso
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <CardContent className="p-5 flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-[#5D5CDE] transition-colors">
                                            {course.title}
                                        </h3>

                                        <div className="mt-auto space-y-3">
                                            <div className="flex items-center justify-between text-xs text-gray-400">
                                                <span>{course.progress}% completado</span>
                                                <span>{course.completedLessons}/{course.totalLessons} lecciones</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#5D5CDE] transition-all duration-500"
                                                    style={{ width: `${course.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">Aún no tienes cursos</h3>
                        <p className="text-gray-400 mb-6 max-w-sm mx-auto">Explora nuestros cursos y comienza tu camino como inversor hoy mismo.</p>
                        <Link href="/cursos">
                            <Button className="bg-[#5D5CDE] text-white hover:bg-[#4B4AC0]">
                                Ver Cursos
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
