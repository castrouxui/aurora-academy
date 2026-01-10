"use client";

import { useSession } from "next-auth/react";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Trophy, PlayCircle, Lock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Mock data for fallback
const MOCK_COURSES = [
    {
        id: "mock-1",
        title: "Introducción al Trading Profesional",
        description: "Domina los fundamentos del mercado financiero y comienza tu camino como trader.",
        imageUrl: "https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2664&auto=format&fit=crop",
        progress: 35,
        totalLessons: 12,
        completedLessons: 4,
        lastAccessed: "Hace 2 días"
    },
    {
        id: "mock-2",
        title: "Psicología del Inversor",
        description: "Aprende a gestionar tus emociones y mantener la disciplina en tus operaciones.",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
        progress: 80,
        totalLessons: 8,
        completedLessons: 6,
        lastAccessed: "Hace 1 hora"
    }
];

export default function MyCoursesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'not-started' | 'in-progress' | 'completed'>('in-progress');

    // ... (keep useEffects same) ...
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    useEffect(() => {
        async function fetchCourses() {
            try {
                const res = await fetch("/api/my-courses");
                if (res.ok) {
                    const data = await res.json();
                    setCourses(data.length > 0 ? data : MOCK_COURSES);
                } else {
                    console.warn("API Error, using mock data");
                    setCourses(MOCK_COURSES);
                }
            } catch (error) {
                console.error("Fetch error, using mock data", error);
                setCourses(MOCK_COURSES);
            } finally {
                setLoading(false);
            }
        }

        async function verifyPayment() {
            // Check for payment params in URL
            const params = new URLSearchParams(window.location.search);
            const paymentId = params.get("payment_id");
            const status = params.get("status");

            if (status === "approved" && paymentId) {
                console.log("Verifying payment...", paymentId);
                // Optional: Show a toast or loading indicator here

                try {
                    const res = await fetch("/api/payment/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ paymentId }),
                    });

                    if (res.ok) {
                        console.log("Payment verified successfully");
                        // Clear params to avoid re-verifying
                        router.replace("/dashboard/courses");
                    }
                } catch (error) {
                    console.error("Payment verification failed", error);
                }
            }
        }

        if (session?.user) {
            verifyPayment().then(() => fetchCourses());
        } else {
            setCourses(MOCK_COURSES);
            setLoading(false);
        }
    }, [session]);

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen pt-4 pb-12 bg-[#0B0F19]">
                <Container>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-48 bg-gray-800" />
                            <Skeleton className="h-4 w-64 bg-gray-800/50" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-9 w-24 bg-gray-800" />
                            <Skeleton className="h-9 w-24 bg-gray-800" />
                            <Skeleton className="h-9 w-24 bg-gray-800" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="rounded-xl overflow-hidden border border-gray-800 bg-[#111827]">
                                <Skeleton className="h-48 w-full bg-gray-800" />
                                <div className="p-6 space-y-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-3/4 bg-gray-800" />
                                        <Skeleton className="h-4 w-full bg-gray-800/50" />
                                    </div>
                                    <div className="pt-4 space-y-3">
                                        <div className="flex justify-between">
                                            <Skeleton className="h-3 w-12 bg-gray-800" />
                                            <Skeleton className="h-3 w-12 bg-gray-800" />
                                        </div>
                                        <Skeleton className="h-2 w-full bg-gray-800" />
                                    </div>
                                    <Skeleton className="h-10 w-full mt-4 bg-gray-800" />
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </div>
        );
    }

    const filteredCourses = courses.filter(course => {
        if (activeTab === 'not-started') return course.progress === 0;
        if (activeTab === 'in-progress') return course.progress > 0 && course.progress < 100;
        if (activeTab === 'completed') return course.progress === 100;
        return false;
    });

    return (
        <div className="min-h-screen pt-4 pb-12 bg-[#0B0F19]">
            <Container>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Mis Aprendizajes</h1>
                        <p className="text-gray-400">Gestiona el progreso de tus cursos.</p>
                    </div>

                    <div className="grid grid-cols-3 md:flex gap-1 md:gap-2 bg-[#1F2937] p-1 rounded-lg w-full md:w-auto">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`w-full md:w-auto ${activeTab === 'not-started' ? 'bg-[#374151] text-white' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => setActiveTab('not-started')}
                        >
                            <span className="truncate">Sin Empezar</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`w-full md:w-auto ${activeTab === 'in-progress' ? 'bg-[#374151] text-white' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => setActiveTab('in-progress')}
                        >
                            <span className="truncate">En Progreso</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`w-full md:w-auto ${activeTab === 'completed' ? 'bg-[#374151] text-white' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => setActiveTab('completed')}
                        >
                            <span className="truncate">Completados</span>
                        </Button>
                    </div>
                </div>

                {filteredCourses.length === 0 ? (
                    <div className="text-center py-20 bg-[#111827] rounded-xl border border-gray-800">
                        <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">
                            {activeTab === 'not-started'
                                ? "No tienes cursos pendientes de inicio"
                                : activeTab === 'in-progress'
                                    ? "No tienes cursos en progreso actualmente"
                                    : "No tienes cursos completados aún"}
                        </h3>
                        <p className="text-gray-400 mb-6">
                            {activeTab === 'completed'
                                ? "¡Sigue aprendiendo para conseguir tus certificados!"
                                : "Explora nuestro catálogo y comienza a aprender hoy mismo."}
                        </p>
                        <Link href="/dashboard/explore">
                            <Button className="bg-primary hover:bg-primary/90">Explorar Cursos</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => (
                            <Card key={course.id} className="bg-[#111827] border-gray-800 overflow-hidden flex flex-col hover:border-gray-700 transition-all group">
                                <div className="relative h-48 w-full overflow-hidden">
                                    <img
                                        src={course.imageUrl || "/placeholder-course.jpg"}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                        <Link href={`/learn/${course.id}`}>
                                            <Button className="rounded-full w-14 h-14 p-0 items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/50 text-white">
                                                <PlayCircle size={28} fill="currentColor" className="text-white" />
                                            </Button>
                                        </Link>
                                    </div>
                                    {/* Certificate Lock Badge */}
                                    <div className="absolute top-2 right-2">
                                        <div className={`backdrop-blur-md px-2 py-1 rounded-full text-[10px] font-medium border flex items-center gap-1 ${course.progress === 100
                                            ? 'bg-green-500/20 border-green-500/50 text-green-300'
                                            : 'bg-black/60 border-gray-600/50 text-gray-400'
                                            }`}>
                                            {course.progress === 100 ? <Trophy size={12} /> : <Lock size={12} />}
                                            {course.progress === 100 ? 'Certificado' : 'Bloqueado'}
                                        </div>
                                    </div>
                                </div>

                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start gap-2">
                                        <CardTitle className="text-lg font-semibold text-white line-clamp-2">
                                            {course.title}
                                        </CardTitle>
                                    </div>
                                    <CardDescription className="line-clamp-2 text-gray-400 mt-1">
                                        {course.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="pb-2 flex-grow">
                                    <div className="space-y-2 mt-2">
                                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                                            <span>Progreso: {course.progress}%</span>
                                            <span>{course.completedLessons}/{course.totalLessons} lecciones</span>
                                        </div>
                                        <Progress value={course.progress} className="h-2 bg-gray-800" indicatorClassName="bg-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-4 border-t border-gray-800/50 mt-auto">
                                    <Link href={`/learn/${course.id}`} className="w-full">
                                        <Button className="w-full gap-2 bg-[#1F2937] hover:bg-[#374151] text-white border border-gray-700">
                                            <PlayCircle size={16} />
                                            {activeTab === 'completed' ? "Repasar Curso" : activeTab === 'not-started' ? "Empezar Curso" : "Continuar Viendo"}
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}
