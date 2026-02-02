
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const pid = 'cmkxd31tl0006tz7rc9nd54y3';
    const p = await prisma.purchase.findUnique({
        where: { id: pid },
        include: { user: true, bundle: true }
    });
    console.log('Purchase by ID:', p);

    if (!p) {
        console.log('Searching by partial ID...');
        const all = await prisma.purchase.findMany({ include: { user: true } });
        const found = all.find(x => x.id.includes('cmkxd31'));
        console.log('Found similar:', found);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
