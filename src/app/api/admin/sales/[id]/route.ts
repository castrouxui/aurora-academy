import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { amount } = await req.json();
        const { id } = await params;

        if (!amount || isNaN(Number(amount))) {
            return new NextResponse("Invalid amount", { status: 400 });
        }

        const updatedPurchase = await prisma.purchase.update({
            where: { id },
            data: { amount: Number(amount) }
        });

        console.log(`[ADMIN] User ${session.user.email} updated purchase ${id} amount to ${amount}`);

        return NextResponse.json(updatedPurchase);
    } catch (error) {
        console.error("[ADMIN_UPDATE_SALE_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
