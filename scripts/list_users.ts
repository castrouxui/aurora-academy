import { prisma } from "../src/lib/prisma";

async function main() {
    const users = await prisma.user.findMany({
        take: 10,
        select: { id: true, email: true, name: true }
    });
    console.log(JSON.stringify(users, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
