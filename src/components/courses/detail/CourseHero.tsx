"use client";

import { Star, Globe, AlertCircle } from "lucide-react";
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
    videoThumbnail: string;
    videoUrl?: string;
}

export function CourseHero({
    title,
    description,
    shortDescription,
    rating,
    totalRatings,
    instructor
}: Omit<CourseHeroProps, 'videoThumbnail' | 'videoUrl'>) {
    return (
        <div className="text-white">
            <div className="space-y-6 max-w-3xl">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[#5D5CDE] font-bold text-xs sm:text-sm mb-4 bg-white/5 w-fit px-3 py-1 rounded-full">
                    <Link href="/courses" className="hover:text-white transition-colors">Cursos</Link>
                    <span className="text-gray-600">/</span>
                    <span className="text-white truncate">{title}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                    {title}
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                    {shortDescription || description}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm pt-4">
                    <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-1 rounded-lg border border-yellow-500/20">
                        <span className="font-bold text-yellow-500 text-lg">{rating}</span>
                        <div className="flex text-yellow-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={16} fill={star <= Math.round(rating) ? "currentColor" : "none"} />
                            ))}
                        </div>
                        <span className="text-yellow-200 ml-1 font-medium">({totalRatings} reseñas)</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-300">
                        <span>Creado por</span>
                        <a href="#" className="font-bold text-white hover:text-[#5D5CDE] transition-colors underline decoration-[#5D5CDE] underline-offset-4">{instructor.name}</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
