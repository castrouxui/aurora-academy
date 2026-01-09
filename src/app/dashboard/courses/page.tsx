"use client";

import { useSession } from "next-auth/react";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Trophy, PlayCircle } from "lucide-react";
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
                    setCourses(data.length > 0 ? data : MOCK_COURSES); // Fallback to mock if empty response for demo
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

        if (session?.user) {
            fetchCourses();
        } else {
            // Show mock for dev preview if not logged in or during loading
            setCourses(MOCK_COURSES);
            setLoading(false);
        }
    }, [session]);

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-[#0B0F19]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#0B0F19]">
            <Container>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Mis Aprendizajes</h1>
                        <p className="text-gray-400">Continúa donde dejaste tus cursos.</p>
                    </div>

                    <div className="flex gap-2 bg-[#1F2937] p-1 rounded-lg">
                        <Button variant="ghost" size="sm" className="bg-[#374151] text-white hover:bg-[#374151]">
                            En Progreso
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            Completados
                        </Button>
                    </div>
                </div>

                {courses.length === 0 ? (
                    <div className="text-center py-20 bg-[#111827] rounded-xl border border-gray-800">
                        <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No tienes cursos activos</h3>
                        <p className="text-gray-400 mb-6">Explora nuestro catálogo y comienza a aprender hoy mismo.</p>
                        <Link href="/courses">
                            <Button className="bg-primary hover:bg-primary/90">Explorar Cursos</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
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
                                            Continuar Viendo
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
