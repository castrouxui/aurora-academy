
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const modules = await prisma.module.findMany({
        where: {
            title: { contains: 'Cuestionario', mode: 'insensitive' }
        },
        include: {
            course: true
        }
    });

    console.log('Found Modules:', JSON.stringify(modules, null, 2));

    // also count all just to be sure
    const count = await prisma.module.count();
    console.log('Total Modules:', count);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
