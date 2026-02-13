
import { prisma } from "../src/lib/prisma";

async function main() {
    const count = await prisma.bundle.count();
    console.log(`TOTAL_BUNDLES: ${count}`);

    if (count > 0) {
        const bundles = await prisma.bundle.findMany({ select: { id: true, title: true } });
        console.log("BUNDLES:");
        bundles.forEach(b => console.log(`${b.id} | ${b.title}`));
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
