
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Listing all users...")

    const users = await prisma.user.findMany({
        take: 50,
        select: { id: true, email: true, name: true }
    })

    users.forEach(u => {
        console.log(`- ID: ${u.id}, Email: ${u.email}, Name: ${u.name}`)
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
