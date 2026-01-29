import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    props: { params: Promise<{ lessonId: string }> }
) {
    try {
        const params = await props.params;
        const { lessonId } = params;

        const quiz = await prisma.quiz.findUnique({
            where: { lessonId },
        });

        return NextResponse.json(quiz || null);
    } catch (error) {
        console.error("[QUIZ_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(
    req: Request,
    props: { params: Promise<{ lessonId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const userRole = session?.user?.role;
        const params = await props.params;

        if (!session || (userRole !== "ADMIN" && userRole !== "INSTRUCTOR")) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { lessonId } = params;
        const { question, options, correctOption } = await req.json();

        // Validate
        if (!question || !options || options.length < 2 || correctOption === undefined) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const quiz = await prisma.quiz.upsert({
            where: { lessonId },
            create: {
                lessonId,
                question,
                options,
                correctOption,
            },
            update: {
                question,
                options,
                correctOption,
            },
        });

        return NextResponse.json(quiz);
    } catch (error) {
        console.error("[QUIZ_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    props: { params: Promise<{ lessonId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const userRole = session?.user?.role;
        const params = await props.params;

        if (!session || userRole !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { lessonId } = params;

        await prisma.quiz.delete({
            where: { lessonId },
        });

        return new NextResponse(null, { status: 200 });
    } catch (error) {
        console.error("[QUIZ_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
