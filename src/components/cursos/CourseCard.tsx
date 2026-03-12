"use client";

import Link from 'next/link';
import Image from 'next/image';
import { cn, getYouTubeId } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { MoveRight } from 'lucide-react';

interface CourseProps {
    id: string;
    title: string;
    price: string;
    image: string;
    tag: string;
    basePath?: string;
    videoUrl?: string;
    rawPrice?: number;
    type?: string;
}

export function CourseCard({ course, isOwned = false }: { course: CourseProps, isOwned?: boolean }) {
    const href = course.type === 'bundle' ? `/bundles/${course.id}` : (course.basePath ? `${course.basePath}/${course.id}` : `/cursos/${course.id}`);

    const initialDesc = course.image;
    const [displayImage, setDisplayImage] = useState<string | null>(initialDesc);
    const [ytQuality, setYtQuality] = useState<'maxresdefault' | 'hqdefault'>('maxresdefault');
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setDisplayImage(course.image);
        setYtQuality('maxresdefault');
        setHasError(false);
    }, [course.image]);

    const isCustomImage = displayImage && displayImage !== "/course-placeholder.jpg";
    const youtubeId = course.videoUrl ? getYouTubeId(course.videoUrl) : null;
    const isFree = course.rawPrice === 0;

    let finalImageToRender = displayImage;

    if (!isCustomImage && youtubeId && !hasError) {
        finalImageToRender = `https://img.youtube.com/vi/${youtubeId}/${ytQuality}.jpg`;
    }

    return (
        <Link href={href} className={cn("block group h-full", isOwned && "pointer-events-none")}>
            <div className={cn(
                "group h-full flex flex-col overflow-hidden bento-card relative z-10",
                isOwned && "opacity-60 grayscale shadow-none border-border hover:translate-y-0"
            )}>
                {/* Image Container with inner shadow/tech feel */}
                <div className="relative aspect-[16/10] w-full bg-muted overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10" />
                    <Image
                        src={finalImageToRender || "/course-placeholder.jpg"}
                        alt={course.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={() => {
                            if (ytQuality === 'maxresdefault') {
                                setYtQuality('hqdefault');
                            } else {
                                setHasError(true);
                            }
                        }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Floating Tech Badges over image */}
                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-primary text-primary-foreground px-2.5 py-1.5 rounded-md shadow-lg">
                            {course.tag}
                        </span>
                        {course.type && course.type !== 'bundle' && (
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-background/80 text-foreground backdrop-blur-md px-2 py-1.5 rounded-md border border-border">
                                {course.type}
                            </span>
                        )}
                    </div>

                    {isOwned && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm z-30">
                            <span className="text-foreground font-bold text-sm tracking-widest uppercase border border-border px-4 py-2 rounded-md">Tu Curso</span>
                        </div>
                    )}
                </div>

                {/* Tech Content */}
                <div className="p-5 md:p-6 flex flex-col flex-1 h-full relative z-20 -mt-6 bg-card border-t border-border rounded-t-xl transition-colors">
                    <h3 className="text-foreground font-black text-[20px] md:text-[22px] leading-tight mb-3 flex-1 group-hover:text-primary transition-colors pr-4 relative">
                        {course.title}
                    </h3>

                    {/* Footer: Price tech block */}
                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-border/50">
                        <div className="flex flex-col">
                            {isFree ? (
                                <span className="text-emerald-400 font-black text-xl uppercase tracking-wide">Gratis</span>
                            ) : (
                                <span className="text-foreground font-black text-xl">{course.price}</span>
                            )}
                        </div>

                        <div className="flex items-center gap-2 text-sm font-bold text-primary group-hover:text-primary/80 transition-colors">
                            <span>Ver Curso</span>
                            <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
