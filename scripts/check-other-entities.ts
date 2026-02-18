import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const bundles = await prisma.bundle.findMany({
        select: { id: true, title: true, published: true },
    });
    const careers = await prisma.career.findMany({
        select: { id: true, name: true, published: true },
    });

    console.log("Bundles:", JSON.stringify(bundles, null, 2));
    console.log("Careers:", JSON.stringify(careers, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
