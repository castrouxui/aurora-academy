import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = params;

        const usages = await prisma.purchase.findMany({
            where: {
                couponId: id,
                status: "approved"
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(usages);
    } catch (error) {
        console.error("[COUPON_USAGE_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
