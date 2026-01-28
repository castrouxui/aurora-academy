import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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

        const { title, description, price, imageUrl, published, courseIds, items } = await req.json();

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

        // Handle Membership Items
        if (items) {
            // Because managing update/create/delete is complex, we will delete all and recreate for now 
            // (assuming low volume of items per bundle).
            // A transaction would be better, but this simple approach works for MVP.

            // First operation: Update bundle scalar fields
            // Second operation: Delete existing items
            // Third operation: Create new items

            // To do this cleanly with Prisma's nested writes:
            updateData.items = {
                deleteMany: {},
                create: items.map((item: any) => ({
                    name: item.name,
                    content: item.content,
                    type: item.type || "LINK"
                }))
            };
        }

        const bundle = await prisma.bundle.update({
            where: { id: bundleId },
            data: updateData,
            include: {
                courses: true,
                items: true
            } as any
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
                courses: true,
                items: true
            } as any
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
