import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { courseId } = await params;
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                modules: {
                    orderBy: {
                        position: "asc",
                    },
                    include: {
                        lessons: {
                            orderBy: {
                                position: "asc",
                            },
                        },
                    },
                },
            },
        });

        if (!course) {
            return new NextResponse("Not Found", { status: 404 });
        }

        return NextResponse.json(course);
    } catch (error) {
        console.error("[COURSE_ID_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
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

        const values = await req.json();

        const course = await prisma.course.update({
            where: { id: courseId },
            data: {
                ...values,
            },
        });

        return NextResponse.json(course);
    } catch (error) {
        console.error("[COURSE_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
