
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            include: {
                modules: {
                    include: {
                        lessons: true
                    }
                }
            }
        });

        const summary = courses.map(c => ({
            id: c.id,
            title: c.title,
            published: c.published,
            modulesCount: c.modules.length,
            lessonsCount: c.modules.reduce((acc, m) => acc + m.lessons.length, 0),
            videoUrls: c.modules.flatMap(m => m.lessons.map(l => ({ title: l.title, videoUrl: l.videoUrl, published: l.published })))
        }));

        return NextResponse.json({ count: courses.length, courses: summary });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
