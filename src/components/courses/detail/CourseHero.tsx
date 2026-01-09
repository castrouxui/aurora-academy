"use client";

import { Star, Globe, AlertCircle, Play } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VideoPlayer } from "@/components/player/VideoPlayer";

interface CourseHeroProps {
    title: string;
    description: string;
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
    rating,
    totalRatings,
    instructor,
    videoThumbnail,
    videoUrl
}: CourseHeroProps) {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    return (
        <div className="text-white">
            <div className="space-y-4 max-w-3xl">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-primary font-medium text-sm mb-4">
                    <Link href="/courses" className="hover:underline">Cursos</Link>
                    <span>&gt;</span>
                    <Link href="/courses" className="hover:underline">Trading</Link>
                    <span>&gt;</span>
                    <span className="text-gray-400 truncate">{title}</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                    {title}
                </h1>
                <p className="text-lg text-gray-300">
                    {description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-yellow-400">
                        <span className="font-bold text-base">{rating}</span>
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={14} fill={star <= Math.round(rating) ? "currentColor" : "none"} className={star <= Math.round(rating) ? "text-yellow-400" : "text-gray-600"} />
                            ))}
                        </div>
                        <span className="underline ml-1 text-primary cursor-pointer">({totalRatings} reseñas)</span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                    <span>Creado por <a href="#" className="text-primary underline">{instructor.name}</a></span>
                </div>
            </div>

            {/* Video Player Preview Trigger */}
            <div
                className="mt-8 relative aspect-video rounded-xl overflow-hidden bg-black group cursor-pointer border border-gray-800 shadow-2xl"
                onClick={() => setIsPreviewOpen(true)}
            >
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${videoThumbnail})` }}></div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="text-black ml-1" size={40} />
                    </div>
                </div>
                <div className="absolute bottom-6 left-0 right-0 text-center font-bold text-white text-lg">
                    Vista previa de este curso
                </div>
            </div>

            {/* Preview Modal */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="sm:max-w-4xl p-0 bg-black border-gray-800 overflow-hidden">
                    <div className="aspect-video w-full">
                        {/* We import VideoPlayer dynamically or use it directly if it's client-side compatible */}
                        {videoUrl ? (
                            <VideoPlayer
                                url={videoUrl}
                                thumbnail={videoThumbnail}
                                title={`Vista Previa: ${title}`}
                                isLocked={false}
                                previewMode={true} // Enforce 30s limit
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-white">
                                Video no disponible
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
