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

        const { lessonId, completed } = await req.json();

        if (!lessonId) {
            return new NextResponse("Missing lessonId", { status: 400 });
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
                completed: completed
            },
            create: {
                userId: session.user.id,
                lessonId: lessonId,
                completed: completed
            }
        });

        return NextResponse.json(progress);
    } catch (error) {
        console.error("[PROGRESS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
