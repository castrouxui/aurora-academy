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
    instructor,
    image
}: Omit<CourseHeroProps, 'videoThumbnail' | 'videoUrl'> & { image?: string }) {
    return (
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                {image && (
                    <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover opacity-50"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/90 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 md:p-12 text-white">
                <div className="space-y-6 max-w-3xl">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-[#5D5CDE] font-bold text-xs sm:text-sm mb-4 bg-black/40 backdrop-blur-md w-fit px-3 py-1 rounded-full border border-white/5">
                        <Link href="/cursos" className="hover:text-white transition-colors">Cursos</Link>
                        <span className="text-gray-500">/</span>
                        <span className="text-white truncate max-w-[200px]">{title}</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight drop-shadow-xl">
                        {title}
                    </h1>
                    <p className="text-base md:text-xl text-gray-200 leading-relaxed max-w-2xl drop-shadow-md">
                        {shortDescription || description}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 text-sm pt-4">
                        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 shadow-lg">
                            <span className="font-bold text-yellow-500 text-lg">{rating}</span>
                            <div className="flex text-yellow-500">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} size={16} fill={star <= Math.round(rating) ? "currentColor" : "none"} />
                                ))}
                            </div>
                            <span className="text-gray-300 ml-1 font-medium">({totalRatings} reseñas)</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-200 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 shadow-lg">
                            <span>Creado por</span>
                            <a href="#" className="font-bold text-white hover:text-[#5D5CDE] transition-colors underline decoration-[#5D5CDE] underline-offset-4">{instructor.name}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
