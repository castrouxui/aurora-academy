"use client";

import { Container } from '@/components/layout/Container';
import { CourseCard } from './CourseCard';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getMockCourseReviews } from "@/lib/course-reviews";

export function CourseList() {
    const [ownedCourseIds, setOwnedCourseIds] = useState<string[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const coursesRes = await fetch("/api/courses?published=true");
                const myCoursesRes = await fetch("/api/my-courses");
                let myIds: string[] = [];
                if (myCoursesRes.ok) {
                    const myData = await myCoursesRes.json();
                    myIds = myData.map((c: any) => c.id);
                    setOwnedCourseIds(myIds);
                }
                if (coursesRes.ok) {
                    const data = await coursesRes.json();
                    const formattedCourses = data.slice(0, 4).map((course: any) => {
                        const sortedModules = course.modules?.sort((a: any, b: any) => a.position - b.position) || [];
                        const firstLessonWithVideo = sortedModules
                            .flatMap((m: any) => m.lessons?.sort((a: any, b: any) => a.position - b.position) || [])
                            .find((l: any) => l.videoUrl);
                        const basePrice = Number(course.price);
                        const discount = course.discount || 0;
                        const finalPrice = basePrice * (1 - discount / 100);
                        const { mockTotalRatings, mockAverageRating } = getMockCourseReviews(course.id);
                        return {
                            id: course.id,
                            title: course.title,
                            instructor: "Aurora Academy",
                            rating: mockAverageRating,
                            reviews: mockTotalRatings.toString(),
                            showDynamicStars: true,
                            price: new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(finalPrice),
                            oldPrice: discount > 0 ? new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(basePrice) : "",
                            discountPercentage: discount > 0 ? discount : undefined,
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
            <section className="py-28 border-b border-white/6">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-[#0B0F19] p-0">
                                <div className="aspect-video bg-white/5 animate-pulse" />
                                <div className="p-6 space-y-3">
                                    <div className="h-3 bg-white/5 rounded animate-pulse w-1/3" />
                                    <div className="h-5 bg-white/5 rounded animate-pulse w-4/5" />
                                    <div className="h-4 bg-white/5 rounded animate-pulse w-1/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>
        );
    }

    if (courses.length === 0) return null;

    return (
        <section className="py-28 md:py-36 border-b border-white/6">
            <Container>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <h2 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white leading-tight max-w-md">
                        Nuestros programas<br />destacados.
                    </h2>
                    <Link href="/cursos">
                        <button className="group text-sm font-semibold text-[#5D5CDE] hover:text-white transition-colors flex items-center gap-2">
                            Ver todos los cursos
                            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/6">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} isOwned={ownedCourseIds.includes(course.id)} />
                    ))}
                </div>
            </Container>
        </section>
    );
}
