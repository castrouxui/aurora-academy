"use client";

import { Button } from '@/components/ui/button';

import { Container } from '@/components/layout/Container';
import { CourseCard } from './CourseCard';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

export function CourseList() {
    const [ownedCourseIds, setOwnedCourseIds] = useState<string[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { ref, isInView } = useInView();

    useEffect(() => {
        async function fetchData() {
            try {
                // 1. Fetch Public Courses
                const coursesRes = await fetch("/api/courses?published=true");

                // 2. Fetch User's Owned Courses (if logged in)
                const myCoursesRes = await fetch("/api/my-courses");
                let myIds: string[] = [];
                if (myCoursesRes.ok) {
                    const myData = await myCoursesRes.json();
                    myIds = myData.map((c: any) => c.id);
                    setOwnedCourseIds(myIds);
                }

                if (coursesRes.ok) {
                    const data = await coursesRes.json();
                    // Transform API data to UI format layout (All courses)
                    const formattedCourses = data.map((course: any) => {
                        const sortedModules = course.modules?.sort((a: any, b: any) => a.position - b.position) || [];
                        const firstLessonWithVideo = sortedModules
                            .flatMap((m: any) => m.lessons?.sort((a: any, b: any) => a.position - b.position) || [])
                            .find((l: any) => l.videoUrl);

                        const basePrice = Number(course.price);
                        const discount = course.discount || 0;
                        const finalPrice = basePrice * (1 - discount / 100);

                        return {
                            id: course.id,
                            title: course.title,
                            price: new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(finalPrice),
                            image: course.imageUrl || "/course-placeholder.jpg",
                            tag: course.category || "General",
                            rawPrice: finalPrice,
                            videoUrl: firstLessonWithVideo?.videoUrl || null
                        };
                    });
                    setCourses(formattedCourses);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <section className="py-28 bg-background">
                <Container>
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                </Container>
            </section>
        );
    }

    if (courses.length === 0) return null;

    return (
        <section ref={ref} className="py-28 bg-background">
            <Container>
                <div className={cn("text-center mb-16 space-y-4 fade-in-up", isInView && "visible")}>
                    <div className="inline-block text-[10px] font-black tracking-widest uppercase bg-primary/10 text-primary px-3 py-1.5 rounded-full mb-2">
                        Programas Disponibles
                    </div>
                    <h2 className="text-[40px] md:text-[56px] font-black leading-[1.1] tracking-tight text-foreground">
                        Elegí tu nivel de profundidad.
                    </h2>
                    <p className="text-[16px] md:text-[18px] text-muted-foreground font-normal max-w-2xl mx-auto leading-relaxed">
                        Catálogo completo de formaciones. Desde organizar tus finanzas personales hasta armar carteras institucionales.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course, i) => (
                        <CourseCard key={course.id} course={course} isOwned={ownedCourseIds.includes(course.id)} />
                    ))}
                </div>
            </Container>
        </section>
    );
}
