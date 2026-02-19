
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        where: {
            OR: [
                { name: { contains: 'maxi', mode: 'insensitive' } },
                { name: { contains: 'aperio', mode: 'insensitive' } },
                { email: { contains: 'maxi', mode: 'insensitive' } },
                { email: { contains: 'aperio', mode: 'insensitive' } }
            ]
        },
        include: {
            subscriptions: {
                include: {
                    bundle: true
                }
            }
        }
    });

    console.log('--- Users found ---');
    users.forEach(user => {
        console.log(`ID: ${user.id}`);
        console.log(`Name: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Role: ${user.role}`);
        console.log('Subscriptions:');
        user.subscriptions.forEach(sub => {
            console.log(`  - Bundle: ${sub.bundle.title}`);
            console.log(`    Status: ${sub.status}`);
            console.log(`    Created: ${sub.createdAt}`);
            console.log(`    Updated: ${sub.updatedAt}`);
            console.log(`    MercadoPagoID: ${sub.mercadoPagoId}`);
        });
        console.log('------------------');
    });

    const bundles = await prisma.bundle.findMany();
    console.log('\n--- Available Bundles ---');
    bundles.forEach(b => {
        console.log(`ID: ${b.id}, Title: ${b.title}, Price: ${b.price}`);
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
