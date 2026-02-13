import { seedTraderCareerIfMissing } from "../src/actions/career";
import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("Running seed update...");
    await seedTraderCareerIfMissing();
    console.log("Seed update completed.");

    const course = await prisma.course.findUnique({
        where: { id: "cml05hq7n00025z0eogogsnge" }
    });
    console.log("Updated course:", JSON.stringify(course, null, 2));
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
