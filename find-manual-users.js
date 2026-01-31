
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const manualPurchases = await prisma.purchase.findMany({
            where: {
                paymentId: {
                    startsWith: 'manual_grant_'
                }
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                course: {
                    select: {
                        title: true
                    }
                },
                bundle: {
                    select: {
                        title: true
                    }
                }
            }
        });

        console.log('--- USUARIOS MANUALES ---');
        console.log('Total encontrados:', manualPurchases.length);
        console.log('--------------------------------');

        manualPurchases.forEach(p => {
            const product = p.course?.title || p.bundle?.title || 'Desconocido';
            const date = new Date(p.createdAt).toLocaleDateString();
            console.log(`Email: ${p.user.email} | Nombre: ${p.user.name} | Producto: ${product} | Fecha Otorgado: ${date}`);
        });

        console.log('--------------------------------');

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
