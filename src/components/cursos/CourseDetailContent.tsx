import { Container } from "@/components/layout/Container";
import { CourseHero } from "@/components/cursos/detail/CourseHero";
import { CourseFloatingCard } from "@/components/cursos/detail/CourseFloatingCard";
import { CourseTabs } from "@/components/cursos/detail/CourseTabs";
import { InstructorCard } from "@/components/cursos/InstructorCard";
import { CourseFAQ } from "@/components/cursos/detail/CourseFAQ";
import { TestimonialsSection } from "@/components/layout/TestimonialsSection";
import { MobileCourseCTA } from "@/components/cursos/detail/MobileCourseCTA";
import { ReviewList } from "@/components/reviews/ReviewList";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { FeaturedTestimonial } from "@/components/cursos/detail/FeaturedTestimonial";

interface CourseDetailContentProps {
    courseData: any;
    hasAccess: boolean;
    totalLessons: number;
    totalModules: number;
    breadcrumbs?: { label: string; href: string }[];
    reviews?: any[];
    canReview?: boolean;
    totalCourses?: number;
    totalReviewCount?: number;
    featuredTestimonial?: {
        quote: string;
        authorName: string;
        authorImage?: string;
    };
}

export function CourseDetailContent({
    courseData,
    hasAccess,
    totalLessons,
    totalModules,
    breadcrumbs,
    reviews,
    canReview,
    totalCourses,
    totalReviewCount,
    featuredTestimonial
}: CourseDetailContentProps) {
    return (
        <div className="bg-[#0B0F19] min-h-screen">
            {/* Hero — self-contained with internal max-width */}
            <CourseHero
                title={courseData.title}
                description={courseData.description || ""}
                shortDescription={courseData.shortDescription}
                rating={courseData.rating}
                totalRatings={courseData.totalRatings}
                instructor={courseData.instructor}
                image={courseData.videoThumbnail || courseData.imageUrl}
                level={courseData.level}
                students={courseData.students}
            />

            {/* Main content: two-column grid */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-4 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 relative">

                    {/* Left Column — Main Content */}
                    <div className="lg:col-span-7 xl:col-span-8">

                        {/* Featured Testimonial */}
                        {featuredTestimonial && (
                            <FeaturedTestimonial
                                quote={featuredTestimonial.quote}
                                authorName={featuredTestimonial.authorName}
                                authorImage={featuredTestimonial.authorImage}
                            />
                        )}

                        {/* Description blocks + Course Content */}
                        <section className="pt-4">
                            <CourseTabs
                                modules={courseData.modules}
                                totalLessons={totalLessons}
                                totalModules={totalModules}
                                duration={courseData.duration}
                                description={courseData.description}
                                learningOutcomes={courseData.learningOutcomes}
                            />
                        </section>

                        {/* Instructor */}
                        <section id="instructor" className="pt-14 md:pt-16">
                            <InstructorCard totalCourses={totalCourses} />
                        </section>

                        {/* FAQ */}
                        <section id="faq" className="pt-14 md:pt-16">
                            <CourseFAQ />
                        </section>

                        {/* Reviews */}
                        <section id="reviews" className="pt-14 md:pt-16">
                            <h2 className="text-xl font-black text-white font-headings mb-6">
                                Opiniones de Estudiantes
                                <span className="ml-2 text-sm font-medium text-gray-600">({totalReviewCount ?? reviews?.length ?? 0})</span>
                            </h2>

                            {canReview && (
                                <div className="mb-6">
                                    <ReviewForm courseId={courseData.id} />
                                </div>
                            )}

                            <ReviewList reviews={reviews || []} />
                        </section>
                    </div>

                    {/* Right Column — Sticky Pricing Card */}
                    <div className="hidden lg:block lg:col-span-5 xl:col-span-4 relative">
                        <div className="sticky top-8 z-20">
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
            </div>

            {/* Testimonials Carousel — Full Width */}
            <div className="border-t border-white/[0.04] pb-20 lg:pb-0">
                <TestimonialsSection />
            </div>

            {/* Mobile Sticky CTA */}
            <MobileCourseCTA
                title={courseData.title}
                price={courseData.price}
                originalPrice={courseData.originalPrice}
                courseId={courseData.id}
                hasAccess={hasAccess}
                rawPrice={courseData.rawPrice}
            />
        </div>
    );
}
