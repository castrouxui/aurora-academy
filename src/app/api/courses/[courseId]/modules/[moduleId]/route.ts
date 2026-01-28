
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ courseId: string; moduleId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { courseId, moduleId } = await params;

        if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "INSTRUCTOR")) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse = await prisma.course.findUnique({
            where: {
                id: courseId,
            }
        });

        if (!ownCourse) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const module = await prisma.module.delete({
            where: {
                id: moduleId,
                courseId: courseId,
            }
        });

        return NextResponse.json(module);

    } catch (error) {
        console.error("[MODULE_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
