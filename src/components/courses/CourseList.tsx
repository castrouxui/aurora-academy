"use client";

import { Button } from '@/components/ui/button';

import { Container } from '@/components/layout/Container';
import { CourseCard } from './CourseCard';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export function CourseList() {
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchCourses() {
            try {
                const res = await fetch("/api/courses?published=true");
                if (res.ok) {
                    const data = await res.json();
                    // Transform API data to UI format and take top 4
                    const formattedCourses = data.slice(0, 4).map((course: any) => {
                        const sortedModules = course.modules?.sort((a: any, b: any) => a.position - b.position) || [];
                        const firstLessonWithVideo = sortedModules
                            .flatMap((m: any) => m.lessons?.sort((a: any, b: any) => a.position - b.position) || [])
                            .find((l: any) => l.videoUrl);

                        return {
                            id: course.id,
                            title: course.title,
                            instructor: "Aurora Academy",
                            rating: 5.0,
                            reviews: "(120)",
                            price: new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(Number(course.price)),
                            image: course.imageUrl || "/course-placeholder.jpg",
                            tag: course.category || "General",
                            rawPrice: course.price,
                            videoUrl: firstLessonWithVideo?.videoUrl || null
                        };
                    });
                    setCourses(formattedCourses);
                }
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchCourses();
    }, []);

    if (isLoading) {
        return (
            <section className="py-24 bg-[#0B0F19]">
                <Container>
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5D5CDE]"></div>
                    </div>
                </Container>
            </section>
        );
    }

    if (courses.length === 0) return null;

    return (
        <section className="py-24 bg-[#0B0F19] transition-colors">
            <Container>
                <div className="text-center mb-16 space-y-4">
                    <span className="bg-[#5D5CDE]/10 text-[#5D5CDE] px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
                        Carreras y Cursos
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Potencia tu perfil profesional
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Programas intensivos diseñados para insertarte en el mercado rápidamente.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {courses.map((course, i) => (
                        <CourseCard key={i} course={course} />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/courses">
                        <Button size="lg" className="h-14 px-10 rounded-full bg-[#1F2937] text-white hover:bg-black font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                            Explorar todo el catálogo
                        </Button>
                    </Link>
                </div>
            </Container>
        </section>
    );
}
