import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

async function isPaidMember(userId: string) {
    const activeSub = await prisma.subscription.findFirst({
        where: {
            userId,
            status: { in: ["authorized", "active"] },
        },
    });
    return !!activeSub;
}

export async function GET(req: Request) {
    try {
        const users = await prisma.user.findMany({
            where: { email: { not: null } }
        });

        let results = [];
        let paidCount = 0;
        let logExistsCount = 0;

        for (const user of users) {
            let isPaid = await isPaidMember(user.id);
            if (isPaid) {
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

            results.push(user.email);
            if (results.length > 5) break;
        }

        return NextResponse.json({
            totalUsers: users.length,
            paidCount,
            logExistsCount,
            eligibleSamples: results
        });
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
