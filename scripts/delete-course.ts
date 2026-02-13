import { prisma } from "../src/lib/prisma";

async function main() {
    const idToDelete = "cl_camino_inversor";
    try {
        const deleted = await prisma.course.delete({
            where: { id: idToDelete }
        });
        console.log(`Successfully deleted course: ${deleted.title} (${deleted.id})`);
    } catch (error) {
        console.error(`Error deleting course ${idToDelete}:`, error);
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
