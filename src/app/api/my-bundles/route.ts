import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const purchases = await prisma.purchase.findMany({
            where: {
                userId: session.user.id,
                status: 'approved',
                bundleId: { not: null } // Only get bundle purchases
            },
            include: {
                bundle: {
                    include: {
                        courses: true,
                        items: true
                    } as any
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const bundles = purchases
            .map((p: any) => p.bundle)
            .filter((b: any) => b !== null); // Type guard

        return NextResponse.json(bundles);
    } catch (error) {
        console.error("[MY_BUNDLES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
