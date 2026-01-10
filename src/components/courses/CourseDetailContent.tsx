"use client";

import { Container } from "@/components/layout/Container";
import { CourseHero } from "@/components/courses/detail/CourseHero";
import { CourseSidebar } from "@/components/courses/detail/CourseSidebar";
import { CourseTabs } from "@/components/courses/detail/CourseTabs";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface CourseDetailContentProps {
    courseData: any;
    hasAccess: boolean;
    totalLessons: number;
    totalModules: number;
    breadcrumbs?: { label: string; href: string }[];
}

export function CourseDetailContent({
    courseData,
    hasAccess,
    totalLessons,
    totalModules,
    breadcrumbs
}: CourseDetailContentProps) {
    return (
        <>
            {/* Dark Header Background Layer */}
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-[#1F2937] z-0"></div>

            <div className="relative z-10">
                <Container className="pt-24 pb-12">
                    {/* Breadcrumbs */}
                    {breadcrumbs && (
                        <nav className="flex items-center text-sm text-gray-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
                            <Link href={breadcrumbs[0].href} className="hover:text-white transition-colors flex items-center gap-1">
                                <Home size={14} />
                                {breadcrumbs[0].label}
                            </Link>
                            {breadcrumbs.slice(1).map((crumb, index) => (
                                <div key={index} className="flex items-center">
                                    <ChevronRight size={14} className="mx-2 text-gray-600" />
                                    {index === breadcrumbs.length - 2 ? (
                                        <span className="text-white font-medium truncat">{crumb.label}</span>
                                    ) : (
                                        <Link href={crumb.href} className="hover:text-white transition-colors">
                                            {crumb.label}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </nav>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content Column */}
                        <div className="lg:col-span-2 space-y-8">
                            <CourseHero
                                title={courseData.title}
                                description={courseData.description || ""}
                                rating={courseData.rating}
                                totalRatings={courseData.totalRatings}
                                instructor={courseData.instructor}
                                videoThumbnail={courseData.videoThumbnail}
                                videoUrl={courseData.videoUrl}
                            />
                            <CourseTabs
                                modules={courseData.modules}
                                totalLessons={totalLessons}
                                totalModules={totalModules}
                                duration={courseData.duration}
                            />
                        </div>

                        {/* Sidebar Column */}
                        <div className="relative">
                            <div className="sticky top-24 z-20">
                                <CourseSidebar
                                    title={courseData.title}
                                    price={courseData.price}
                                    originalPrice={courseData.originalPrice}
                                    discount={courseData.discount}
                                    duration={courseData.duration}
                                    level={courseData.level}
                                    students={courseData.students}
                                    language={courseData.language}
                                    subtitles={courseData.subtitles}
                                    courseId={courseData.id}
                                    hasAccess={hasAccess}
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </>
    );
}
