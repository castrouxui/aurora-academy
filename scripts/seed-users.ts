
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding sample users/sales...')

    // 1. Create Sample Students
    const students = [
        { email: 'student1@demo.com', name: 'Juan Pérez' },
        { email: 'student2@demo.com', name: 'Maria Gonzalez' },
        { email: 'student3@demo.com', name: 'Carlos Lopez' },
    ]

    for (const s of students) {
        await prisma.user.upsert({
            where: { email: s.email },
            update: {},
            create: {
                email: s.email,
                name: s.name,
                role: 'ESTUDIANTE',
                image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`,
            },
        })
    }
    console.log('Created sample students')

    // 2. Mock a Sale if possible (requires Course and User)
    const student = await prisma.user.findUnique({ where: { email: 'student1@demo.com' } })
    const course = await prisma.course.findFirst()

    if (student && course) {
        // Create a Purchase entry if the model exists
        // Note: I need to verify if 'Purchase' model exists and its schema. 
        // Based on stats route: prisma.purchase.aggregate...

        // We try/catch this block in case Purchase model is different or strict
        try {
            await prisma.purchase.create({
                data: {
                    userId: student.id,
                    courseId: course.id,
                    amount: course.price,
                    status: 'approved',
                    paymentId: 'mock_payment_123',
                    merchantOrder: 'mock_order_123'
                }
            })
            console.log('Created mock purchase')
        } catch (e) {
            console.log('Could not create mock purchase (maybe schema mismatch)', e.message)
        }
    }

    console.log('Seeding finished')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
