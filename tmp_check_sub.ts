import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://neondb_owner:npg_cyrsx0NlpZ1D@ep-green-shadow-ahexfxf8-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
        }
    }
});

async function checkSub() {
    const users = await prisma.user.findMany({
        where: {
            OR: [
                { email: { contains: 'maxi', mode: 'insensitive' } },
                { name: { contains: 'maxi', mode: 'insensitive' } }
            ]
        },
        include: {
            subscriptions: {
                include: {
                    bundle: true
                }
            },
            purchases: true,
            company: true,
        }
    });

    console.log(JSON.stringify(users, null, 2));
}

checkSub()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
