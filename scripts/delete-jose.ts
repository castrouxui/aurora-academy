
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const name = 'José Castro' // Or variations like 'Jose Castro'
    console.log(`Deleting sessions/user for: ${name}...`)

    const deleted = await prisma.user.deleteMany({
        where: {
            OR: [
                { name: { contains: 'Jose Castro' } },
                { name: { contains: 'José Castro' } },
                { email: { contains: 'castrouxui@gmail.com' } } // inferred from screenshot 'castrouxui@gmail.com'
            ]
        }
    })

    console.log(`Deleted ${deleted.count} users/sessions.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
