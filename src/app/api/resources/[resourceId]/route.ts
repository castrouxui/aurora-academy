import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, props: { params: Promise<{ resourceId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        const userRole = session?.user?.role;

        if (!session || (userRole !== "ADMIN" && userRole !== "INSTRUCTOR")) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const params = await props.params;
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
