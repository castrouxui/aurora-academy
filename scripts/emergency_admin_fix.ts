
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'aurora@admin.com';
    const password = 'Admin123'; // Temporary password
    const hashedPassword = await hash(password, 10);

    console.log(`Checking user: ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (user) {
        console.log(`User found (ID: ${user.id}). Updating role to ADMIN...`);
        await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' },
        });
        console.log('✅ Role updated to ADMIN successfully.');
    } else {
        console.log('User not found. Creating new ADMIN user...');
        await prisma.user.create({
            data: {
                email,
                name: 'Aurora Admin',
                password: hashedPassword,
                role: 'ADMIN',
                image: `https://ui-avatars.com/api/?name=Admin&background=random`,
            },
        });
        console.log('✅ User created with role ADMIN.');
        console.log(`⚠️ Password set to: ${password}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
