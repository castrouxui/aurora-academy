
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const email = 'castrouxui@gmail.com'
    console.log(`Searching for everything related to ${email}...`)

    // Find the user first
    const users = await prisma.user.findMany({
        where: {
            OR: [
                { email: { contains: email, mode: 'insensitive' } },
                { name: { contains: 'Jose Castro', mode: 'insensitive' } }
            ]
        }
    })

    console.log(`Found ${users.length} users matching criteria.`)
    for (const user of users) {
        console.log(`User ID: ${user.id}, Email: ${user.email}, Name: ${user.name}`)

        const subs = await prisma.subscription.findMany({
            where: { userId: user.id },
            include: { bundle: { select: { title: true } } }
        })
        console.log(`  Subscriptions: ${subs.length}`)
        subs.forEach(s => console.log(`    - ID: ${s.id}, Bundle: ${s.bundle?.title}, Status: ${s.status}`))

        const purchases = await prisma.purchase.findMany({
            where: { userId: user.id },
            include: { course: { select: { title: true } }, bundle: { select: { title: true } } }
        })
        console.log(`  Purchases: ${purchases.length}`)
        purchases.forEach(p => console.log(`    - ID: ${p.id}, Item: ${p.course?.title || p.bundle?.title}, Status: ${p.status}, Amount: ${p.amount}`))
    }

    // SEARCH FOR ORPHANED SUBSCRIPTIONS (though unlikely given the schema)
    const allSubs = await prisma.subscription.findMany({
        where: {
            status: { in: ['cancelled', 'cancelled_test'] } // Just in case
        },
        include: { user: { select: { email: true } } }
    })
    console.log(`Total cancelled subs in DB: ${allSubs.length}`)
    allSubs.forEach(s => console.log(`  - Sub ID: ${s.id}, User: ${s.user?.email}, Status: ${s.status}`))
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
