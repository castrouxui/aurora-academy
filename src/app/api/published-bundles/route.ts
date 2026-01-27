import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const bundles = await prisma.bundle.findMany({
            where: { published: true },
            include: {
                courses: { select: { title: true } },
                items: { select: { name: true } }
            }
        });
        return NextResponse.json(bundles);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching bundles" }, { status: 500 });
    }
}
