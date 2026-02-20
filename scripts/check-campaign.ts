import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCampaign() {
    const count = await prisma.emailLog.count({
        where: {
            emailType: "CAMPAIGN_1"
        }
    });

    const recentLogs = await prisma.emailLog.findMany({
        where: {
            emailType: "CAMPAIGN_1"
        },
        orderBy: {
            sentAt: 'desc'
        },
        take: 1
    });

    console.log(`Total CAMPAIGN_1 emails sent: ${count}`);
    if (recentLogs.length > 0) {
        console.log(`Most recent send: ${recentLogs[0].sentAt}`);
    }
}

checkCampaign().catch(console.error).finally(() => prisma.$disconnect());
