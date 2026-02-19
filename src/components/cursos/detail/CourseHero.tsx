"use client";

import { Star } from "lucide-react";
import Link from "next/link";

interface CourseHeroProps {
    title: string;
    description: string;
    shortDescription?: string;
    rating: number;
    totalRatings: number;
    instructor: {
        name: string;
        image: string;
    };
    image?: string;
    level?: string;
    students?: number;
}

export function CourseHero({
    title,
    description,
    shortDescription,
    rating,
    totalRatings,
    instructor,
    image,
    level,
    students,
}: CourseHeroProps) {
    // Use shortDescription, or truncate long description
    const displayDescription = shortDescription || (description && description.length > 180
        ? description.slice(0, 180).trim() + "..."
        : description);

    return (
        <section className="relative w-full overflow-hidden">
            {/* Background image with overlay */}
            <div className="absolute inset-0">
                {image && (
                    <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover opacity-20"
                        aria-hidden="true"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19]/80 via-[#0B0F19]/95 to-[#0B0F19]" />
            </div>

            {/* Content — contained and padded */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-16 md:pt-16 md:pb-20">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs font-medium mb-8">
                    <Link href="/cursos" className="text-[#5D5CDE] hover:text-white transition-colors">
                        Cursos
                    </Link>
                    <span className="text-gray-700">/</span>
                    <span className="text-gray-500 truncate max-w-[260px]">{title}</span>
                </nav>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.08] tracking-tight text-white max-w-3xl mb-5">
                    {title}
                </h1>

                {/* Short description — max 2 lines */}
                <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl mb-8 line-clamp-3">
                    {displayDescription}
                </p>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    {/* Rating */}
                    <div className="flex items-center gap-1.5">
                        <span className="font-bold text-amber-400 text-sm tabular-nums">{rating.toFixed(1)}</span>
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={13} className={star <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-700"} />
                            ))}
                        </div>
                        <span className="text-gray-600 text-xs">({totalRatings})</span>
                    </div>

                    <span className="w-px h-4 bg-white/10" />

                    {/* Instructor */}
                    <span className="text-gray-500 text-sm">
                        Creado por{" "}
                        <a href="#instructor" className="text-white font-semibold hover:text-[#5D5CDE] transition-colors">
                            {instructor.name}
                        </a>
                    </span>

                    {level && (
                        <>
                            <span className="w-px h-4 bg-white/10" />
                            <span className="text-xs text-gray-500 bg-white/[0.06] border border-white/[0.08] px-2.5 py-1 rounded-full font-medium">
                                {level}
                            </span>
                        </>
                    )}

                    {students !== undefined && students > 0 && (
                        <>
                            <span className="w-px h-4 bg-white/10" />
                            <span className="text-xs text-gray-500 font-medium">
                                {students.toLocaleString()} estudiantes
                            </span>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
