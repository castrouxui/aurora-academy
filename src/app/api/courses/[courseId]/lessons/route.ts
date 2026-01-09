import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const userRole = session?.user?.role;
        const { courseId } = await params;

        if (!session || (userRole !== "ADMIN" && userRole !== "INSTRUCTOR")) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { title, videoUrl, description, moduleId } = await req.json();

        if (!title || !moduleId) {
            return new NextResponse("Missing title or module ID", { status: 400 });
        }

        const lastLesson = await prisma.lesson.findFirst({
            where: { moduleId: moduleId },
            orderBy: { position: "desc" },
        });

        const newPosition = lastLesson ? lastLesson.position + 1 : 1;

        const lesson = await prisma.lesson.create({
            data: {
                title,
                videoUrl,
                description,
                position: newPosition,
                moduleId: moduleId,
                published: true // Auto-publish for simplicity in MVP
            },
        });

        return NextResponse.json(lesson);
    } catch (error) {
        console.error("[LESSONS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
