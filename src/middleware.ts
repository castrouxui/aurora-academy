import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req: NextRequestWithAuth) {
        // Protect Admin Routes
        // Explicitly check role exists on token to avoid TS errors
        const token = req.nextauth.token;
        const userRole = token?.role;

        if (req.nextUrl.pathname.startsWith("/admin") && userRole !== "ADMIN") {
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
