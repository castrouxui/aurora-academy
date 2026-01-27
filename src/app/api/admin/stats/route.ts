import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

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
                where: { role: 'ESTUDIANTE' }
            }),
            // Courses Count
            prisma.course.count({
                where: { published: true }
            }),
            // Recent Sales
            prisma.purchase.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                where: { status: 'approved' },
                include: {
                    user: { select: { name: true, email: true, image: true } },
                    course: { select: { title: true } },
                    bundle: { select: { title: true } }
                }
            }),
            // Recent Students
            prisma.user.findMany({
                where: { role: 'ESTUDIANTE' },
                take: 5,
                orderBy: { id: 'desc' }, // or createdAt if available
                select: { name: true, email: true, image: true }
            })
        ]);

        console.log("Admin Stats Debug:", {
            revenue: totalRevenue._sum.amount,
            salesCount: recentSales.length,
            firstSale: recentSales[0]
        });

        // Deduplicate sales (e.g. from manual double-clicks)
        const uniqueSales = recentSales.filter((sale, index, self) =>
            index === self.findIndex((t) => (
                t.user.email === sale.user.email &&
                t.course?.title === sale.course?.title &&
                t.bundle?.title === sale.bundle?.title
            ))
        );

        return NextResponse.json({
            revenue: Number(totalRevenue._sum.amount) || 0,
            activeStudents: usersCount,
            publishedCourses: coursesCount,
            recentSales: uniqueSales,
            recentStudents
        });
    } catch (error) {
        console.error("[ADMIN_STATS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
