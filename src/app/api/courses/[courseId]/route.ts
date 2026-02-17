import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
                            include: {
                                resources: true,
                                quiz: true,
                            }
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
                title: values.title,
                description: values.description,
                shortDescription: values.shortDescription,
                price: values.price,
                imageUrl: values.imageUrl,
                category: values.category,
                level: values.level,
                published: values.published,
                learningOutcomes: values.learningOutcomes,
                discount: values.discount,
                type: values.type, // Added type field
            },
        });

        // Force revalidation of the public course page
        try {
            const { revalidatePath } = await import("next/cache");
            revalidatePath(`/cursos/${courseId}`);
            revalidatePath(`/`); // Also revalidate home in case it's featured
        } catch (err) {
            console.error("Error revalidating path:", err);
        }

        return NextResponse.json(course);
    } catch (error) {
        console.error("[COURSE_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const userRole = session?.user?.role;
        const { courseId } = await params;

        if (!session || userRole !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Manual Cascade Delete using Transaction to ensure data integrity
        await prisma.$transaction(async (tx) => {
            // 1. Delete Purchases related to this course
            await tx.purchase.deleteMany({
                where: { courseId },
            });

            // 2. Find all modules to delete their lessons
            const modules = await tx.module.findMany({
                where: { courseId },
                select: { id: true }
            });

            // 3. Delete lessons for each module
            for (const module of modules) {
                await tx.lesson.deleteMany({
                    where: { moduleId: module.id }
                });
            }

            // 4. Delete modules
            await tx.module.deleteMany({
                where: { courseId }
            });

            // 5. Finally, delete the course
            await tx.course.delete({
                where: { id: courseId },
            });
        });

        return new NextResponse(null, { status: 200 });
    } catch (error) {
        console.error("[COURSE_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
