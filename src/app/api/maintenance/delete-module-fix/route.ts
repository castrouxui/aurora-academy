
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const logs: string[] = [];
        logs.push("Starting module search...");

        // 1. Find the Course
        const course = await prisma.course.findFirst({
            where: {
                title: { contains: "Inversor", mode: "insensitive" }
            },
            include: {
                modules: true
            }
        });

        if (!course) {
            return NextResponse.json({ error: "Course 'Inversor' not found", logs });
        }

        logs.push(`Found course: ${course.title} (${course.id})`);

        // 2. Find the Module
        const moduleToDelete = course.modules.find(m =>
            m.title.toLowerCase().includes("cuestionario")
        );

        if (!moduleToDelete) {
            logs.push("Module 'Cuestionario' not found in this course.");
            // List existing modules for debugging
            logs.push(`Available modules: ${course.modules.map(m => m.title).join(", ")}`);
            return NextResponse.json({ error: "Module not found", logs });
        }

        logs.push(`Found module to delete: ${moduleToDelete.title} (${moduleToDelete.id})`);

        // 3. Delete it
        await prisma.module.delete({
            where: { id: moduleToDelete.id }
        });

        logs.push("SUCCESS: Module deleted.");

        return NextResponse.json({ success: true, logs });

    } catch (error) {
        return NextResponse.json({ error: "Internal Error", details: String(error) }, { status: 500 });
    }
}
