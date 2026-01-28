import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { telegram, inApp } = await req.json();

        const updatedUser = await (prisma.user as any).update({
            where: { id: session.user.id },
            data: {
                notificationPrefs: {
                    telegram: !!telegram,
                    inApp: !!inApp
                }
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("[NOTIF_PREFS_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
