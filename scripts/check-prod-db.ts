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

async function checkProdLogs() {
    const logs = await prisma.emailLog.findMany({
        where: {
            emailType: "CAMPAIGN_1",
            campaignId: "CAMPAIGN_FEB_2026"
        },
        orderBy: {
            sentAt: 'desc'
        },
        take: 5
    });
    console.log(`Logs found in production: ${logs.length}`);
    for (const log of logs) {
        console.log(`Sent at: ${log.sentAt}, User: ${log.userId}`);
    }
}

checkProdLogs().catch(console.error).finally(() => prisma.$disconnect());
