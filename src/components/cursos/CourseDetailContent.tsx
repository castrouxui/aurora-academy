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

            {/* HERO BG WRAPPER */}
            <div className="relative w-full">
                {/* Background Image - Increased opacity for better visibility per feedback */}
                <div className="absolute inset-0 h-[850px] z-0 overflow-hidden">
                    <img
                        src={courseData.videoThumbnail || courseData.imageUrl}
                        alt=""
                        className="w-full h-full object-cover opacity-50 select-none"
                    />
                    {/* Gradient overlay - Slightly reduced top opacity to let image show through more */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19]/40 via-[#0B0F19]/90 to-[#0B0F19]" />
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0B0F19] to-transparent" />
                </div>

                {/* Main Content Grid */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 lg:pt-40">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-7 xl:col-span-8 space-y-24 md:space-y-32 pb-24">

                            {/* 1. Hero Text Content */}
                            <CourseHero
                                title={courseData.title}
                                description={courseData.description || ""}
                                shortDescription={courseData.shortDescription}
                                rating={courseData.rating}
                                totalRatings={courseData.totalRatings}
                                instructor={courseData.instructor}
                                level={courseData.level}
                                students={courseData.students}
                            />

                            {/* 2. Featured Testimonial */}
                            {featuredTestimonial && (
                                <section>
                                    <FeaturedTestimonial
                                        quote={featuredTestimonial.quote}
                                        authorName={featuredTestimonial.authorName}
                                        authorImage={featuredTestimonial.authorImage}
                                    />
                                </section>
                            )}

                            {/* 3. Description & Curriculum */}
                            <section>
                                <CourseTabs
                                    modules={courseData.modules}
                                    totalLessons={totalLessons}
                                    totalModules={totalModules}
                                    duration={courseData.duration}
                                    description={courseData.description}
                                    learningOutcomes={courseData.learningOutcomes}
                                    title={courseData.title}
                                />
                            </section>

                            {/* 4. Instructor */}
                            <section id="instructor">
                                <InstructorCard totalCourses={totalCourses} />
                            </section>

                            {/* 5. FAQ (Moved before reviews per feedback) */}
                            <section id="faq">
                                <CourseFAQ />
                            </section>

                            {/* 6. Reviews */}
                            <section id="reviews">
                                <div className="flex items-center justify-between mb-10">
                                    <h2 className="text-3xl font-black text-white font-headings tracking-tight">
                                        Opiniones de Estudiantes
                                        <span className="ml-3 text-lg font-medium text-gray-500">({totalReviewCount ?? reviews?.length ?? 0})</span>
                                    </h2>
                                </div>

                                {canReview && (
                                    <div className="mb-8">
                                        <ReviewForm courseId={courseData.id} />
                                    </div>
                                )}

                                <ReviewList reviews={reviews || []} />
                            </section>
                        </div>

                        {/* RIGHT COLUMN: Sticky Pricing Card */}
                        <div className="hidden lg:block lg:col-span-5 xl:col-span-4 relative">
                            <div className="sticky top-[80px]">
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
            </div>

            {/* Testimonials Carousel (Footer) */}
            <div className="border-t border-white/[0.04] pt-24 pb-32">
                {/* <TestimonialsSection /> */}
            </div>

            {/* Mobile Sticky CTA - Increased Z-index */}
            <div className="lg:hidden relative z-[100]">
                <MobileCourseCTA
                    title={courseData.title}
                    price={courseData.price}
                    originalPrice={courseData.originalPrice}
                    courseId={courseData.id}
                    hasAccess={hasAccess}
                    rawPrice={courseData.rawPrice}
                />
            </div>
        </div>
    );
}
