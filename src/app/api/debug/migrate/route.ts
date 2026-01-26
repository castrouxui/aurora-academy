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

        // Check if prisma folder exists in node_modules
        const { stdout: lsNodeModules } = await execAsync("ls -la node_modules").catch(e => ({ stdout: e.message }));
        const { stdout: lsPrisma } = await execAsync("ls -la node_modules/prisma").catch(e => ({ stdout: "node_modules/prisma not found" }));
        const { stdout: lsPrismaBuild } = await execAsync("ls -la node_modules/prisma/build").catch(e => ({ stdout: "node_modules/prisma/build not found" }));

        // Try to invoke index.js directly if possible
        // const { stdout: runAttempt } = await execAsync("node node_modules/prisma/build/index.js --version").catch(e => ({ stdout: e.message }));

        let prismaPath = "unresolved";
        try {
            // We just want to check if require finds it
            require("prisma/package.json");
            prismaPath = "package.json found";
        } catch (e) { prismaPath = "require failed"; }

        return NextResponse.json({
            info: "Diagnostic run 2",
            cwd: process.cwd(),
            nodeModules: lsNodeModules.split("\n"),
            prismaDir: lsPrisma.split("\n"),
            prismaBuild: lsPrismaBuild.split("\n"),
            prismaReq: prismaPath
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
