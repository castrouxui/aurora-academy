import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://neondb_owner:npg_cyrsx0NlpZ1D@ep-green-shadow-ahexfxf8-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
        }
    }
});

async function checkAccess() {
    const email = "maxi.aperio@gmail.com";
    const user = await prisma.user.findFirst({
        where: { email },
        include: {
            company: true,
            purchases: true,
            subscriptions: true
        }
    });

    const portfolioManagerBundle = await prisma.bundle.findFirst({
        where: { title: { contains: 'Portfolio Manager' } }
    });

    console.log("User:", JSON.stringify(user, null, 2));
    console.log("Portfolio Manager Bundle ID:", portfolioManagerBundle?.id);
}

checkAccess().catch(console.error).finally(() => prisma.$disconnect());
