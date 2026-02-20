import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.production' });

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});

async function isPaidMember(userId: string) {
    const activeSub = await prisma.subscription.findFirst({
        where: {
            userId,
            status: { in: ["authorized", "active"] },
        },
    });
    return !!activeSub;
}

async function checkUsers() {
    const users = await prisma.user.findMany({
        where: { email: { not: null } }
    });

    console.log(`Total users with email: ${users.length}`);

    let paidCount = 0;
    let eligibleCount = 0;

    for (const user of users) {
        if (await isPaidMember(user.id)) {
            paidCount++;
        } else {
            eligibleCount++;
        }
    }

    console.log(`Paid members (filtered out): ${paidCount}`);
    console.log(`Eligible for campaign: ${eligibleCount}`);
}

checkUsers().catch(console.error).finally(() => prisma.$disconnect());
