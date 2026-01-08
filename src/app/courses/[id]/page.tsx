import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/layout/Container";
import { CourseHero } from "@/components/courses/detail/CourseHero";
import { CourseSidebar } from "@/components/courses/detail/CourseSidebar";
import { CourseTabs } from "@/components/courses/detail/CourseTabs";

// This would normally come from an API/Database based on the ID
const mockCourseData = {
    title: "Trading Profesional: De Cero a Rentable",
    description: "Domina los mercados financieros con el curso más completo en español. Aprende análisis técnico, gestión de riesgo y psicotrading.",
    rating: 4.8,
    totalRatings: 1245,
    students: 38929,
    lastUpdated: "12/2025",
    language: "Español",
    subtitles: "Inglés, Español",
    level: "Principiante e Intermedio",
    duration: "15 horas",
    price: "$40.000",
    originalPrice: "$85.000",
    discount: "53%",
    instructor: {
        name: "Francisco Castro",
        image: "/francisco-speaking.png"
    },
    videoThumbnail: "/course-1.jpg" // Using static image for now
};

export default function CourseDetailPage({ params }: { params: { id: string } }) {
    return (
        <main className="min-h-screen bg-[#0B0F19]">
            <Navbar />

            {/* Dark Header Background Layer to support the design where sidebar overlaps hero */}
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-[#1F2937] z-0"></div>

            <div className="relative z-10">
                <Container className="pt-32 pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content Column */}
                        <div className="lg:col-span-2 space-y-8">
                            <CourseHero {...mockCourseData} />
                            <CourseTabs />
                        </div>

                        {/* Sidebar Column */}
                        <div className="relative">
                            <div className="sticky top-24 z-20">
                                <CourseSidebar
                                    title={mockCourseData.title}
                                    price={mockCourseData.price}
                                    originalPrice={mockCourseData.originalPrice}
                                    discount={mockCourseData.discount}
                                    duration={mockCourseData.duration}
                                    level={mockCourseData.level}
                                    students={mockCourseData.students}
                                    language={mockCourseData.language}
                                    subtitles={mockCourseData.subtitles}
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </main>
    );
}
