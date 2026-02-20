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

async function debug() {
    console.log("Fetching users...");
    const users = await prisma.user.findMany({
        where: { email: { not: null } }
    });

    let paidCount = 0;
    let logExistsCount = 0;

    for (const user of users) {
        if (await isPaidMember(user.id)) {
            paidCount++;
            continue;
        }

        const existingLog = await prisma.emailLog.findFirst({
            where: {
                userId: user.id,
                emailType: "CAMPAIGN_1",
                campaignId: "CAMPAIGN_FEB_2026"
            }
        });

        if (existingLog) {
            logExistsCount++;
            continue;
        }

        console.log(`User ${user.email} is eligible!`);
        break; // Stop at first eligible to not spam console
    }

    console.log(`Paid: ${paidCount}, Got Log: ${logExistsCount}`);
}

debug().catch(console.error).finally(() => prisma.$disconnect());
