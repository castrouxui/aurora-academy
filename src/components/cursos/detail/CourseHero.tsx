"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
    image?: string; // Kept for interface compatibility but ignored in rendering
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
    level,
    students,
}: CourseHeroProps) {
    const displayDescription = shortDescription || (description && description.length > 220
        ? description.slice(0, 220).trim() + "..."
        : description);

    return (
        <div className="flex flex-col gap-6 md:gap-8 relative z-10">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs font-medium text-gray-400">
                <Link href="/cursos" className="hover:text-white transition-colors">
                    Cursos
                </Link>
                <span>/</span>
                <span className="text-white truncate max-w-[200px]">{title}</span>
            </nav>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight text-shadow-sm">
                {title}
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl font-light">
                {displayDescription}
            </p>

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
                {/* Rating */}
                <div className="flex items-center gap-2 bg-white/[0.08] backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                    <span className="font-bold text-amber-400 text-sm tabular-nums">{rating.toFixed(1)}</span>
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={14} className={star <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-600"} />
                        ))}
                    </div>
                    <span className="text-gray-400 text-xs">({totalRatings})</span>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden relative">
                        <Image src={instructor.image} alt={instructor.name} fill className="object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 leading-none mb-0.5">Instructor</span>
                        <a href="#instructor" className="text-sm font-semibold text-white hover:text-[#5D5CDE] transition-colors leading-none">
                            {instructor.name}
                        </a>
                    </div>
                </div>

                {/* Level Badge */}
                {level && (
                    <span className="text-xs text-gray-300 bg-white/[0.08] border border-white/[0.1] px-3 py-1.5 rounded-full font-medium">
                        {level}
                    </span>
                )}

                {students !== undefined && students > 0 && (
                    <span className="text-xs text-gray-300 font-medium flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {students.toLocaleString()} alumnos
                    </span>
                )}
            </div>
        </div>
    );
}
