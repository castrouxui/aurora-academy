const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Restoring original course covers...');

    // 1. Introducción al Trading
    await prisma.course.updateMany({
        where: { title: { contains: 'Trading' } },
        data: { imageUrl: '/images/courses/trading_inicial_cover_1768005327407.png' }
    });
    console.log('Restored Trading cover.');

    // 2. Mentoria en Price Action
    await prisma.course.updateMany({
        where: { title: { contains: 'Price Action' } },
        data: { imageUrl: '/images/courses/price_action_cover_1768005409635.png' }
    });
    console.log('Restored Price Action cover.');

    // 3. Valuación de Bonos (Renta Fija)
    // Note: I created this course recently, so "creating" it might have missed the original ID if it was strictly linked.
    // But I will update the one I created.
    await prisma.course.updateMany({
        where: { title: { contains: 'Bonos' } }, // My created course
        data: { imageUrl: '/images/courses/renta_fija_cover_1768005380686.png' }
    });
    // 4. Mentoria Analisis Tecnico
    await prisma.course.updateMany({
        where: { title: { contains: 'Tecnico', mode: 'insensitive' } },
        data: { imageUrl: '/images/courses/analisis_tecnico_cover_1768005395407.png' }
    });
    console.log('Restored Technical Analysis cover.');

    // 5. Trading Avanzado (if exists in DB matching title)
    await prisma.course.updateMany({
        where: { title: { contains: 'Avanzado', mode: 'insensitive' } },
        data: { imageUrl: '/images/courses/trading_avanzado_cover_1768005355571.png' }
    });
    console.log('Restored Advanced Trading cover.');

    // 6. Trading Intermedio
    await prisma.course.updateMany({
        where: { title: { contains: 'Intermedio', mode: 'insensitive' } },
        data: { imageUrl: '/images/courses/trading_intermedio_cover_1768005341591.png' }
    });
    console.log('Restored Intermediate Trading cover.');

    // 7. General cover fallback?
    // I see 'clarin_home', 'puntal_home', etc. unrelated.
    // 'uploaded_image_...' generic ones.

    // Let's print what courses are left without local images to be safe?
    // checking "Gestión de Cartera" - no obvious file name match in the list except generic uploads.
    // checking "Futuros Financieros" - no match.
    // checking "Opciones Financieras" - no match.
    // checking "Análisis Fundamental" - no match.

    // I will stick to the ones I can match by filename for now.
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
