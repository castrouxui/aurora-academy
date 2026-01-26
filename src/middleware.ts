import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // Protect Admin Routes
        if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard/courses", req.url));
        }
        // Protect Dashboard Routes (implicit by withAuth, just ensuring roll logic if needed)
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};
