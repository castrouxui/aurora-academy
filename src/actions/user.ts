"use server";

import { prisma } from "@/lib/prisma";

export async function getRegisteredUserCount() {
    try {
        const count = await prisma.user.count();
        return count;
    } catch (error) {
        console.error("Error fetching user count:", error);
        // Fallback to a safe minimum if DB fails, or 0
        return 1000;
    }
}

export async function getReviewAvatars() {
    try {
        // Fetch users who have left reviews and have a profile image
        // We take a sample of recent reviews
        const reviews = await prisma.review.findMany({
            where: {
                user: {
                    image: { not: null }
                }
            },
            take: 20,
            orderBy: { createdAt: 'desc' },
            select: {
                user: {
                    select: { image: true }
                }
            }
        });

        // Extract images and remove duplicates/nulls
        const images = Array.from(new Set(reviews.map(r => r.user.image).filter(Boolean)));
        return images as string[];
    } catch (error) {
        console.error("Error fetching review avatars:", error);
        return [];
    }
}
