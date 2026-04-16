import { NextResponse } from "next/server";

/**
 * Returns a 404 response in production.
 * Use at the top of debug/test API routes.
 */
export function devOnly(): NextResponse | null {
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return null;
}
