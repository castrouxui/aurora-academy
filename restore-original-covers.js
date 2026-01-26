
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // 1. Mentoria en Price Action -> price_action_cover_...
    const priceAction = await prisma.course.findFirst({
        where: { title: { contains: "Price Action", mode: 'insensitive' } }
    });
    if (priceAction) {
        await prisma.course.update({
            where: { id: priceAction.id },
            data: { imageUrl: "/images/courses/price_action_cover_1768005409635.png" }
        });
        console.log("✅ Restored original cover for: Mentoria en Price Action");
    }

    // 2. Curso Análisis Técnico -> analisis_tecnico_cover_...
    const analisisTecnico = await prisma.course.findFirst({
        where: { title: { contains: "Análisis Técnico", mode: 'insensitive' } }
    });
    if (analisisTecnico) {
        await prisma.course.update({
            where: { id: analisisTecnico.id },
            data: { imageUrl: "/images/courses/analisis_tecnico_cover_1768005395407.png" }
        });
        console.log("✅ Restored original cover for: Curso Análisis Técnico");
    }

    // 3. Curso Opciones Financieras -> opciones_cover_gen.png
    const opciones = await prisma.course.findFirst({
        where: { title: { contains: "Opciones Financieras", mode: 'insensitive' } }
    });
    if (opciones) {
        await prisma.course.update({
            where: { id: opciones.id },
            data: { imageUrl: "/images/courses/opciones_cover_gen.png" }
        });
        console.log("✅ Restored original cover for: Curso Opciones Financieras");
    }

    // 4. "Mentoria Introducción al Mercado de Capitales" Check
    // Earlier I saw "Introducción al Trading" using "trading_inicial_cover...".
    // I will check if I should rename it or just ensure image is set.
    const introTrading = await prisma.course.findFirst({
        where: { title: { contains: "Trading", mode: 'insensitive' } }
    });
    if (introTrading) {
        // It is already using trading_inicial_cover_1768005327407.png, confirmed in debug step.
        console.log("ℹ️ 'Introducción al Trading' is using correct legacy cover.");
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
