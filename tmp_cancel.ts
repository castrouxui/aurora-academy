import { PrismaClient } from '@prisma/client';

const MP_ACCESS_TOKEN = "APP_USR-4501994398521531-012313-6b6f061908b8f4aa966f30ae88e43823-772205571";
// Wait, the production env prod token from earlier: Let's extract it from .env.prod.
// Actually, I don't see MP_ACCESS_TOKEN in .env.prod. Let me check if there's one.
// Let's use the DB first.

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://neondb_owner:npg_cyrsx0NlpZ1D@ep-green-shadow-ahexfxf8-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
        }
    }
});

async function cancel() {
    const email = "maxi.aperio@gmail.com";
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
        console.log("No user found.");
        return;
    }

    // Cancel in DB
    const updated = await prisma.subscription.updateMany({
        where: {
            userId: user.id,
            status: { in: ['authorized', 'pending'] }
        },
        data: { status: 'cancelled' }
    });
    console.log(`Cancelled ${updated.count} subscriptions in DB.`);

    // Return the subscriptions so we can see if they are MP preapprovals
    const subs = await prisma.subscription.findMany({
        where: { userId: user.id }
    });
    console.log("Subs after update:", subs.map(s => ({ id: s.id, status: s.status, mpId: s.mercadoPagoId })));
}

cancel().catch(console.error).finally(() => prisma.$disconnect());
