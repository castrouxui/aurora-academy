
import { prisma } from "./src/lib/prisma";

async function main() {
    console.log("Calculating total revenue from approved purchases...");

    const purchases = await prisma.purchase.findMany({
        where: { status: 'approved' },
        select: { amount: true }
    });

    const total = purchases.reduce((sum, p) => sum + Number(p.amount), 0);

    console.log(`Total Approved Purchases: ${purchases.length}`);
    console.log(`Total Revenue (Locally): $${total}`);
    console.log(`Expected (MP): $1004300`);
    console.log(`Difference: $${1004300 - total}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
