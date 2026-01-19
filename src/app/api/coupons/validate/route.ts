import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { code } = await req.json();

        if (!code) {
            return new NextResponse("Code required", { status: 400 });
        }

        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!coupon) {
            return new NextResponse("Cupón no válido", { status: 404 });
        }

        if (!coupon.active) {
            return new NextResponse("Cupón inactivo", { status: 400 });
        }

        if (coupon.limit && coupon.used >= coupon.limit) {
            return new NextResponse("Cupón agotado", { status: 400 });
        }

        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            return new NextResponse("Cupón expirado", { status: 400 });
        }

        return NextResponse.json(coupon);
    } catch (error) {
        console.error("[COUPON_VALIDATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
