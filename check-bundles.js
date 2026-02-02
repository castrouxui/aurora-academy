
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const bundles = await prisma.bundle.findMany();
    console.log('Bundles:', bundles);

    const purchases = await prisma.purchase.findMany({
        where: {
            user: { email: 'gonzalopmiranda@gmail.com' }
        },
        include: {
            bundle: true
        }
    });
    console.log('User Purchases:', JSON.stringify(purchases, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
