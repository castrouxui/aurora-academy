
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// List all courses
async function main() {
    const courses = await prisma.course.findMany();
    console.log("Existing Courses in DB:");
    courses.forEach(c => console.log(` - "${c.title}" (ID: ${c.id})`));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
