
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findUnique({
        where: { email: "student@aurora.com" },
        include: { subscriptions: { include: { bundle: true } } }
    });

    console.log("User:", user.email);
    console.log("Subscriptions:", JSON.stringify(user.subscriptions, null, 2));

    const bundles = await prisma.bundle.findMany();
    console.log("All Bundles:", bundles.map(b => ({ title: b.title, id: b.id, price: b.price })));
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
