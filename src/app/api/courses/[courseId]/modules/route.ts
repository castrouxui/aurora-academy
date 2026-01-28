import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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

        const { title } = await req.json();

        const lastModule = await prisma.module.findFirst({
            where: { courseId: courseId },
            orderBy: { position: "desc" },
        });

        const newPosition = lastModule ? lastModule.position + 1 : 1;

        const module = await prisma.module.create({
            data: {
                title,
                courseId: courseId,
                position: newPosition,
            },
        });

        return NextResponse.json(module);
    } catch (error) {
        console.error("[MODULES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
