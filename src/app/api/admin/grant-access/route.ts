
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
    try {
        // 1. Verify Admin Session
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { email, courseId, bundleId } = body;

        if (!email || (!courseId && !bundleId)) {
            return NextResponse.json({ error: "Email and either Course ID or Bundle ID are required" }, { status: 400 });
        }

        // 2. Find User
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({ error: "Usuario no encontrado con ese email" }, { status: 404 });
        }

        // 3. Resolve Title and Price (for record keeping)
        let amount = 0;
        let title = "Manual Grant";

        if (courseId) {
            const course = await prisma.course.findUnique({ where: { id: courseId } });
            if (course) {
                amount = Number(course.price);
                title = course.title;
            }
        } else if (bundleId) {
            const bundle = await prisma.bundle.findUnique({ where: { id: bundleId } });
            if (bundle) {
                amount = Number(bundle.price);
                title = bundle.title;
            }
        }

        // 3a. Idempotency Check: Does user already have access?
        const whereClause: any = {
            userId: user.id,
            status: 'approved'
        };
        if (courseId) whereClause.courseId = courseId;
        if (bundleId) whereClause.bundleId = bundleId;

        const existingPurchase = await prisma.purchase.findFirst({ where: whereClause });

        if (existingPurchase) {
            console.log(`[ADMIN] User ${email} already has access to ${courseId || bundleId}`);
            return NextResponse.json({
                success: true,
                message: `El usuario ya tenía acceso a este contenido via compra #${existingPurchase.id.slice(-6)}`,
                purchaseId: existingPurchase.id
            });
        }

        // 4. Create Purchase Record
        const newPurchase = await prisma.purchase.create({
            data: {
                userId: user.id,
                courseId: courseId,
                bundleId: bundleId,
                amount: amount,
                status: 'approved',
                paymentId: `manual_grant_${Date.now()}`,
                preferenceId: `manual_admin_${session.user?.email}`
            }
        });

        console.log(`[ADMIN] Manual access granted to ${email} for ${title} by ${session.user?.email}`);

        return NextResponse.json({
            success: true,
            message: `Acceso otorgado a ${user.name || email} para ${title}`,
            purchaseId: newPurchase.id
        });

    } catch (error) {
        console.error("[ADMIN_GRANT_ERROR]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
