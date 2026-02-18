import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendCourseWelcomeEmail } from "@/lib/email";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId } = await req.json();
        if (!courseId) {
            return new NextResponse("Course ID required", { status: 400 });
        }

        const course = await prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const isFree = Number(course.price) === 0 || ((course as any).discount && (course as any).discount === 100);

        if (!isFree) {
            return new NextResponse("Course is not free", { status: 403 });
        }

        // Check availability
        const existingPurchase = await prisma.purchase.findFirst({
            where: {
                userId: session.user.id,
                courseId: courseId,
                status: 'approved'
            }
        });

        if (existingPurchase) {
            return NextResponse.json({ success: true, message: "Already enrolled" });
        }

        // Enroll
        await prisma.purchase.create({
            data: {
                userId: session.user.id,
                courseId: courseId,
                amount: 0,
                status: 'approved',
            }
        });

        // Send Welcome Email if it's "El camino del inversor"
        // We can check by title or just send it for any free course if that's the intent, 
        // but the user specifically asked for "El camino del inversor" to match Lead Capture.
        if (course.title === "El camino del inversor") {
            await sendCourseWelcomeEmail(session.user.email!, session.user.name);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("[FREE_ENROLL]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
