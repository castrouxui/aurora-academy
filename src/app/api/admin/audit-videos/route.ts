
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const lessons = await prisma.lesson.findMany({
            where: {
                videoUrl: {
                    not: null
                }
            },
            select: {
                id: true,
                title: true,
                videoUrl: true,
                module: {
                    select: {
                        title: true,
                        course: {
                            select: {
                                title: true
                            }
                        }
                    }
                }
            }
        });

        // Filter for non-YouTube/Vimeo videos
        const localVideos = lessons.filter(l => {
            const url = l.videoUrl?.toLowerCase() || "";
            return !url.includes("youtube") && !url.includes("youtu.be") && !url.includes("vimeo");
        });

        return NextResponse.json({
            total: localVideos.length,
            videos: localVideos.map((v: any) => ({
                course: v.module.course.title,
                module: v.module.title,
                lesson: v.title,
                url: v.videoUrl
            }))
        });

    } catch (error) {
        console.error("Audit error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
