
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const courses = await prisma.course.findMany({
        select: { id: true, title: true, imageUrl: true }
    });

    console.log("--- COURSE IMAGE AUDIT ---");

    for (const c of courses) {
        if (!c.imageUrl) {
            console.log(`[SKIPPED] "${c.title}" has no image.`);
            continue;
        }

        // Check if file exists in public folder
        // imageUrl usually starts with / (e.g. /images/...)
        // effectively mapping / -> public/
        const relativePath = c.imageUrl.startsWith('/') ? c.imageUrl.substring(1) : c.imageUrl;
        const fullPath = path.resolve(process.cwd(), 'public', relativePath);

        if (fs.existsSync(fullPath)) {
            console.log(`[OK]      "${c.title}" -> ${c.imageUrl}`);
        } else {
            console.log(`[MISSING] "${c.title}" -> ${c.imageUrl} (File not found at ${fullPath})`);
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
