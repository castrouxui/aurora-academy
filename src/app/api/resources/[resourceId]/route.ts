import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: { resourceId: string } }) {
    try {
        const session = await getServerSession(authOptions);
        const userRole = session?.user?.role;

        if (!session || (userRole !== "ADMIN" && userRole !== "INSTRUCTOR")) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // params in Next.js 15+ are async, await them if needed, but in 14 it's sync object mostly.
        // Actually for App Router dynamic routes, params is passed directly. 
        // We might need to check Next.js version (16.1.1 is in package.json)
        // In Next 15+, props are Promises but here GET/DELETE handler signature: 
        // (request: Request, context: { params: Params })

        // For safety with updated Next.js types
        const { resourceId } = params;

        await prisma.resource.delete({
            where: { id: resourceId }
        });

        return new NextResponse(null, { status: 200 });
    } catch (error) {
        console.error("[RESOURCE_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
