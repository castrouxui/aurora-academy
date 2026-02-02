
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Auditing Bundle Purchases vs Subscriptions...");

    // 1. Find all Purchases for Bundles
    const bundlePurchases = await prisma.purchase.findMany({
        where: {
            bundleId: { not: null },
            status: 'approved'
        },
        include: { user: true, bundle: true }
    });

    console.log(`Found ${bundlePurchases.length} approved Bundle Purchases.`);

    const ghostUsers = [];

    for (const p of bundlePurchases) {
        // Check if this user has a subscription for this bundle
        const sub = await prisma.subscription.findFirst({
            where: {
                userId: p.userId,
                bundleId: p.bundleId,
                status: { in: ['authorized', 'pending'] }
            }
        });

        if (!sub) {
            ghostUsers.push({
                email: p.user.email,
                bundle: p.bundle.title,
                purchaseId: p.id,
                date: p.createdAt
            });
        }
    }

    if (ghostUsers.length > 0) {
        console.log("\n⚠️  WARNING: Found users who paid for a bundle but have NO active subscription:");
        console.table(ghostUsers);
    } else {
        console.log("\n✅ All bundle purchases have corresponding subscriptions.");
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
