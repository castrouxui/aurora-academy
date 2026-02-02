
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'maxi.aperio@gmail.com';
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            subscriptions: {
                include: { bundle: true }
            },
            purchases: {
                include: { bundle: true, course: true }
            }
        }
    });

    if (!user) {
        console.log('User not found');
        return;
    }

    console.log('User Role:', user.role);
    console.log('Subscriptions:', JSON.stringify(user.subscriptions, null, 2));
    console.log('Purchases (Bundle only):', JSON.stringify(user.purchases.filter(p => p.bundleId), null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
