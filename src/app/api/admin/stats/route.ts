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
        // We need to fetch ALL approved sales to calculate the "True Visual Revenue"
        // filtering out the "double clicks" (same user/item/amount < 1 min)

        const [
            allSales,
            usersCount,
            coursesCount,
            recentStudents
        ] = await Promise.all([
            // All Sales for Revenue Calculation
            prisma.purchase.findMany({
                where: { status: 'approved' },
                orderBy: { createdAt: 'desc' }, // Latest first
                include: {
                    user: { select: { email: true, name: true, image: true } }, // Minimal user data
                    course: { select: { title: true } },
                    bundle: { select: { title: true } }
                }
            }),
            // Users Count
            prisma.user.count({
                where: { role: 'ESTUDIANTE' }
            }),
            // Courses Count
            prisma.course.count({
                where: { published: true }
            }),
            // Recent Students
            prisma.user.findMany({
                where: { role: 'ESTUDIANTE' },
                take: 5,
                orderBy: { id: 'desc' },
                select: { name: true, email: true, image: true }
            })
        ]);

        // --- DEDUPLICATION LOGIC (Same as Sales Page) ---
        const uniqueSales: any[] = [];
        // We iterate through all sales. Since they are ordered DESC (newest first),
        // we keep the newest one and skip older duplicates that are within 60s.
        // Wait, normally "double click" produces two records instantly.
        // If we keep the first one encountered (newest), we skip the next one if it matches.

        let revenue = 0;

        for (const sale of allSales) {
            const itemId = sale.course?.title || sale.bundle?.title || "unknown";
            const key = `${sale.user.email}-${itemId}-${sale.amount}`;

            // Check if we already have this key in our unique list "recently"
            // Since we are iterating a flat list, we just check if any existing unique sale matches
            // AND is within 60s. 
            // NOTE: iterating the whole unique array for every item is O(N^2), might be slow for 10k+ items.
            // Optimization: The duplicates are likely adjacent or very close since we sort by createdAt.
            // So checking the last few added items might be enough? 
            // But 'uniqueSales' will be built in reverse order of time (Newest...Oldest).
            // A duplicate would be slightly older than the one we just added.

            const isDuplicate = uniqueSales.some(existing => {
                const existingKey = `${existing.user.email}-${existing.course?.title || existing.bundle?.title || "unknown"}-${existing.amount}`;
                if (existingKey !== key) return false;

                const timeDiff = Math.abs(new Date(existing.createdAt).getTime() - new Date(sale.createdAt).getTime());
                return timeDiff < 60000;
            });

            if (!isDuplicate) {
                uniqueSales.push(sale);
                revenue += Number(sale.amount);
            }
        }

        return NextResponse.json({
            revenue: revenue,
            activeStudents: usersCount,
            publishedCourses: coursesCount,
            recentSales: uniqueSales.slice(0, 5), // Return only top 5 unique for the widget
            recentStudents
        });

    } catch (error) {
        console.error("[ADMIN_STATS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
