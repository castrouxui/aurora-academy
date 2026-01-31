
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkIntegrity() {
    console.log("Checking Purchase integrity...");

    // Check direct course purchases
    const purchases = await prisma.purchase.findMany({
        where: { NOT: { courseId: null } },
        select: { id: true, courseId: true, userId: true }
    });
    console.log(`Found ${purchases.length} purchases with courseId.`);

    for (const p of purchases) {
        if (!p.courseId) continue;
        const course = await prisma.course.findUnique({ where: { id: p.courseId } });
        if (!course) {
            console.error(`[ORPHAN] Purchase ${p.id} references missing course ${p.courseId} (User: ${p.userId})`);
        }
    }

    // Check bundle purchases
    console.log("Checking Bundle integrity...");
    const bundlePurchases = await prisma.purchase.findMany({
        where: { NOT: { bundleId: null } },
        select: { id: true, bundleId: true, userId: true }
    });
    console.log(`Found ${bundlePurchases.length} purchases with bundleId.`);

    for (const p of bundlePurchases) {
        if (!p.bundleId) continue;
        const bundle = await prisma.bundle.findUnique({ where: { id: p.bundleId } });
        if (!bundle) {
            console.error(`[ORPHAN] Purchase ${p.id} references missing bundle ${p.bundleId}`);
        }
    }
    console.log("Done.");
}

checkIntegrity()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
