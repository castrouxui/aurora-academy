import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const purchases = await prisma.purchase.findMany({
            where: {
                userId: session.user.id,
                status: 'approved'
            },
            include: {
                course: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Transform to match the UI expectations
        const enrolledCourses = purchases.map(purchase => ({
            id: purchase.course.id,
            title: purchase.course.title,
            description: purchase.course.description,
            imageUrl: purchase.course.imageUrl,
            progress: 0, // Placeholder, will implement Lesson tracking later
            totalLessons: 0, // Need to count lessons
            completedLessons: 0,
            lastAccessed: purchase.updatedAt.toLocaleDateString()
        }));

        return NextResponse.json(enrolledCourses);
    } catch (error) {
        console.error("[MY_COURSES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
