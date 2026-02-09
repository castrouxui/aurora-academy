
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Searching for cancelled subscriptions for castrouxui@gmail.com...")

    const user = await prisma.user.findUnique({
        where: { email: 'castrouxui@gmail.com' }
    })

    if (!user) {
        console.log("User not found.")
        return
    }

    const cancelledSubs = await prisma.subscription.findMany({
        where: {
            userId: user.id,
            status: 'cancelled'
        },
        include: {
            bundle: { select: { title: true } }
        }
    })

    console.log(`Found ${cancelledSubs.length} cancelled subscriptions:`)
    cancelledSubs.forEach(sub => {
        console.log(`- ID: ${sub.id}, Plan: ${sub.bundle.title}, Created: ${sub.createdAt}`)
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
