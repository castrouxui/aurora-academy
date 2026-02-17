import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TARGET_TITLES = [
    "Manejo de TradingView",
    "Mentoría Análisis Técnico",
    "Análisis Técnico (Curso)",
    "Price Action",
    "Domina el Stop Loss",
    "Machine Learning + IA",
    "Testing con IA",
    "IA en Inversiones",
    "El camino del inversor",
    "Finanzas Personales",
    "Los 7 Pilares del Éxito",
    "Intro. Mercado de Capitales",
    "Fondos Comunes de Inversión",
    "Análisis Fundamental",
    "Renta Fija",
    "Valuación de Bonos",
    "Tasa de interés (TNA/TEA)",
    "Futuros Financieros",
    "Opciones Financieras",
    "Mentoría Gestión de Cartera",
    "Riesgo y Volatilidad",
    "Beneficio vs. Caja",
];

async function main() {
    console.log("⚠️  Starting Cleanup Process...");

    // 1. Delete Generated Users and their Reviews
    const users = await prisma.user.findMany({
        where: {
            email: {
                endsWith: ".review@aurora.academy"
            }
        }
    });

    console.log(`Found ${users.length} generated users to delete.`);

    for (const user of users) {
        const deletedReviews = await prisma.review.deleteMany({
            where: { userId: user.id }
        });

        await prisma.user.delete({
            where: { id: user.id }
        });

        console.log(`- Deleted user ${user.email} and ${deletedReviews.count} reviews.`);
    }

    // 2. Delete Empty Courses created by us
    console.log("\nChecking courses for cleanup...");

    for (const title of TARGET_TITLES) {
        const courses = await prisma.course.findMany({
            where: {
                title: {
                    contains: title,
                    mode: 'insensitive'
                }
            },
            include: {
                modules: true,
                purchases: true,
                reviews: true
            }
        });

        for (const course of courses) {
            if (course.modules.length === 0 && course.purchases.length === 0 && course.reviews.length === 0) {
                console.log(`- Deleting EMPTY course: "${course.title}" (${course.id})`);
                await prisma.course.delete({
                    where: { id: course.id }
                });
            } else {
                console.log(`- Skipping "${course.title}" (Has content/purchases/reviews).`);
            }
        }
    }

    console.log("\n✅ Cleanup Done! The database should be clean of generated data.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
