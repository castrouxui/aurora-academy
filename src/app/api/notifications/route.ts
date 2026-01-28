
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Fetch recent sales (Purchases)
        const recentSales = await prisma.purchase.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, email: true } },
                course: { select: { title: true } },
                bundle: { select: { title: true } }
            }
        });

        // Map sales to Notification format
        const notifications = recentSales.map(sale => {
            const itemName = sale.course?.title || sale.bundle?.title || "Producto desconocido";
            const amount = Number(sale.amount).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

            // Heuristic for "read": if older than 24 hours, assume read.
            // Or just always false so they see the list? 
            // Better: Always read=true to avoid persistent badges, 
            // or use a cookie/localStorage on frontend. 
            // For now, let's mark recent (< 1 hour) as unread.
            const isRecent = (new Date().getTime() - new Date(sale.createdAt).getTime()) < 1000 * 60 * 60; // 1 hour

            return {
                id: sale.id,
                title: "Nueva Venta",
                content: `${sale.user.name || sale.user.email} compró ${itemName} por ${amount}`,
                read: !isRecent, // Only show badge for very recent sales
                type: "SALE",
                url: "/admin/sales",
                createdAt: sale.createdAt.toISOString()
            };
        });

        return NextResponse.json(notifications);

    } catch (error) {
        console.error("[NOTIFICATIONS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// Mark as read endpoint - Stub for now since we are generating them dynamically
export async function PATCH() {
    return NextResponse.json({ success: true });
}

// Delete endpoint - Stub
export async function DELETE() {
    return NextResponse.json({ success: true });
}
