
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Updating course images...')

    const courseUpdates = [
        { title: 'Trading Inicial', image: '/images/courses/trading_inicial_cover_1768005327407.png' },
        { title: 'Trading Intermedio', image: '/images/courses/trading_intermedio_cover_1768005341591.png' },
        { title: 'Trading Avanzado', image: '/images/courses/trading_avanzado_cover_1768005355571.png' },
        { title: 'Renta Fija', image: '/images/courses/renta_fija_cover_1768005380686.png' },
        { title: 'Análisis Técnico', image: '/images/courses/analisis_tecnico_cover_1768005395407.png' },
        { title: 'Mentoria en Price Action', image: '/images/courses/price_action_cover_1768005409635.png' },
    ]

    for (const update of courseUpdates) {
        try {
            await prisma.course.updateMany({
                where: { title: update.title },
                data: { imageUrl: update.image }
            })
            console.log(`Updated image for: ${update.title}`)
        } catch (e: any) {
            console.log(`Failed to update ${update.title}:`, e.message)
        }
    }

    console.log('Images updated.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
