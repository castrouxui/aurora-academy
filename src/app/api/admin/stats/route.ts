import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const [
            totalRevenue,
            usersCount,
            coursesCount,
            recentSales,
            recentStudents
        ] = await Promise.all([
            // Total Revenue
            prisma.purchase.aggregate({
                _sum: { amount: true },
                where: { status: 'approved' }
            }),
            // Users Count
            prisma.user.count({
                where: { role: 'STUDENT' }
            }),
            // Courses Count
            prisma.course.count({
                where: { published: true }
            }),
            // Recent Sales
            prisma.purchase.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { name: true, email: true, image: true } },
                    course: { select: { title: true } }
                }
            }),
            // Recent Students
            prisma.user.findMany({
                where: { role: 'STUDENT' },
                take: 5,
                orderBy: { id: 'desc' }, // or createdAt if available
                select: { name: true, email: true, image: true }
            })
        ]);

        return NextResponse.json({
            revenue: totalRevenue._sum.amount || 0,
            activeStudents: usersCount,
            publishedCourses: coursesCount,
            recentSales,
            recentStudents
        });
    } catch (error) {
        console.error("[ADMIN_STATS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
