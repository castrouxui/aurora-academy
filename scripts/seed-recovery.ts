
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // 1. Create Admin User
    const adminEmail = 'admin@aurora.com'
    const adminKey = 'admin-user-id'

    await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            id: adminKey,
            email: adminEmail,
            name: 'Admin User',
            role: 'ADMIN',
            image: 'https://github.com/shadcn.png', // Placeholder
        },
    })
    console.log('Created Admin User')

    // 2. Create Courses matching Pricing Page
    const courses = [
        {
            title: 'Trading Inicial',
            price: 1, // $1 ARS
            category: 'Trading',
            description: 'Desde tus primeros pasos en los mercados. Introducción, Análisis Técnico Básico y Gestión de Riesgo.',
            published: true,
            imageUrl: '/images/courses/inicial.jpg', // Placeholder
        },
        {
            title: 'Trading Intermedio',
            price: 100000,
            category: 'Trading',
            description: 'Estrategias de Trading, Psicotrading y Análisis Fundamental. Domina la operativa.',
            published: true,
            imageUrl: '/images/courses/intermedio.jpg',
        },
        {
            title: 'Trading Avanzado',
            price: 150000,
            category: 'Trading',
            description: 'Trading Institucional, Smart Money Concepts y Mentorías 1 a 1. Nivel profesional.',
            published: true,
            imageUrl: '/images/courses/avanzado.jpg',
        },
    ]

    for (const course of courses) {
        await prisma.course.create({
            data: {
                title: course.title,
                price: course.price,
                description: course.description,
                category: course.category,
                published: course.published,
                imageUrl: course.imageUrl,
                // Create a default module for each so it's not empty
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
