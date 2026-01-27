
import { prisma } from './src/lib/prisma';

async function checkDuplicates() {
    const email = 'pablosonez@gmail.com';

    console.log(`Fetching purchases for: ${email}`);
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            purchases: {
                include: {
                    course: true,
                    bundle: true
                }
            }
        }
    });

    if (!user) {
        console.log("User not found");
        return;
    }

    console.log(`User Found: ${user.name} (${user.id})`);
    console.log(`Total Purchases: ${user.purchases.length}`);

    user.purchases.forEach((p, i) => {
        console.log(`\n[${i + 1}] Purchase ID: ${p.id}`);
        console.log(`    Payment ID: ${p.paymentId}`);
        console.log(`    Amount: ${p.amount}`);
        console.log(`    Status: ${p.status}`);
        console.log(`    Course: ${p.course?.title} (ID: ${p.courseId})`);
        console.log(`    Bundle: ${p.bundle?.title} (ID: ${p.bundleId})`);
        console.log(`    Created At: ${p.createdAt}`);
    });
}

checkDuplicates()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
