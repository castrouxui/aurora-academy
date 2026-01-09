import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/layout/Container";
import { CourseHero } from "@/components/courses/detail/CourseHero";
import { CourseSidebar } from "@/components/courses/detail/CourseSidebar";
import { CourseTabs } from "@/components/courses/detail/CourseTabs";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const course = await prisma.course.findUnique({
        where: { id },
        include: {
            modules: {
                include: {
                    lessons: true
                }
            }
        }
    });

    if (!course) {
        notFound();
    }

    // Calculate metadata
    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const totalModules = course.modules.length;

    // Format price
    const formattedPrice = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0
    }).format(Number(course.price));

    // Prepare data for components
    const courseData = {
        id: course.id,
        title: course.title,
        description: course.description,
        price: formattedPrice,
        imageUrl: course.imageUrl || "/course-placeholder.jpg",
        category: course.category,
        modules: course.modules,
        // Mocked/Static Data for now
        rating: 5.0,
        totalRatings: 124,
        students: 15420,
        lastUpdated: "01/2026",
        language: "Español",
        subtitles: "Español, Inglés",
        level: "Todos los niveles",
        duration: "24 horas", // Placeholder as we don't track duration per lesson yet
        originalPrice: new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(Number(course.price) * 1.5),
        discount: "33%",
        instructor: {
            name: "Aurora Academy",
            image: "/logo.svg" // Fallback to logo
        },
        videoThumbnail: course.imageUrl || "/course-placeholder.jpg"
    };

    return (
        <main className="min-h-screen bg-[#0B0F19]">
            <Navbar />

            {/* Dark Header Background Layer */}
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-[#1F2937] z-0"></div>

            <div className="relative z-10">
                <Container className="pt-32 pb-12">
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
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </main>
    );
}
