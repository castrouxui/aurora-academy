"use client";

import { Star, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

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
    level,
    students,
}: CourseHeroProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Logic: Use description. If shortDescription exists, use it as fallback? 
    // Usually full description is what we truncate.
    const textToShow = description || shortDescription || "";

    // Only show toggle if text is long
    const isLongText = textToShow.length > 150;

    return (
        <div className="flex flex-col gap-6 md:gap-8 relative z-10 w-full">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs font-medium text-gray-400">
                <Link href="/cursos" className="hover:text-white transition-colors">
                    Cursos
                </Link>
                <span>/</span>
                <span className="text-white truncate max-w-[200px]">{title}</span>
            </nav>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight text-shadow-sm">
                {title}
            </h1>

            {/* Description with Truncation */}
            <div className="max-w-2xl relative">
                <p
                    className={`text-lg md:text-xl text-gray-200 leading-relaxed font-light transition-all duration-300 ${!isExpanded ? 'line-clamp-2 md:line-clamp-2' : ''}`}
                >
                    {textToShow}
                </p>
                {isLongText && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-2 text-[#5D5CDE] text-sm font-bold hover:text-[#4B4AC0] transition-colors flex items-center gap-1 focus:outline-none"
                    >
                        {isExpanded ? (
                            <>Ver menos <ChevronUp size={14} /></>
                        ) : (
                            <>Ver más <ChevronDown size={14} /></>
                        )}
                    </button>
                )}
            </div>

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
