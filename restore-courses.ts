
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // 1. Update Existing "Mentoria en Price Action"
    try {
        const priceAction = await prisma.course.findFirst({
            where: { title: { contains: "Price Action", mode: 'insensitive' } }
        });

        if (priceAction) {
            await prisma.course.update({
                where: { id: priceAction.id },
                data: { imageUrl: "/images/courses/price_action.jpg" }
            });
            console.log("✅ Updated image for: Mentoria en Price Action");
        } else {
            console.log("⚠️ Could not find 'Mentoria en Price Action' to update.");
        }
    } catch (e) {
        console.error("Error updating Price Action:", e);
    }

    // 2. Create "Curso Análisis Técnico"
    try {
        const existingAT = await prisma.course.findFirst({
            where: { title: { contains: "Técnico", mode: 'insensitive' } }
        });

        if (!existingAT) {
            await prisma.course.create({
                data: {
                    title: "Curso Análisis Técnico",
                    description: "Domina el análisis técnico y el Price Action.",
                    price: 25000, // Placeholder price
                    imageUrl: "/images/courses/analisis_tecnico.jpg",
                    category: "Trading",
                    level: "Intermedio",
                    published: true
                }
            });
            console.log("✅ Created course: Curso Análisis Técnico");
        } else {
            console.log("ℹ️ Course 'Análisis Técnico' already exists, updating image...");
            await prisma.course.update({
                where: { id: existingAT.id },
                data: { imageUrl: "/images/courses/analisis_tecnico.jpg" }
            });
            console.log("✅ Updated image for: Curso Análisis Técnico");
        }
    } catch (e) {
        console.error("Error creating/updating Análisis Técnico:", e);
    }

    // 3. Create "Curso Opciones Financieras"
    try {
        const existingOpt = await prisma.course.findFirst({
            where: { title: { contains: "Opciones Financieras", mode: 'insensitive' } }
        });

        if (!existingOpt) {
            await prisma.course.create({
                data: {
                    title: "Curso Opciones Financieras",
                    description: "Aprende a operar opciones financieras desde cero.",
                    price: 35000,
                    imageUrl: "/images/courses/opciones_financieras.jpg",
                    category: "Derivados",
                    level: "Avanzado",
                    published: true
                }
            });
            console.log("✅ Created course: Curso Opciones Financieras");
        } else {
            console.log("ℹ️ Course 'Opciones Financieras' already exists, updating image...");
            await prisma.course.update({
                where: { id: existingOpt.id },
                data: { imageUrl: "/images/courses/opciones_financieras.jpg" }
            });
            console.log("✅ Updated image for: Curso Opciones Financieras");
        }
    } catch (e) {
        console.error("Error creating/updating Opciones Financieras:", e);
    }

    // 4. Create "Micro Curso BPA vs FCF"
    try {
        const existingBPA = await prisma.course.findFirst({
            where: { title: { contains: "BPA", mode: 'insensitive' } }
        });

        if (!existingBPA) {
            await prisma.course.create({
                data: {
                    title: "Micro Curso BPA vs FCF",
                    description: "Entiende la diferencia entre Beneficio por Acción y Flujo de Caja Libre.",
                    price: 15000,
                    imageUrl: "/images/courses/bpa_vs_fcf.jpg",
                    category: "Fundamental",
                    level: "Básico",
                    published: true
                }
            });
            console.log("✅ Created course: Micro Curso BPA vs FCF");
        } else {
            console.log("ℹ️ Course 'BPA vs FCF' already exists, updating image...");
            await prisma.course.update({
                where: { id: existingBPA.id },
                data: { imageUrl: "/images/courses/bpa_vs_fcf.jpg" }
            });
            console.log("✅ Updated image for: Micro Curso BPA vs FCF");
        }
    } catch (e) {
        console.error("Error creating/updating BPA vs FCF:", e);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
