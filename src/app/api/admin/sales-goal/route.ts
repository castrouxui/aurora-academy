import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.role || (session.user.role !== "ADMIN" && session.user.role !== "INSTRUCTOR")) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        let goal = await prisma.salesGoal.findFirst();

        if (!goal) {
            // Create default if not exists
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);

            // Default start date to beginning of current month
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            goal = await prisma.salesGoal.create({
                data: {
                    targetAmount: 5000000,
                    deadline: nextMonth,
                    startDate: startOfMonth,
                }
            });
        }

        // Calculate progress with deduplication logic (matching frontend)
        const rawSales = await prisma.purchase.findMany({
            where: {
                status: 'approved',
                createdAt: {
                    gte: goal.startDate,
                    lte: goal.deadline
                }
            },
            include: {
                user: { select: { email: true } },
                course: { select: { title: true } },
                bundle: { select: { title: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        const uniqueSales: typeof rawSales = [];

        rawSales.forEach(sale => {
            // HARDCODE FIX: Correct amount for pablosonez@gmail.com
            // This mirrors the logic in /api/admin/sales/route.ts
            if (sale.user.email === 'pablosonez@gmail.com' && Number(sale.amount) === 200000) {
                // @ts-ignore
                sale.amount = 150000;
            }

            const itemId = sale.course?.title || sale.bundle?.title || "unknown";
            const key = `${sale.user.email}-${itemId}-${sale.amount}`;

            const isDuplicate = uniqueSales.some(existing => {
                const existingItemId = existing.course?.title || existing.bundle?.title || "unknown";
                const existingKey = `${existing.user.email}-${existingItemId}-${existing.amount}`;

                if (existingKey !== key) return false;

                const timeDiff = Math.abs(new Date(existing.createdAt).getTime() - new Date(sale.createdAt).getTime());
                return timeDiff < 60000; // 1 minute window
            });

            if (!isDuplicate) {
                uniqueSales.push(sale);
            }
        });

        const currentAmount = uniqueSales.reduce((acc, sale) => acc + Number(sale.amount), 0);

        return NextResponse.json({ ...goal, currentAmount });
    } catch (error) {
        console.error("[SALES_GOAL_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.role || (session.user.role !== "ADMIN" && session.user.role !== "INSTRUCTOR")) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { targetAmount, deadline, startDate } = body;

        const goal = await prisma.salesGoal.findFirst();

        const dataToUpdate: any = {
            targetAmount: targetAmount,
            deadline: new Date(deadline)
        };

        if (startDate) {
            dataToUpdate.startDate = new Date(startDate);
        }

        if (goal) {
            await prisma.salesGoal.update({
                where: { id: goal.id },
                data: dataToUpdate
            });
        } else {
            await prisma.salesGoal.create({
                data: { ...dataToUpdate, startDate: startDate ? new Date(startDate) : new Date() }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[SALES_GOAL_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
