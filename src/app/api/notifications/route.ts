import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const notifications = await (prisma as any).notification.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 20
        });

        return NextResponse.json(notifications);
    } catch (error) {
        console.error("[NOTIFICATIONS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { id, read } = await req.json();

        if (id) {
            // Mark specific as read/unread
            const notification = await (prisma as any).notification.update({
                where: { id, userId: session.user.id },
                data: { read }
            });
            return NextResponse.json(notification);
        } else {
            // Mark all as read
            await (prisma as any).notification.updateMany({
                where: { userId: session.user.id, read: false },
                data: { read: true }
            });
            return NextResponse.json({ success: true });
        }
    } catch (error) {
        console.error("[NOTIFICATIONS_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { id } = await req.json();

        if (id) {
            await (prisma as any).notification.delete({
                where: { id, userId: session.user.id }
            });
        } else {
            await (prisma as any).notification.deleteMany({
                where: { userId: session.user.id }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[NOTIFICATIONS_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
