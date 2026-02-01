import { Container } from "@/components/layout/Container";
import { CourseHero } from "@/components/cursos/detail/CourseHero";
import { CourseFloatingCard } from "@/components/cursos/detail/CourseFloatingCard";
import { CourseTabs } from "@/components/cursos/detail/CourseTabs";
import { InstructorCard } from "@/components/cursos/InstructorCard";
import { CourseFAQ } from "@/components/cursos/detail/CourseFAQ";
import { TestimonialsSection } from "@/components/layout/TestimonialsSection";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { MobileCourseCTA } from "@/components/cursos/detail/MobileCourseCTA";
import { ReviewList } from "@/components/reviews/ReviewList";
import { ReviewForm } from "@/components/reviews/ReviewForm";
// import { CourseSidebar } from "@/components/cursos/detail/CourseSidebar"; // Unused

interface CourseDetailContentProps {
    courseData: any;
    hasAccess: boolean;
    totalLessons: number;
    totalModules: number;
    breadcrumbs?: { label: string; href: string }[];
    reviews?: any[];
    canReview?: boolean;
    totalCourses?: number;
}

export function CourseDetailContent({
    courseData,
    hasAccess,
    totalLessons,
    totalModules,

    breadcrumbs,
    reviews,
    canReview,
    totalCourses
}: CourseDetailContentProps) {
    return (
        <div className="bg-[#0B0F19] min-h-screen">
            <Container className="pt-24 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
                    {/* Left Column: Hero + Content */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Hero Section */}
                        <div className="py-2"> {/* Small padding adjustment */}
                            <CourseHero
                                title={courseData.title}
                                description={courseData.description || ""}
                                shortDescription={courseData.shortDescription}
                                rating={courseData.rating}
                                totalRatings={courseData.totalRatings}
                                instructor={courseData.instructor}
                                image={courseData.videoThumbnail || courseData.imageUrl}
                            />
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-800" />

                        {/* Tabs & Details */}
                        <CourseTabs
                            modules={courseData.modules}
                            totalLessons={totalLessons}
                            totalModules={totalModules}
                            duration={courseData.duration}
                            description={courseData.description}
                            learningOutcomes={courseData.learningOutcomes}
                        />

                        {/* Instructor Section */}
                        <div id="instructor" className="pt-12 border-t border-white/5">
                            <InstructorCard totalCourses={totalCourses} />
                        </div>

                        {/* FAQ Section */}
                        {/* FAQ Section */}
                        <div id="faq" className="pt-12 border-t border-white/5">
                            <CourseFAQ />
                        </div>

                        {/* Reviews Section */}
                        <div id="reviews" className="pt-12 border-t border-white/5">
                            <div className="space-y-8">
                                <h2 className="text-2xl font-black text-white font-headings">
                                    Opiniones de Estudiantes
                                    <span className="ml-3 text-lg font-medium text-gray-500">({reviews?.length || 0})</span>
                                </h2>

                                {canReview && (
                                    <ReviewForm courseId={courseData.id} />
                                )}

                                <ReviewList reviews={reviews || []} />
                            </div>
                        </div>

                        {/* Testimonials (Moved inside flow or keep separate?) 
                             If sticky sidebar should scroll past testimonials, keep testimonials in left col? 
                             Or usually testimonials are full width at bottom. 
                             Let's put testimonials at the very bottom outside grid if they are wide.
                             But if sticky card needs to coexist, it stops at grid bottom. 
                             Let's keep testimonials outside grid for now as in original designs. */
                        }
                    </div>

                    {/* Right Column: Floating Card */}
                    <div className="hidden lg:block lg:col-span-4 relative">
                        {/* 
                            Align top: 
                            Hero has Breadcrumbs (~30px) + mb-6 (24px) = ~54px.
                            We add mt-14 (56px) or mt-[52px] to align with Title.
                        */}
                        <div className="sticky top-8 mt-[54px] z-20">
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
                                rawPrice={courseData.rawPrice}
                            />
                        </div>
                    </div>
                </div>
            </Container>

            {/* Testimonials */}
            <div className="border-t border-white/5 pb-24 lg:pb-0"> {/* Add padding bottom for mobile cta */}
                <TestimonialsSection />
            </div>

            <MobileCourseCTA
                title={courseData.title}
                price={courseData.price}
                courseId={courseData.id}
                hasAccess={hasAccess}
                rawPrice={courseData.rawPrice}
            />
        </div>
    );
}
