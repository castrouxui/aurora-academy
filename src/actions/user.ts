"use server";

import { prisma } from "@/lib/prisma";
import { TESTIMONIALS } from "@/constants/testimonials";

export async function getRegisteredUserCount() {
    try {
        const count = await prisma.user.count();
        return count;
    } catch (error) {
        console.error("Error fetching user count:", error);
        // Fallback to 0 if DB fails for honesty
        return 0;
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

        // If we have enough real DB avatars, use them
        if (images.length >= 4) {
            return images as string[];
        }

        // Otherwise mix with real testimonial images
        const testimonialImages = TESTIMONIALS.map(t => t.image);
        return Array.from(new Set([...images, ...testimonialImages])) as string[];
    } catch (error) {
        console.error("Error fetching review avatars:", error);
        // Fallback to real testimonial images instead of empty array
        return TESTIMONIALS.map(t => t.image);
    }
}
