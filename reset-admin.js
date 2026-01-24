const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
    const email = 'admin@aurora.com';
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (user) {
        console.log(`User found: ${user.email}`);
        console.log(`Role: ${user.role}`);
        // Reset password to known value
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.user.update({ where: { email }, data: { password: hashedPassword, role: 'ADMIN' } });
        console.log('Password reset to: admin123');
    } else {
        console.log('User NOT found. Creating admin user...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.user.create({
            data: {
                email,
                name: 'Admin Aurora',
                password: hashedPassword,
                role: 'ADMIN',
                image: `https://ui-avatars.com/api/?name=Admin+Aurora&background=random`
            }
        });
        console.log('Created user admin@aurora.com with password: admin123');
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
