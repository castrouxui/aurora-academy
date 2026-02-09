
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Searching for all cancelled subscriptions...")

    const cancelledSubs = await prisma.subscription.findMany({
        where: {
            status: 'cancelled'
        },
        include: {
            user: { select: { email: true, name: true } },
            bundle: { select: { title: true } }
        }
    })

    console.log(`Found ${cancelledSubs.length} cancelled subscriptions:`)
    cancelledSubs.forEach(sub => {
        console.log(`- ID: ${sub.id}, User Email: ${sub.user?.email}, Plan: ${sub.bundle?.title}, Created: ${sub.createdAt}`)
    })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
