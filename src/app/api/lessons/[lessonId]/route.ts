import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(
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
        const values = await req.json();

        const lesson = await prisma.lesson.update({
            where: { id: lessonId },
            data: {
                ...values,
            }
        });

        return NextResponse.json(lesson);
    } catch (error) {
        console.error("[LESSON_PATCH]", error);
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

        await prisma.lesson.delete({
            where: { id: lessonId }
        });

        return new NextResponse(null, { status: 200 });
    } catch (error) {
        console.error("[LESSON_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
