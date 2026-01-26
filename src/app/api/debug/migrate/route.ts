import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key !== "aurora-admin-fix-2026") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        console.log("Starting debug diagnostics...");
        console.log("CWD:", process.cwd());

        // List directories to find prisma
        const { stdout: lsRoot } = await execAsync("ls -la");
        const { stdout: lsNodeModules } = await execAsync("ls -la node_modules").catch(() => ({ stdout: "node_modules not found" }));
        const { stdout: lsBin } = await execAsync("ls -la node_modules/.bin").catch(() => ({ stdout: "node_modules/.bin not found" }));

        // Try generic path or resolve 'prisma' from require
        let prismaPath = "prisma";
        try {
            // This might find the absolute path
            prismaPath = require.resolve("prisma/package.json");
        } catch (e) { console.log("Could not resolve prisma path") }

        return NextResponse.json({
            info: "Diagnostic run",
            cwd: process.cwd(),
            rootListing: lsRoot.split("\n"),
            binListing: lsBin.length > 500 ? lsBin.substring(0, 500) + "..." : lsBin,
            pathAttempt: prismaPath,
        });
    } catch (error) {
        console.error("Migration failed:", error);
        return NextResponse.json({
            error: "Migration failed",
            details: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}
