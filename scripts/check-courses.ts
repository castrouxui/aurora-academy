
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const titles = [
        "Trading Inicial",
        "Trading Intermedio",
        "Trading Avanzado",
        "Trader de 0 a 100"
    ];

    console.log("Checking courses...");
    for (const title of titles) {
        const course = await prisma.course.findFirst({
            where: { title: title }
        });
        console.log(`Course '${title}': ${course ? 'FOUND (' + course.id + ')' : 'MISSING'}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
