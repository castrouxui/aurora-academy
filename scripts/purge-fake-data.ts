
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Purging fake data...')

    // Delete the specific demo users we created
    const emailsToDelete = ['student1@demo.com', 'student2@demo.com', 'student3@demo.com']

    await prisma.user.deleteMany({
        where: {
            email: { in: emailsToDelete }
        }
    })

    // Also clean up any mock purchase if it was created (though it failed last time, good to be safe)
    // Since we don't know the purchase ID and it failed, we likely don't need to delete, 
    // but let's check if any purchase exists for these users.
    // Actually, deleteMany on users cascades if configured, but let's just delete users for now.

    console.log('Purged fake users.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
