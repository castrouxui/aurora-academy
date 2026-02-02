
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const bundles = await prisma.bundle.findMany();
    console.log("Bundles found:", bundles);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
