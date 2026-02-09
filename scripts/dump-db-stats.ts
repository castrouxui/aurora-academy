
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Dumping DB Stats...")

    const userCount = await prisma.user.count()
    const subCount = await prisma.subscription.count()
    const purchaseCount = await prisma.purchase.count()

    console.log(`Users: ${userCount}`)
    console.log(`Subscriptions: ${subCount}`)
    console.log(`Purchases: ${purchaseCount}`)

    if (subCount > 0) {
        console.log("\nLast 10 Subscriptions:")
        const subs = await prisma.subscription.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { email: true } } }
        })
        subs.forEach(s => console.log(`- ID: ${s.id}, User: ${s.user?.email}, Status: ${s.status}, Created: ${s.createdAt}`))
    }

    if (subCount > 0) {
        console.log("\nAll unique subscription statuses:")
        const statuses = await prisma.subscription.groupBy({
            by: ['status'],
            _count: { _all: true }
        })
        console.log(statuses)
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
