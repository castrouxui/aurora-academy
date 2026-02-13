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

        // 1. Fetch existing progress first to allow smart updates
        const existingProgress = await prisma.userProgress.findUnique({
            where: {
                userId_lessonId: {
                    userId: session.user.id,
                    lessonId: lessonId
                }
            }
        });

        // Logic: Mark as completed if user manually sets it OR if watched > 90%
        let isCompleted = completed;

        // Handling Playback Updates (seconds provided)
        if (seconds !== undefined && seconds !== null) {
            // Calculate percentage if duration is valid
            if (totalDuration && totalDuration > 0) {
                const progressPercentage = seconds / totalDuration;
                if (progressPercentage >= 0.9) {
                    isCompleted = true;
                }
            }

            // CRITICAL FIX: If already completed, DO NOT un-complete it just because we are scrubbing/watching again
            // Only allow un-completion via manual toggle (where seconds is undefined/null usually)
            if (existingProgress?.completed) {
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
                // Only update time if provided, otherwise keep existing
                lastPlayedTime: seconds !== undefined && seconds !== null ? seconds : (existingProgress?.lastPlayedTime ?? 0)
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
