
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const course = await prisma.course.findFirst({
        where: { title: { contains: 'Inversor', mode: 'insensitive' } },
        include: {
            modules: {
                where: { title: { contains: 'Cuestionario', mode: 'insensitive' } }
            }
        }
    });

    console.log('Target Course & Module:', JSON.stringify(course, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
