import { prisma } from "@/lib/prisma";
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
                    courseId: id,
                    status: 'approved'
                }
            });
            if (purchase) {
                isAccess = true;
            }
        }
    }

    // 3. Fetch User Progress
    const userProgress = session?.user?.id ? await prisma.userProgress.findMany({
        where: {
            userId: session.user.id,
            completed: true
        },
        select: { lessonId: true }
    }) : [];

    const completedLessonIds = new Set(userProgress.map(p => p.lessonId));

    // Transform for client component
    // We map generic lesson fields to our frontend interface
    const clientCourse = {
        id: course.id,
        title: course.title,
        modules: course.modules.map(mod => ({
            id: mod.id,
            title: mod.title,
            lessons: mod.lessons.map(lesson => ({
                id: lesson.id,
                title: lesson.title,
                description: lesson.description || "",
                duration: lesson.duration
                    ? `${Math.floor(lesson.duration / 60)}:${Math.floor(lesson.duration % 60).toString().padStart(2, '0')}`
                    : "00:00",
                completed: completedLessonIds.has(lesson.id),
                type: "video" as const,
                current: false,
                videoUrl: lesson.videoUrl || ""
            }))
        }))
    };

    return (
        <CoursePlayerClient
            course={clientCourse}
            isAccess={isAccess}
            studentName={session?.user?.name || "Invitado"}
        />
    );
}
