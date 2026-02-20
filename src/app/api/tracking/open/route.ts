
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const logId = searchParams.get("id");

    if (logId) {
        // Trigger generic update without blocking response time heavily
        // We use waitUntil if available or just don't await (fire and forget pattern risk in serverless)
        // But for safety in standard Next.js, we just await it quickly.
        try {
            await prisma.emailLog.update({
                where: { id: logId },
                data: { openedAt: new Date() },
            });
        } catch (e) {
            console.error("Failed to track open:", e);
        }
    }

    // Return 1x1 transparent GIF
    const pixel = Buffer.from(
        "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        "base64"
    );

    return new NextResponse(pixel, {
        headers: {
            "Content-Type": "image/gif",
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
        },
    });
}
