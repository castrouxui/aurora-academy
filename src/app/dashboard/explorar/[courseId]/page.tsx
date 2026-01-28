import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CourseDetailContent } from "@/components/cursos/CourseDetailContent";
import { getYouTubeId } from "@/lib/utils";

export default async function DashboardCourseDatailPage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    const session = await getServerSession(authOptions);

    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            modules: {
                include: {
                    lessons: true
                }
            }
        }
    });

    let hasAccess = false;
    if (session?.user?.id && course) {
        const purchase = await prisma.purchase.findFirst({
            where: {
                userId: session.user.id,
                courseId: course.id,
                status: 'approved'
            }
        });
        hasAccess = !!purchase;
    }

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

    // Get first lesson video for preview
    const firstModule = course.modules.sort((a, b) => a.position - b.position)[0];
    const firstLesson = firstModule?.lessons.sort((a, b) => a.position - b.position)[0];
    const previewVideoUrl = firstLesson?.videoUrl || "/hero-video.mp4";

    // Calculate display image (Priority: YouTube > Uploaded > Placeholder)
    const youtubeId = previewVideoUrl ? getYouTubeId(previewVideoUrl) : null;
    const displayImage = youtubeId
        ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
        : (course.imageUrl || "/course-placeholder.jpg");

    // Prepare data for components
    const courseData = {
        id: course.id,
        title: course.title,
        description: course.description,
        price: formattedPrice,
        imageUrl: displayImage, // Use calculated image for main cover too
        category: course.category,
        modules: course.modules,
        rating: 5.0,
        totalRatings: 124,
        students: 15420,
        lastUpdated: "01/2026",
        language: "Español",
        subtitles: "Español, Inglés",
        level: "Todos los niveles",
        duration: "24 horas",
        originalPrice: new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(Number(course.price) * 1.5),
        discount: "33%",
        instructor: {
            name: "Aurora Academy",
            image: "/logo.svg"
        },
        videoThumbnail: displayImage,
        videoUrl: previewVideoUrl
    };

    const breadcrumbs = [
        { label: "Explorar", href: "/dashboard/explore" },
        { label: course.title, href: `/dashboard/explore/${course.id}` }
    ];

    return (
        <CourseDetailContent
            courseData={courseData}
            hasAccess={hasAccess}
            totalLessons={totalLessons}
            totalModules={totalModules}
            breadcrumbs={breadcrumbs}
        />
    );
}
