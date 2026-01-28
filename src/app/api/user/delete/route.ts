import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function DELETE() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // CRITICAL: Prevent Admin Deletion
        if (session.user.role === 'ADMIN') {
            return NextResponse.json(
                { error: "Admin accounts cannot be deleted via this endpoint." },
                { status: 403 }
            );
        }

        // Delete the user
        // Prisma cascade delete should handle related records (Purchases, Progress, etc.)
        // IF schema is configured correctly. If not, we might need to delete related first.
        // Assuming Standard Cascade or minimal relations for now.

        await prisma.user.delete({
            where: { id: session.user.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting account:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
