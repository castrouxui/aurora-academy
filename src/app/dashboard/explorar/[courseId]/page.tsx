import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CourseDetailContent } from "@/components/cursos/CourseDetailContent";
import { getYouTubeId, formatCourseDuration } from "@/lib/utils";
import { getCourseImage } from "@/lib/course-constants";

export default async function DashboardCourseDatailPage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    const id = courseId; // Alias for easier copy-paste logic
    const session = await getServerSession(authOptions);

    // FIX: Order to consistent module output
    const course = await prisma.course.findUnique({
        where: { id },
        include: {
            modules: {
                orderBy: { position: 'asc' },
                include: {
                    lessons: {
                        orderBy: { position: 'asc' }
                    }
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

    // Calculate total duration
    const totalDurationSeconds = course.modules.reduce((acc, module) => {
        return acc + module.lessons.reduce((lAcc, lesson) => lAcc + (lesson.duration || 0), 0);
    }, 0);

    // Format duration using centralized utility
    const formattedDuration = formatCourseDuration(totalDurationSeconds);

    // Get student count (real)
    const studentCount = await prisma.purchase.count({
        where: { courseId: id, status: 'approved' }
    });

    // Format price
    const basePrice = Number(course.price) || 0;
    const discount = course.discount || 0;
    const finalPrice = basePrice * (1 - discount / 100);

    const formattedPrice = finalPrice === 0
        ? "GRATIS"
        : new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0
        }).format(finalPrice);

    // Get first lesson video for preview
    const firstModule = course.modules[0];
    const firstLesson = firstModule?.lessons[0];
    const previewVideoUrl = firstLesson?.videoUrl || "/hero-video.mp4";

    // Calculate display image
    const youtubeId = previewVideoUrl ? getYouTubeId(previewVideoUrl) : null;
    let displayImage = getCourseImage(course);

    if (displayImage === "/course-placeholder.jpg" && youtubeId) {
        displayImage = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    }

    // Fetch Reviews
    const dbReviews = await prisma.review.findMany({
        where: { courseId: id },
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { name: true, image: true } }
        }
    });

    // Hardcoded marketing logic (Requested to be KEPT)
    const HARDCODED_COURSE_ID = "cml05hq7n00025z0eogogsnge";
    const hardcodedReviews = id === HARDCODED_COURSE_ID ? [
        {
            id: "fake-review-1",
            rating: 5,
            comment: "Gracias Fran, crack total. Yo venía de ver videos random en YouTube sin entender nada y acá en unas horas ya tenía todo claro. Ya abrí mi cuenta en el broker.",
            createdAt: new Date("2026-02-10T14:30:00Z"),
            userId: "fake-user-1",
            courseId: HARDCODED_COURSE_ID,
            user: { name: "Facundo Giménez", image: null }
        },
        {
            id: "fake-review-2",
            rating: 5,
            comment: "Un amigo me lo recomendó y enserio no me arrepiento. Fran no te vende humo, te habla con ejemplos de la vida real y eso se valora. Ya voy por el segundo curso de la plataforma.",
            createdAt: new Date("2026-02-05T09:15:00Z"),
            userId: "fake-user-2",
            courseId: HARDCODED_COURSE_ID,
            user: { name: "Martín Aguirre", image: null }
        },
        {
            id: "fake-review-3",
            rating: 4,
            comment: "Le pongo 4 porque me quedé con ganas de que profundice más en análisis técnico, pero entiendo que eso va en otro curso. Igualmente para ser gratuito la calidad es una locura, Fran explica sin tecnicismos y se entiende todo.",
            createdAt: new Date("2026-01-28T18:45:00Z"),
            userId: "fake-user-3",
            courseId: HARDCODED_COURSE_ID,
            user: { name: "Santiago Pereyra", image: null }
        },
        {
            id: "fake-review-4",
            rating: 4,
            comment: "Justo lo que necesitaba para dejar de tener la plata parada en el banco. Videos cortitos, los veía en el bondi. Lo único que le agregaría son ejercicios prácticos pero fuera de eso joya.",
            createdAt: new Date("2026-01-20T11:00:00Z"),
            userId: "fake-user-4",
            courseId: HARDCODED_COURSE_ID,
            user: { name: "Nicolás Herrera", image: null }
        }
    ] : [];

    const reviews = [...hardcodedReviews, ...dbReviews];

    // Override rating
    let totalRatings: number;
    let averageRating: number;

    if (id === HARDCODED_COURSE_ID) {
        averageRating = 4.5;
        totalRatings = 35;
    } else {
        totalRatings = dbReviews.length;
        averageRating = totalRatings > 0
            ? dbReviews.reduce((acc, rev) => acc + rev.rating, 0) / totalRatings
            : 5.0;
    }

    const userReview = session?.user?.id ? dbReviews.find(r => r.userId === session.user.id) : null;

    // Check Completion
    let isCompleted = false;
    if (session?.user?.id && hasAccess) {
        const allLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
        const completedCount = await prisma.userProgress.count({
            where: {
                userId: session.user.id,
                lessonId: { in: allLessonIds },
                completed: true
            }
        });
        isCompleted = allLessonIds.length > 0 && completedCount === allLessonIds.length;
    }

    const canReview = hasAccess && isCompleted && !userReview;

    // Build featured testimonial
    const RESULT_KEYWORDS = ["broker", "cuenta", "segundo curso", "abrí", "inscrib"];
    const featuredSource = hardcodedReviews.length > 0
        ? hardcodedReviews[0]
        : reviews.find(r => r.comment && RESULT_KEYWORDS.some(k => r.comment!.toLowerCase().includes(k)));

    const featuredTestimonial = featuredSource && featuredSource.comment
        ? {
            quote: featuredSource.comment,
            authorName: featuredSource.user.name || "Estudiante",
            authorImage: featuredSource.user.image || undefined,
        }
        : undefined;

    // Always show original price
    const formattedOriginalPrice = basePrice > 0
        ? new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(basePrice)
        : "";

    // Prepare data
    const courseData = {
        id: course.id,
        title: course.title,
        description: course.description,
        price: formattedPrice,
        imageUrl: displayImage,
        category: course.category,
        modules: course.modules,
        rating: totalRatings > 0 ? averageRating : 5.0,
        totalRatings: totalRatings,
        students: studentCount,
        lastUpdated: "01/2026",
        language: "Español",
        subtitles: "Español, Inglés",
        level: course.level || "Todos los niveles",
        duration: formattedDuration,
        originalPrice: formattedOriginalPrice,
        discount: discount > 0 ? `${discount}%` : "",
        instructor: {
            name: "Francisco Castro",
            image: "/images/francisco-speaking.png"
        },
        videoThumbnail: displayImage,
        videoUrl: youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : previewVideoUrl,
        learningOutcomes: course.learningOutcomes,
        shortDescription: course.shortDescription,
        rawPrice: finalPrice
    };

    const totalPublishedCourses = await prisma.course.count({
        where: { published: true }
    });

    return (
        <CourseDetailContent
            courseData={courseData}
            hasAccess={hasAccess}
            totalLessons={totalLessons}
            totalModules={totalModules}
            reviews={reviews}
            canReview={canReview}
            totalCourses={totalPublishedCourses}
            totalReviewCount={totalRatings}
            featuredTestimonial={featuredTestimonial}
        />
    );
}
