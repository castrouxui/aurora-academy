"use server";

import { prisma } from "@/lib/prisma";

export async function getBundles() {
    try {
        const bundles = await prisma.bundle.findMany({
            include: {
                courses: {
                    select: {
                        id: true,
                        title: true,
                        price: true
                    }
                },
                items: true
            } as any,
            orderBy: {
                createdAt: 'desc'
            }
        });
        return bundles;
    } catch (error) {
        console.error("Error fetching bundles:", error);
        return [];
    }
}
