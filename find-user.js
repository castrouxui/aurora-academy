
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        where: {
            OR: [
                { email: { contains: 'maxi', mode: 'insensitive' } },
                { name: { contains: 'Aperio', mode: 'insensitive' } }
            ]
        },
        select: { email: true, name: true }
    });

    console.log('Similar Users:', users);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
