export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const userRole = session?.user?.role;

        if (!session || userRole !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { title, description, price, imageUrl, published, courseIds } = await req.json();

        if (!title || !price) {
            return new NextResponse("Title and price are required", { status: 400 });
        }

        const bundle = await prisma.bundle.create({
            data: {
                title,
                description,
                price: parseFloat(price),
                imageUrl,
                published: published || false,
                courses: {
                    connect: courseIds?.map((id: string) => ({ id })) || []
                }
            }
        });

        return NextResponse.json(bundle);
    } catch (error) {
        console.error("[BUNDLES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        // Public endpoint mostly, but maybe filter if not admin? 
        // For now, return all published, or all if admin?
        // Let's mirror courses logic: usually return all for admin list, or filtered for public.
        // For simplicity now, return all and let frontend filter.

        const bundles = await prisma.bundle.findMany({
            include: {
                courses: {
                    select: {
                        id: true,
                        title: true,
                        price: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(bundles);
    } catch (error) {
        console.error("[BUNDLES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
