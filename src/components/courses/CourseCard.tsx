import Link from 'next/link';
import Image from 'next/image';
import { Star, Video, CheckCircle } from 'lucide-react';
import { cn, getYouTubeId } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

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
    basePath?: string; // Optional base path for link
    videoUrl?: string; // New prop for video URL
    type?: 'course' | 'bundle';
}

export function CourseCard({ course, isOwned = false }: { course: CourseProps, isOwned?: boolean }) {
    const href = course.type === 'bundle' ? `/bundles/${course.id}` : (course.basePath ? `${course.basePath}/${course.id}` : `/courses/${course.id}`);

    // Determine Logic for Image
    let displayImage = course.image;
    /* 
       Priority:
       1. Custom Image (if uploaded and not placeholder)
       2. YouTube Thumbnail (hqdefault for safety)
       3. Placeholder
    */
    const isCustomImage = displayImage && displayImage !== "/course-placeholder.jpg";
    const youtubeId = course.videoUrl ? getYouTubeId(course.videoUrl) : null;

    if (!isCustomImage && youtubeId) {
        // Use hqdefault because maxresdefault is seemingly missing for some videos (gray screen)
        displayImage = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    }

    return (
        <Link href={href} className={cn("block h-full group", isOwned && "pointer-events-none")}>
            <div className={cn(
                "group h-full flex flex-col bg-white/5 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/10 backdrop-blur-sm",
                !isOwned && "hover:-translate-y-2 hover:border-white/20",
                isOwned && "opacity-80 grayscale-[0.5]"
            )}>
                <div className="relative h-48 w-full overflow-hidden shrink-0">
                    {/* OWNED BADGE */}
                    {isOwned && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                            <span className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-black text-sm uppercase tracking-wider shadow-xl border border-emerald-400/50 flex items-center gap-2">
                                <CheckCircle size={16} />
                                Ya lo tenés
                            </span>
                        </div>
                    )}

                    {/* Image Display Logic */}
                    {displayImage && displayImage !== "/course-placeholder.jpg" ? (
                        <Image
                            src={displayImage}
                            alt={course.title}
                            fill
                            className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 300px"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-[#0B0F19]">
                            <Video size={40} />
                        </div>
                    )}

                    <div className="absolute top-3 left-3 bg-[#5D5CDE] text-white text-[10px] font-bold px-3 py-1.5 rounded-full z-10 uppercase tracking-wide shadow-lg">
                        {course.tag}
                    </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-1.5 mb-4">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill="currentColor" className="stroke-none" />
                            ))}
                        </div>
                        <span className="text-gray-400 text-xs font-medium">({course.reviews} reseñas)</span>
                    </div>

                    <h3 className="text-white font-bold text-xl leading-tight line-clamp-2 mb-3 flex-1 group-hover:text-[#5D5CDE] transition-colors">
                        {course.title}
                    </h3>

                    <div className="w-12 h-1 bg-white/10 rounded-full mb-5 group-hover:bg-[#5D5CDE] transition-colors"></div>

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Inversión</span>
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
