import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkAndgrantCourseReward } from "@/lib/rewards";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { lessonId, completed, seconds, totalDuration } = await req.json();

        if (!lessonId) {
            return new NextResponse("Missing lessonId", { status: 400 });
        }

        // Logic: Mark as completed if user manually sets it OR if watched > 90%
        let isCompleted = completed;
        if (seconds && totalDuration && totalDuration > 0) {
            const progressPercentage = seconds / totalDuration;
            if (progressPercentage >= 0.9) {
                isCompleted = true;
            }
        }

        // Upsert progress: create if not exists, update if exists
        const progress = await prisma.userProgress.upsert({
            where: {
                userId_lessonId: {
                    userId: session.user.id,
                    lessonId: lessonId
                }
            },
            update: {
                completed: isCompleted,
                lastPlayedTime: seconds || 0
            },
            create: {
                userId: session.user.id,
                lessonId: lessonId,
                completed: isCompleted || false,
                lastPlayedTime: seconds || 0
            }
        });



        // Check for Reward Trigger
        // We need the courseId. Since lesson -> module -> course, we fetch it.
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { module: { select: { courseId: true } } }
        });

        let rewardGranted = false;
        if (lesson && lesson.module && isCompleted) {
            const rewardResult = await checkAndgrantCourseReward(session.user.id, lesson.module.courseId);
            rewardGranted = rewardResult.granted || false;
        }

        return NextResponse.json({ ...progress, rewardGranted });
    } catch (error) {
        console.error("[PROGRESS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
