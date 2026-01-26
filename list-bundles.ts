
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const bundles = await prisma.bundle.findMany({
        select: {
            id: true,
            title: true,
            imageUrl: true,
        },
    });

    console.log("Current Bundles:");
    bundles.forEach(b => {
        console.log(`ID: ${b.id} | Title: ${b.title} | Image: ${b.imageUrl}`);
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
