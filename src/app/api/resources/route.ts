import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const userRole = session?.user?.role;

        if (!session || (userRole !== "ADMIN" && userRole !== "INSTRUCTOR")) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { title, url, type, lessonId } = await req.json();

        if (!title || !url || !lessonId) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const resource = await prisma.resource.create({
            data: {
                title,
                url,
                type: type || "PDF",
                lessonId
            }
        });

        return NextResponse.json(resource);
    } catch (error) {
        console.error("[RESOURCES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
