import { prisma } from "@/lib/prisma";
import { cn, getYouTubeId, formatDuration } from '@/lib/utils';
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { CoursePlayerClient } from "./CoursePlayerClient";
import { authOptions } from "@/lib/auth";

export default async function CoursePlayerPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const { id } = await params;
    const resolvedSearchParams = await searchParams;

    // ... (rest of logic) ...



    // 1. Fetch Course Data
    const course = await prisma.course.findUnique({
        where: { id },
        include: {
            modules: {
                orderBy: { position: 'asc' },
                include: {
                    lessons: {
                        orderBy: { position: 'asc' },
                        include: {
                            resources: true,
                        }
                    }
                }
            }
        }
    });

    if (!course) {
        notFound();
    }

    // 2. Check Access
    const session = await getServerSession(authOptions);
    let isAccess = false;

    if (session?.user?.id) {
        // Admin always has access
        if (session.user.role === "ADMIN" || session.user.role === "INSTRUCTOR") {
            isAccess = true;
        } else {
            // Check for approved purchase
            const purchase = await prisma.purchase.findFirst({
                where: {
                    userId: session.user.id,
                    status: 'approved',
                    OR: [
                        { courseId: id },
                        {
                            bundle: {
                                courses: {
                                    some: { id: id }
                                }
                            }
                        }
                    ]
                }
            });

            console.log(`[ACCESS_CHECK] User: ${session.user.id}, Course: ${id}, Role: ${session.user.role}, Purchase: ${purchase ? 'FOUND' : 'NOT FOUND'}`);

            if (purchase) {
                isAccess = true;
            }
        }
    }

    // 3. Fetch User Progress (All progress, not just completed)
    const userProgress = session?.user?.id ? await prisma.userProgress.findMany({
        where: {
            userId: session.user.id
        },
        select: {
            lessonId: true,
            completed: true,
            lastPlayedTime: true
        }
    }) : [];

    // 4. Fetch User Review
    const userReview = session?.user?.id ? await prisma.review.findFirst({
        where: {
            userId: session.user.id,
            courseId: id
        }
    }) : null;

    const progressMap = new Map(userProgress.map((p: any) => [p.lessonId, p]));

    // Transform for client component
    // We map generic lesson fields to our frontend interface
    const clientCourse = {
        id: course.id,
        title: course.title,
        description: course.description || undefined,
        modules: course.modules.map((mod: any) => ({
            id: mod.id,
            title: mod.title,
            lessons: mod.lessons.map((lesson: any) => ({
                id: lesson.id,
                title: lesson.title,
                description: lesson.description || "",
                duration: formatDuration(lesson.duration),
                completed: progressMap.get(lesson.id)?.completed || false,
                lastPlayedTime: progressMap.get(lesson.id)?.lastPlayedTime || 0,
                type: "video" as const,
                current: false,
                // SECURITY: Only send video URL and resources if user has access
                // SECURITY: Only send video URL and resources if user has access
                videoUrl: isAccess ? (lesson.videoUrl || "") : "",
                resources: isAccess ? (lesson.resources || []) : [],
            })) // Close lessons.map
        })) // Close modules.map
    }; // Close clientCourse object

    // 4. Determine Back Link
    const userRole = session?.user?.role;
    let backLink = "/dashboard/cursos";

    if (userRole === "ADMIN" || userRole === "INSTRUCTOR") {
        backLink = "/admin/courses";
    } else if (resolvedSearchParams?.from) {
        // Smart breadcrumb based on origin tab
        const fromTab = resolvedSearchParams.from as string;
        if (['not-started', 'in-progress', 'completed'].includes(fromTab)) {
            backLink = `/dashboard/cursos?tab=${fromTab}`;
        }
    }

    return (
        <CoursePlayerClient
            course={clientCourse}
            isAccess={isAccess}
            studentName={session?.user?.name || "Invitado"}
            backLink={backLink}
            hasReviewed={!!userReview}
        />
    );
}
