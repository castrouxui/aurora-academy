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
                    const formattedCourses = data.slice(0, 4).map((course: any) => ({
                        id: course.id,
                        title: course.title,
                        instructor: "Aurora Academy",
                        rating: 5.0,
                        reviews: "(0)",
                        price: new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(Number(course.price)),
                        image: course.imageUrl || "/course-placeholder.jpg",
                        tag: course.category || "General",
                        rawPrice: course.price
                    }));
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
            <section className="py-20 bg-[#5D5CDE] text-white">
                <Container>
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    </div>
                </Container>
            </section>
        );
    }

    if (courses.length === 0) return null; // Hide section if no courses

    return (
        <section className="py-20 bg-[#5D5CDE] text-white">
            <Container>
                <h2 className="text-3xl font-bold text-center mb-12">Cursos más elegidos</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {courses.map((course, i) => (
                        <CourseCard key={i} course={course} />
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/courses">
                        <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold px-8">
                            Ver todos los cursos
                        </Button>
                    </Link>
                </div>
            </Container>
        </section>
    );
}
