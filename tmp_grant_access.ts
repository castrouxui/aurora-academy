import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://neondb_owner:npg_cyrsx0NlpZ1D@ep-green-shadow-ahexfxf8-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
        }
    }
});

async function grantAccess() {
    const userId = "cmkwvvc7b000013dv7bvtjnbx";
    const bundleId = "cmkhix3va001efnm06bm8yqni"; // Portfolio Manager

    // Let's create an "approved" purchase for Portfolio Manager so he has access.
    const purchase = await prisma.purchase.create({
        data: {
            userId,
            bundleId,
            amount: 0, // Since he paid outside or manually
            status: "approved",
            paymentId: "MANUAL_ANNUAL_ACCESS_" + Date.now(),
            productName: "Portfolio Manager (Annual/Corporate Access)"
        }
    });

    console.log("Granted access via purchase:", purchase);
}

grantAccess().catch(console.error).finally(() => prisma.$disconnect());
