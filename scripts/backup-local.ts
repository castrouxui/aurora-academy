
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('📦 Starting backup...');

    const data = {
        users: await prisma.user.findMany(),
        courses: await prisma.course.findMany({
            include: {
                modules: {
                    include: {
                        lessons: true
                    }
                }
            }
        }),
        bundles: await prisma.bundle.findMany({
            include: {
                items: true,
                courses: true
            }
        }),
        purchases: await prisma.purchase.findMany(),
        coupons: await prisma.coupon.findMany(),
    };

    const backupPath = path.join(process.cwd(), 'backup-data.json');
    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));

    console.log(`✅ Backup saved to ${backupPath}`);
    console.log(`Summary:`);
    console.log(`- Users: ${data.users.length}`);
    console.log(`- Courses: ${data.courses.length}`);
    console.log(`- Bundles: ${data.bundles.length}`);
    console.log(`- Purchases: ${data.purchases.length}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
