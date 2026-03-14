import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CourseDetailContent } from "@/components/cursos/CourseDetailContent";
import { getYouTubeId, formatCourseDuration } from "@/lib/utils";
import { getCourseImage } from "@/lib/course-constants";
import { getMockCourseReviews } from "@/lib/course-reviews";

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
        // 1. Direct course purchase
        const directPurchase = await prisma.purchase.findFirst({
            where: {
                userId: session.user.id,
                courseId: course.id,
                status: { in: ['approved', 'COMPLETED'] }
            }
        });

        if (directPurchase) {
            hasAccess = true;
        } else {
            // 2. Bundle purchase containing this course
            const bundlePurchase = await prisma.purchase.findFirst({
                where: {
                    userId: session.user.id,
                    status: { in: ['approved', 'COMPLETED'] },
                    bundle: {
                        courses: {
                            some: { id: course.id }
                        }
                    }
                }
            });

            if (bundlePurchase) {
                hasAccess = true;
            } else {
                // 3. Active subscription to a bundle containing this course
                const activeSubscription = await prisma.subscription.findFirst({
                    where: {
                        userId: session.user.id,
                        status: { in: ['authorized', 'active', 'ACTIVE', 'AUTHORIZED'] },
                        bundle: {
                            courses: {
                                some: { id: course.id }
                            }
                        }
                    }
                });

                if (activeSubscription) {
                    hasAccess = true;
                }
            }
        }
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

    // Generate consistent mock reviews for this specific course
    const { mockTotalRatings, mockAverageRating, mockReviews } = getMockCourseReviews(id);

    // Combine generated reviews with any real reviews from the DB
    const reviews = [...mockReviews, ...dbReviews];

    // Total ratings is the dynamic mock + any real db reviews
    let totalRatings = mockTotalRatings + dbReviews.length;

    // Calculate average including real DB reviews if any
    let averageRating = mockAverageRating;
    if (dbReviews.length > 0) {
        const dbTotalScore = dbReviews.reduce((acc, rev) => acc + rev.rating, 0);
        const totalScore = (mockAverageRating * mockTotalRatings) + dbTotalScore;
        averageRating = totalScore / totalRatings;
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
    const featuredSource = mockReviews.length > 0
        ? mockReviews[0]
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
