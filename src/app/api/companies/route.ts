import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const companies = await prisma.company.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: { users: true }
                }
            }
        });

        return NextResponse.json(companies);
    } catch (error) {
        console.error("[COMPANIES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { name, domain, maxSeats, bundleId, expiresAt } = body;

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        // Generate simple access code if not provided
        // Use regex to remove spaces/special chars from name and add random suffix
        const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 5);
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const accessCode = `${cleanName}-${randomSuffix}`;

        const company = await prisma.company.create({
            data: {
                name,
                domain: domain || null,
                maxSeats: parseInt(maxSeats) || 5, // Default 5
                accessCode: accessCode,
                bundleId: bundleId || null,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            }
        });

        return NextResponse.json(company);
    } catch (error) {
        console.error("[COMPANIES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return new NextResponse("ID required", { status: 400 });

        await prisma.company.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[COMPANIES_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
