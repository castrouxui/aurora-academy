
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const logId = searchParams.get("id");
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (logId) {
        try {
            await prisma.emailLog.update({
                where: { id: logId },
                data: { clickedAt: new Date() },
            });
        } catch (e) {
            console.error("Failed to track click:", e);
        }
    }

    return NextResponse.redirect(url);
}
