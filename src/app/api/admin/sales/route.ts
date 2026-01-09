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
        const sales = await prisma.purchase.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, email: true } },
                course: { select: { title: true } }
            }
        });

        return NextResponse.json(sales);
    } catch (error) {
        console.error("[SALES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
