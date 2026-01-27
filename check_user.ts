
import { prisma } from './src/lib/prisma';

async function checkUserStatus() {
    const email = 'pablosonez@gmail.com';
    const paymentId = '143056540901';

    console.log(`Checking user: ${email}`);
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            purchases: true,
            subscriptions: true
        }
    });

    if (!user) {
        console.log("User not found!");
    } else {
        console.log("User found:", user.id, user.name, user.role);
        console.log("Purchases:", user.purchases);
        console.log("Subscriptions:", user.subscriptions);
    }

    console.log(`\nChecking payment ID: ${paymentId}`);
    const purchase = await prisma.purchase.findFirst({
        where: { paymentId }
    });

    const sub = await prisma.subscription.findUnique({
        where: { mercadoPagoId: paymentId }
    });

    if (purchase) console.log("Purchase FOUND by ID:", purchase);
    else console.log("Purchase NOT found by ID");

    if (sub) console.log("Subscription FOUND by ID:", sub);
    else console.log("Subscription NOT found by ID");
}

checkUserStatus()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
