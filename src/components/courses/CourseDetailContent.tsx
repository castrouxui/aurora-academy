import { Container } from "@/components/layout/Container";
import { CourseHero } from "@/components/courses/detail/CourseHero";
import { CourseFloatingCard } from "@/components/courses/detail/CourseFloatingCard";
import { CourseTabs } from "@/components/courses/detail/CourseTabs";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { CourseSidebar } from "@/components/courses/detail/CourseSidebar"; // Keep for safety if needed, but not used in new layout

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
        <div className="bg-[#0B0F19] min-h-screen">
            {/* Header / Hero Background Section */}
            <div className="bg-[#0B0F19] text-white pb-24 border-b border-gray-800">
                <Container className="pt-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Left Side: Hero Info */}
                        <div className="lg:col-span-8 py-8">
                            <CourseHero
                                title={courseData.title}
                                description={courseData.description || ""}
                                rating={courseData.rating}
                                totalRatings={courseData.totalRatings}
                                instructor={courseData.instructor}
                            />
                        </div>
                        {/* Right Side: Spacer (Card will be absolute/sticky) */}
                        <div className="hidden lg:block lg:col-span-4">
                            {/* Handled by the absolute positioning below/grid structure */}
                        </div>
                    </div>
                </Container>
            </div>

            {/* Main Content & Floating Card Container */}
            <Container className="-mt-12 relative z-10 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Course Details/Tabs */}
                    <div className="lg:col-span-8 space-y-12 pt-12">
                        <CourseTabs
                            modules={courseData.modules}
                            totalLessons={totalLessons}
                            totalModules={totalModules}
                            duration={courseData.duration}
                        />
                    </div>

                    {/* Right Column: Floating Card */}
                    <div className="lg:col-span-4 relative">
                        <div className="-mt-64 relative z-20 sticky top-24"> {/* Negative margin to pull it up into the dark area */}
                            <CourseFloatingCard
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
                                videoThumbnail={courseData.videoThumbnail}
                                videoUrl={courseData.videoUrl}
                            />
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
