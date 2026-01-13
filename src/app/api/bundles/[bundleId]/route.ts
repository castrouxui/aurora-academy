import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ bundleId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const userRole = session?.user?.role;
        const { bundleId } = await params;

        if (!session || userRole !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { title, description, price, imageUrl, published, courseIds } = await req.json();

        // Prepare update data
        const updateData: any = {
            title,
            description,
            price: price ? parseFloat(price) : undefined,
            imageUrl,
            published
        };

        // If courseIds is provided, update the relations
        if (courseIds) {
            updateData.courses = {
                set: courseIds.map((id: string) => ({ id })) // "set" replaces all existing relations with the new list
            };
        }

        const bundle = await prisma.bundle.update({
            where: { id: bundleId },
            data: updateData,
            include: {
                courses: true
            }
        });

        return NextResponse.json(bundle);
    } catch (error) {
        console.error("[BUNDLE_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ bundleId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const userRole = session?.user?.role;
        const { bundleId } = await params;

        if (!session || userRole !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const bundle = await prisma.bundle.delete({
            where: { id: bundleId }
        });

        return NextResponse.json(bundle);
    } catch (error) {
        console.error("[BUNDLE_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ bundleId: string }> }
) {
    try {
        const { bundleId } = await params;
        const bundle = await prisma.bundle.findUnique({
            where: { id: bundleId },
            include: {
                courses: true
            }
        });

        if (!bundle) {
            return new NextResponse("Bundle not found", { status: 404 });
        }

        return NextResponse.json(bundle);
    } catch (error) {
        console.error("[BUNDLE_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
