
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BundleClient } from "@/components/bundles/BundleClient";

interface BundlePageProps {
    params: Promise<{ bundleId: string }>;
}

async function getBundle(bundleId: string) {
    try {
        const bundle = await prisma.bundle.findUnique({
            where: { id: bundleId },
            include: {
                items: true,
                courses: {
                    select: {
                        id: true,
                        title: true, // Needed for course type
                        description: true,
                        price: true,
                        level: true,
                        imageUrl: true
                    }
                }
            }
        });

        if (!bundle) return null;

        return {
            ...bundle,
            price: Number(bundle.price) || 0,
            imageUrl: bundle.imageUrl,
            description: bundle.description || "",
            // Map necessary fields for display
        };
    } catch (error) {
        console.error("Error fetching bundle:", error);
        return null;
    }
}

export async function generateMetadata({ params }: BundlePageProps): Promise<Metadata> {
    const { bundleId } = await params;
    const bundle = await getBundle(bundleId);

    if (!bundle) {
        return {
            title: "Pack no encontrado | Aurora Academy",
            description: "El pack de cursos que buscas no está disponible."
        };
    }

    return {
        title: `${bundle.title} | Aurora Academy`,
        description: bundle.description || "Descubre nuestros packs de cursos y ahorra en tu formación.",
        openGraph: {
            title: `${bundle.title} | Aurora Academy`,
            description: bundle.description || "Descubre nuestros packs de cursos y ahorra en tu formación.",
            images: [
                {
                    url: bundle.imageUrl || "/og-image.jpg",
                    width: 1200,
                    height: 630,
                    alt: bundle.title,
                }
            ],
            type: "website",
        },
    };
}

export default async function BundlePage({ params }: BundlePageProps) {
    const { bundleId } = await params;
    const bundle = await getBundle(bundleId);

    return <BundleClient bundle={bundle} />;
}
