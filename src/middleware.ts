import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req: NextRequestWithAuth) {
        // Protect Admin Routes
        // Casting to any to avoid build-time type resolution issues on Vercel
        const token = req.nextauth.token as any;
        const userRole = token?.role;

        if (req.nextUrl.pathname.startsWith("/admin") && userRole !== "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard/cursos", req.url));
        }
        // Protect Dashboard Routes (implicit by withAuth, just ensuring roll logic if needed)
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        secret: process.env.NEXTAUTH_SECRET,
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};
