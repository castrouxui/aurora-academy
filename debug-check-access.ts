
import { prisma } from "./src/lib/prisma";

async function main() {
    const targetEmail = "priestra12@gmail.com";
    console.log(`Searching for user with email: ${targetEmail}`);

    const users = await prisma.user.findMany({
        where: {
            email: targetEmail
        },
        include: {
            purchases: {
                include: {
                    course: true,
                    bundle: {
                        include: {
                            courses: true
                        }
                    }
                }
            },
            subscriptions: {
                include: {
                    bundle: {
                        include: {
                            courses: true
                        }
                    }
                }
            }
        }
    });

    if (users.length === 0) {
        console.log("No users found.");
    } else {
        users.forEach(user => {
            console.log(`\nUser: ${user.name} (${user.email})`);
            console.log("Purchases:");
            if (user.purchases.length === 0) console.log("  None");
            user.purchases.forEach(p => {
                const item = p.course ? `Course: ${p.course.title}` : `Bundle: ${p.bundle?.title}`;
                console.log(`  - [${p.status}] ${item} (Amount: ${p.amount})`);
                if (p.bundle?.courses) {
                    console.log("    Bundle includes:");
                    p.bundle.courses.forEach(c => console.log(`      - ${c.title}`));
                }
            });

            console.log("Subscriptions:");
            if (user.subscriptions.length === 0) console.log("  None");
            user.subscriptions.forEach(s => {
                console.log(`  - [${s.status}] Bundle: ${s.bundle?.title}`);
            });
        });
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
