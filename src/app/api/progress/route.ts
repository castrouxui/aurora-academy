import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

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

        return NextResponse.json(progress);
    } catch (error) {
        console.error("[PROGRESS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
