import Link from 'next/link';
import { Star, Video } from 'lucide-react';
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
}

export function CourseCard({ course }: { course: CourseProps }) {
    const href = course.basePath ? `${course.basePath}/${course.id}` : `/courses/${course.id}`;

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
        <Link href={href} className="block h-full group">
            <div className="group h-full flex flex-col bg-white/5 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/10 hover:border-white/20 backdrop-blur-sm">
                <div className="relative h-48 w-full overflow-hidden shrink-0">
                    {/* Image Display Logic */}
                    {displayImage && displayImage !== "/course-placeholder.jpg" ? (
                        <img src={displayImage} alt={course.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
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
                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-[#5D5CDE] group-hover:scale-110 transition-all shadow-lg">
                            <Video size={18} />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
