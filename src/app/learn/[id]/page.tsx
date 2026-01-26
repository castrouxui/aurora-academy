import { prisma } from "@/lib/prisma";
import { cn, getYouTubeId, formatDuration } from '@/lib/utils';
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { CoursePlayerClient } from "./CoursePlayerClient";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function CoursePlayerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // 1. Fetch Course Data
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

    const progressMap = new Map(userProgress.map((p: any) => [p.lessonId, p]));

    // Transform for client component
    // We map generic lesson fields to our frontend interface
    const clientCourse = {
        id: course.id,
        title: course.title,
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
                videoUrl: lesson.videoUrl || ""
            }))
        }))
    };

    // 4. Determine Back Link
    const userRole = session?.user?.role;
    const backLink = (userRole === "ADMIN" || userRole === "INSTRUCTOR")
        ? "/admin/courses"
        : "/dashboard/cursos";

    return (
        <CoursePlayerClient
            course={clientCourse}
            isAccess={isAccess}
            studentName={session?.user?.name || "Invitado"}
            backLink={backLink}
        />
    );
}
