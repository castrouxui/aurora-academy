import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("🔍 Checking Careers in DB...");
    const careers = await prisma.career.findMany({
        include: { _count: { select: { milestones: true } } }
    });
    console.log(JSON.stringify(careers, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
