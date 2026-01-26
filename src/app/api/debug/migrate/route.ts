import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key !== "aurora-admin-fix-2026") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const logs: string[] = [];
    const log = (msg: string) => { console.log(msg); logs.push(msg); };

    try {
        log("Starting Raw SQL Migration...");

        // 1. Create Company Table
        log("Creating table Company...");
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "Company" (
                "id" TEXT NOT NULL,
                "name" TEXT NOT NULL,
                "logo" TEXT,
                "domain" TEXT,
                "accessCode" TEXT NOT NULL,
                "maxSeats" INTEGER NOT NULL DEFAULT 0,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
            );
        `);
        // Add unique index on accessCode separately to avoid error if exists
        try {
            await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "Company_accessCode_key" ON "Company"("accessCode");`);
        } catch (e) { log("Index on Company(accessCode) might already exist (ignoring)"); }


        // 2. Update User Table with missing columns
        log("Altering User table...");

        // isCompanyAdmin
        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isCompanyAdmin" BOOLEAN NOT NULL DEFAULT false;`);

        // companyId
        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "companyId" TEXT;`);

        // password
        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "password" TEXT;`);

        // createdAt
        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;`);

        // updatedAt
        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;`);

        // FOREIGN KEY for companyId
        // This is tricky safely, but let's try. IF NOT EXISTS is hard for constraints in raw sql one-liner.
        // We generally skip constraint creation in hotfix if strictness unimportant, but let's try basic one.
        // await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;`).catch(e => log("FK error (ignoring): "+e.message));


        // 3. Create other tables if needed for full compliance (simplified for now to unblock login)
        log("Creating other tables (Lead, Coupon)...");

        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "Lead" (
                "id" TEXT NOT NULL,
                "name" TEXT NOT NULL,
                "companyName" TEXT NOT NULL,
                "email" TEXT NOT NULL,
                "phone" TEXT,
                "employees" TEXT NOT NULL,
                "status" TEXT NOT NULL DEFAULT 'NEW',
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
            );
        `);

        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "Coupon" (
                "id" TEXT NOT NULL,
                "code" TEXT NOT NULL,
                "discount" DECIMAL(65,30) NOT NULL,
                "type" TEXT NOT NULL DEFAULT 'PERCENTAGE',
                "expiresAt" TIMESTAMP(3),
                "limit" INTEGER,
                "used" INTEGER NOT NULL DEFAULT 0,
                "active" BOOLEAN NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
            );
        `);

        return NextResponse.json({
            success: true,
            message: "SQL Patches applied successfully",
            logs
        });
    } catch (error) {
        console.error("SQL Migration failed:", error);
        return NextResponse.json({
            error: "SQL Migration failed",
            details: error instanceof Error ? error.message : String(error),
            logs
        }, { status: 500 });
    }
}
