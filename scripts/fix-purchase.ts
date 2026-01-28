
const { PrismaClient } = require("@prisma/client");

async function main() {
    console.log("🛠️ Starting manual purchase fix...");
    const prisma = new PrismaClient();

    // 1. Details
    const targetEmail = "vmateosalta@gmail.com";
    const targetName = "Vicente Mateo";
    const bundleKeyword = "Portafolio"; // Or "Portfolio", will search both

    // 2. Find Bundle
    console.log(`🔍 Searching for bundle containing '${bundleKeyword}' or 'Portfolio'...`);
    const bundles = await prisma.bundle.findMany({
        where: {
            OR: [
                { title: { contains: "Portfolio", mode: "insensitive" } },
                { title: { contains: "Portafolio", mode: "insensitive" } },
                { title: { contains: "Manager", mode: "insensitive" } }
            ]
        }
    });

    if (bundles.length === 0) {
        console.error("❌ No bundle found matching the keywords. Existing bundles:");
        const allBundles = await prisma.bundle.findMany();
        console.log(allBundles.map((b: any) => b.title));
        process.exit(1);
    }

    const targetBundle = bundles[0];
    console.log(`✅ Found Bundle: ${targetBundle.title} (ID: ${targetBundle.id})`);

    // 3. Find or Create User
    console.log(`👤 Finding/Creating User: ${targetEmail}`);
    const user = await prisma.user.upsert({
        where: { email: targetEmail },
        update: {},
        create: {
            email: targetEmail,
            name: targetName,
            role: "ESTUDIANTE",
            image: "", // Optional
        }
    });
    console.log(`✅ User ready: ${user.id}`);

    // 4. Create Purchase Record
    console.log("💳 Registering Purchase...");
    const purchase = await prisma.purchase.create({
        data: {
            userId: user.id,
            bundleId: targetBundle.id,
            amount: 112425, // From receipt image
            status: "approved",
            paymentId: "manual_fix_" + Date.now(),
        }
    });
    console.log(`✅ Purchase created! ID: ${purchase.id}`);

    // 5. Create Subscription Record (for access)
    console.log("🔄 activating Subscription...");
    const subscription = await prisma.subscription.create({
        data: {
            userId: user.id,
            bundleId: targetBundle.id,
            mercadoPagoId: "manual_fix_" + Date.now(),
            status: "authorized"
        }
    });
    console.log(`✅ Subscription authorized! ID: ${subscription.id}`);

    console.log("\n🎉 FIXED! The user should now have access.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // await prisma.$disconnect();
    });
