"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function TopBanner() {
    // Logic to hide banner if user owns the course
    const { data: session } = useSession();
    const [isVisible, setIsVisible] = useState(true);
    const COURSE_ID = "cml05hq7n00025z0eogogsnge"; // El camino del inversor

    useEffect(() => {
        async function checkOwnership() {
            if (!session?.user) return;

            try {
                // Determine if we should hide it.
                // We can't easily check 'purchases' without an API call.
                // Using /api/my-courses which returns the list of owned courses.
                const res = await fetch("/api/my-courses");
                if (res.ok) {
                    const courses = await res.json();
                    const hasCourse = courses.some((c: any) => c.id === COURSE_ID);
                    if (hasCourse) {
                        setIsVisible(false);
                    }
                }
            } catch (error) {
                console.error("Failed to check banner visibility", error);
            }
        }

        checkOwnership();
    }, [session]);

    if (!isVisible) return null;

    return (
        <div className="w-full bg-[#5D5CDE] text-white py-2 px-4 relative z-[501]">
            <div className="container mx-auto flex items-center justify-center gap-2 text-center text-xs md:text-sm font-bold tracking-wide">
                <Link
                    href={`/cursos/${COURSE_ID}`}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                    <span>
                        Registrate en &apos;El camino del inversor&apos; totalmente GRATIS (100% OFF)
                    </span>
                    <ArrowRight size={14} className="animate-pulse" />
                </Link>
            </div>
        </div>
    );
}
