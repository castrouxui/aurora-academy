import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://auroracademy.net'

    // Static Routes
    const staticRoutes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/courses`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/pricing`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/refund-policy`,
            lastModified: new Date(),
            changeFrequency: 'yearly' as const,
            priority: 0.5,
        },
    ]

    // Dynamic Course Routes
    const courses = await prisma.course.findMany({
        where: { published: true },
        select: { id: true, updatedAt: true }
    });

    const courseRoutes = courses.map((course) => ({
        url: `${baseUrl}/courses/${course.id}`,
        lastModified: course.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Dynamic Bundle Routes
    const bundles = await prisma.bundle.findMany({
        where: { published: true },
        select: { id: true, updatedAt: true }
    });

    const bundleRoutes = bundles.map((bundle) => ({
        url: `${baseUrl}/bundles/${bundle.id}`,
        lastModified: bundle.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...staticRoutes, ...courseRoutes, ...bundleRoutes]
}
