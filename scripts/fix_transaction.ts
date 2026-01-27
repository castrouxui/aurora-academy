
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log(`Searching for users like 'sonez' or 'pablo'...`);

    const users = await prisma.user.findMany({
        where: {
            OR: [
                { email: { contains: 'pablo', mode: 'insensitive' } },
                { email: { contains: 'sonez', mode: 'insensitive' } }
            ]
        },
        take: 10
    });

    console.log(`Found ${users.length} users:`);
    users.forEach(u => console.log(`- ${u.name} (${u.email}) ID: ${u.id}`));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
