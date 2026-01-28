
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const cancelledSubs = await prisma.subscription.findMany({
        where: {
            status: 'cancelled',
        },
        include: {
            user: true,
        },
    });

    console.log('Cancelled Subscriptions:');
    cancelledSubs.forEach((sub) => {
        console.log(`- Email: ${sub.user.email}, ID: ${sub.id}, Date: ${sub.updatedAt}`);
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
