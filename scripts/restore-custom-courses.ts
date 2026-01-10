
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Restoring custom courses...')

    const courses = [
        {
            title: 'Renta Fija',
            price: 50000,
            description: '¿Te gustaría recibir pagos en tu cuenta periódicamente sin tener que vender tus activos? Aprende a invertir en Bonos y Obligaciones Negociables.',
            category: 'Inversiones',
            published: true,
            imageUrl: '/images/courses/renta-fija.jpg',
        },
        {
            title: 'Análisis Técnico',
            price: 60000,
            description: '¿Miras los gráficos y solo ves lineas caóticas? Los traders rentables ven oportunidades claras. La clave para entender el mercado.',
            category: 'Trading',
            published: true,
            imageUrl: '/images/courses/analisis-tecnico.jpg',
        },
        {
            title: 'Mentoria en Price Action',
            price: 50000,
            description: 'Si quieres vivir del trading, necesitas entender el Price Action. Es así de simple. En este nuevo programa intensivo dominarás la acción del precio.',
            category: 'Mentoria',
            published: true,
            imageUrl: '/images/courses/price-action.jpg',
        },
    ]

    for (const course of courses) {
        // Check if exists to avoid dupes if run multiple times
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
                            title: 'Módulo 1: Inicio',
                            position: 1,
                            lessons: {
                                create: {
                                    title: 'Introducción',
                                    position: 1,
                                    published: true,
                                    content: 'Contenido del curso restaurado.'
                                }
                            }
                        }
                    }
                },
            })
            console.log(`Restored: ${course.title}`)
        } else {
            console.log(`Skipped (already exists): ${course.title}`)
        }
    }

    console.log('Custom restoration finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
