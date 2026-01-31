
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'gcettour@gmail.com';
    console.log(`Searching for user with email: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            subscriptions: {
                orderBy: { createdAt: 'desc' },
                include: { bundle: true }
            },
            purchases: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!user) {
        console.log('User not found');
        return;
    }

    console.log('User found:', user.id, user.name);
    console.log('--- Subscriptions ---');
    if (user.subscriptions.length === 0) {
        console.log('No subscriptions found.');
    } else {
        user.subscriptions.forEach(sub => {
            console.log(`ID: ${sub.id}`);
            console.log(`  Status: ${sub.status}`);
            console.log(`  MP ID: ${sub.mercadoPagoId}`);
            console.log(`  Created: ${sub.createdAt}`);
            console.log(`  Bundle: ${sub.bundle?.title}`);
            console.log('---');
        });
    }

    console.log('--- Purchases ---');
    if (user.purchases.length === 0) {
        console.log('No purchases found.');
    } else {
        user.purchases.forEach(p => {
            console.log(`ID: ${p.id}`);
            console.log(`  Status: ${p.status}`);
            console.log(`  Amount: ${p.amount}`);
            console.log(`  Created: ${p.createdAt}`);
            console.log('---');
        });
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
