
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const BUNDLES = [
    {
        title: "Inversor Inicial",
        price: 54900,
        description: "El escalón de entrada para dominar los conceptos base.",
        published: true
    },
    {
        title: "Trader de Elite",
        price: 89900,
        description: "Para quienes operan activamente y buscan actualización constante.",
        published: true
    },
    {
        title: "Portfolio Manager",
        price: 149900,
        description: "La experiencia completa con networking profesional.",
        published: true
    }
];

async function main() {
    console.log("🌱 Seeding Bundles...");

    // 1. Create Bundles
    const createdBundles = [];
    for (const b of BUNDLES) {
        // Check if exists
        const existing = await prisma.bundle.findFirst({ where: { title: b.title } });
        if (!existing) {
            const created = await prisma.bundle.create({
                data: {
                    title: b.title,
                    price: b.price,
                    description: b.description,
                    published: true,
                    imageUrl: '/bundles/' + b.title.toLowerCase().replace(/ /g, '-') + '.jpg'
                }
            });
            console.log(`Created Bundle: ${created.title}`);
            createdBundles.push(created);
        } else {
            console.log(`Bundle exists: ${existing.title}`);
            createdBundles.push(existing);
        }
    }

    // 2. Create Test User
    const email = "student@aurora.com";
    const password = "testpassword123";
    const hashedPassword = await bcrypt.hash(password, 10);

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                email,
                name: "Test User",
                password: hashedPassword,
                role: "ESTUDIANTE",
                image: "https://ui-avatars.com/api/?name=Test+User"
            }
        });
        console.log(`Created User: ${email}`);
    } else {
        console.log(`User exists: ${email}`);
        // Ensure password matches
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });
    }

    // 3. Assign Initial Subscription (Inversor Inicial)
    const initialBundle = createdBundles.find(b => b.title === "Inversor Inicial");

    // Check if subscription exists
    const sub = await prisma.subscription.findFirst({
        where: { userId: user.id }
    });

    if (!sub) {
        // Create new
        await prisma.subscription.create({
            data: {
                userId: user.id,
                bundleId: initialBundle.id,
                status: 'authorized',
                mercadoPagoId: 'PreApproval-Test-' + Date.now()
            }
        });
        console.log(`Subscription created for ${user.email} to ${initialBundle.title}`);
    } else {
        // Force update to Initial Bundle
        if (sub.bundleId !== initialBundle.id) {
            await prisma.subscription.update({
                where: { id: sub.id },
                data: {
                    bundleId: initialBundle.id,
                    status: 'authorized',
                    mercadoPagoId: 'PreApproval-Test-' + Date.now()
                }
            });
            console.log(`Subscription RESET to Inversor Inicial for ${user.email}`);
        } else {
            console.log(`User already has Inversor Inicial.`);
        }
    }

    console.log("✅ Seeding complete.");
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
