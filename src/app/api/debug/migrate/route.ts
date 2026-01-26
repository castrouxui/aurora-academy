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
        console.log("Starting migration...");
        // Execute prisma migrate deploy
        const { stdout, stderr } = await execAsync("npx prisma migrate deploy");

        console.log("Migration output:", stdout);
        if (stderr) console.error("Migration stderr:", stderr);

        return NextResponse.json({
            success: true,
            message: "Database migrated successfully",
            output: stdout,
            errorOutput: stderr
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
