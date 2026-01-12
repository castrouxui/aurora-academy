
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding (Recovery)...')

    // 1. Create Admin User
    const adminEmail = 'admin@aurora.com'
    const adminKey = 'admin-user-id'

    await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            name: 'Francisco Castro',
            image: '/images/francisco-speaking.png',
        },
        create: {
            id: adminKey,
            email: adminEmail,
            name: 'Francisco Castro',
            role: 'ADMIN',
            image: '/images/francisco-speaking.png',
        },
    })
    console.log('Ensure Admin User exists')

    // 2. Create Courses matching Pricing Page
    const courses = [
        {
            title: 'Trading Inicial',
            price: 1,
            category: 'Trading',
            description: 'Desde tus primeros pasos en los mercados. Introducción, Análisis Técnico Básico y Gestión de Riesgo.',
            published: true,
            imageUrl: '/images/courses/trading_inicial_cover_1768005327407.png',
        },
        {
            title: 'Trading Intermedio',
            price: 100000,
            category: 'Trading',
            description: 'Estrategias de Trading, Psicotrading y Análisis Fundamental. Domina la operativa.',
            published: true,
            imageUrl: '/images/courses/trading_intermedio_cover_1768005341591.png',
        },
        {
            title: 'Trading Avanzado',
            price: 150000,
            category: 'Trading',
            description: 'Trading Institucional, Smart Money Concepts y Mentorías 1 a 1. Nivel profesional.',
            published: true,
            imageUrl: '/images/courses/trading_avanzado_cover_1768005355571.png',
        },
    ]

    for (const course of courses) {
        const existing = await prisma.course.findFirst({
            where: { title: course.title }
        })

        if (!existing) {
            await prisma.course.create({
                data: {
                    title: course.title,
                    price: course.price,
                    description: course.description,
                    category: course.category,
                    published: course.published,
                    imageUrl: course.imageUrl,
                    modules: {
                        create: {
                            title: 'Módulo 1: Introducción',
                            position: 1,
                            lessons: {
                                create: {
                                    title: 'Bienvenida al Curso',
                                    position: 1,
                                    published: true,
                                    content: 'Bienvenido a este curso de Aurora Academy...'
                                }
                            }
                        }
                    }
                },
            })
            console.log(`Created course: ${course.title}`)
        } else {
            // Optional: Update image if it exists but is old?
            await prisma.course.update({
                where: { id: existing.id },
                data: { imageUrl: course.imageUrl }
            })
            console.log(`Updated existing course image: ${course.title}`)
        }
    }

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
