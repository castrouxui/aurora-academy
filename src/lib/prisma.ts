import { PrismaClient } from '@prisma/client';

// Force DB URL if missing (avoids restart requirement) - Removed to prevent protocol mismatch
// if (!process.env.DATABASE_URL) {
//     process.env.DATABASE_URL = "file:./dev.db";
// }

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['query'],
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
