import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const publishedOnly = searchParams.get("published") === "true";

        const whereClause = publishedOnly ? { published: true } : {};

        const courses = await prisma.course.findMany({
            where: whereClause,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                modules: {
                    include: {
                        lessons: {
                            include: {
                                resources: true // Include resources for public view
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json(courses);
    } catch (error) {
        console.error("[COURSES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        console.log("[COURSES_POST] Session:", session?.user?.email, session?.user?.role);

        const userRole = session?.user?.role;

        if (!session || (userRole !== "ADMIN" && userRole !== "INSTRUCTOR")) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { title, description, price, imageUrl } = await req.json();

        if (!title || !price) {
            return new NextResponse("Title and Price are required", { status: 400 });
        }

        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice)) {
            return new NextResponse("Invalid price format", { status: 400 });
        }

        const course = await prisma.course.create({
            data: {
                title,
                description,
                price: parsedPrice,
                imageUrl: imageUrl || null,
                published: false
            },
        });

        return NextResponse.json(course);
    } catch (error: any) {
        console.error("[COURSES_POST]", error);
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}
