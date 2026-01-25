"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Star, Video, CheckCircle, ImageOff } from 'lucide-react';
import { cn, getYouTubeId } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface CourseProps {
    id: string;
    title: string;
    instructor: string;
    rating: number;
    reviews: string;
    price: string;
    oldPrice: string;
    image: string;
    tag: string;
    basePath?: string;
    videoUrl?: string; // New prop for video URL
    type?: 'course' | 'bundle';
}

export function CourseCard({ course, isOwned = false }: { course: CourseProps, isOwned?: boolean }) {
    const href = course.type === 'bundle' ? `/bundles/${course.id}` : (course.basePath ? `${course.basePath}/${course.id}` : `/courses/${course.id}`);

    // Determine Logic for Image
    const initialDesc = course.image;

    const [displayImage, setDisplayImage] = useState<string | null>(initialDesc);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setDisplayImage(course.image);
        setHasError(false);
    }, [course.image]);

    /* 
       Priority:
       1. Custom Image (if uploaded and not placeholder)
       2. YouTube Thumbnail (hqdefault for safety)
       3. Placeholder
    */
    const isCustomImage = displayImage && displayImage !== "/course-placeholder.jpg";
    const youtubeId = course.videoUrl ? getYouTubeId(course.videoUrl) : null;

    let finalImageToRender = displayImage;

    // Fallback logic for initial render if no custom image
    if (!isCustomImage && youtubeId && !hasError) {
        finalImageToRender = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    }

    return (
        <Link href={href} className={cn("block h-full group", isOwned && "pointer-events-none")}>
            <div className={cn(
                "group h-full flex flex-col bg-white/5 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/10 backdrop-blur-sm",
                !isOwned && "hover:-translate-y-2 hover:border-white/20",
                isOwned && "opacity-80 grayscale-[0.5]"
            )}>
                <div className="p-6 flex flex-col flex-1 h-full relative">
                    {/* OWNED BADGE placed inside content since image is gone */}
                    {isOwned && (
                        <div className="absolute top-4 right-4 z-20">
                            <span className="bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20 flex items-center gap-1">
                                <CheckCircle size={12} />
                                Adquirido
                            </span>
                        </div>
                    )}

                    {/* IMAGE CONTAINER */}
                    <div className="relative aspect-video w-full mb-4 rounded-2xl overflow-hidden bg-black/50 shadow-inner group-hover:shadow-[#5D5CDE]/20 transition-all duration-500">
                        <Image
                            src={finalImageToRender || "/course-placeholder.jpg"}
                            alt={course.title}
                            fill
                            className={cn(
                                "object-cover transition-transform duration-700 ease-out group-hover:scale-110",
                                !isCustomImage && "opacity-80"
                            )}
                            onError={() => setHasError(true)}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />

                        {/* OVERLAY GRADIENT */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-[#5D5CDE]/10 text-[#5D5CDE] text-sm font-bold px-2 py-1 rounded uppercase tracking-wide border border-[#5D5CDE]/20">
                            {course.tag}
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400 ml-auto mr-0">
                            <Star size={14} fill="currentColor" className="stroke-none" />
                            <span className="text-gray-400 text-sm font-medium ml-1">({course.reviews})</span>
                        </div>
                    </div>

                    <h3 className="text-white font-bold text-xl leading-tight line-clamp-2 mb-3 flex-1 group-hover:text-[#5D5CDE] transition-colors">
                        {course.title}
                    </h3>

                    <div className="w-12 h-1 bg-white/10 rounded-full mb-5 group-hover:bg-[#5D5CDE] transition-colors"></div>

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-1">Inversión</span>
                            <span className="text-white font-black text-xl">{course.price}</span>
                        </div>
                        <div className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center text-white transition-all shadow-lg",
                            isOwned ? "bg-emerald-500/20 text-emerald-500" : "bg-white/10 group-hover:bg-[#5D5CDE] group-hover:scale-110"
                        )}>
                            {isOwned ? <CheckCircle size={18} /> : <Video size={18} />}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
