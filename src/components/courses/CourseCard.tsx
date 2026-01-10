import Link from 'next/link';
import { Star, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
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
}

export function CourseCard({ course }: { course: CourseProps }) {
    const href = course.basePath ? `${course.basePath}/${course.id}` : `/courses/${course.id}`;
    return (
        <Link href={href} className="block h-full group">
            <div className="bg-white rounded-2xl overflow-hidden p-3 shadow-lg hover:translate-y-[-5px] transition-transform duration-300 h-full flex flex-col border border-transparent hover:border-primary/20">
                <div className="relative h-40 w-full mb-3 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                    {/* Placeholder for image - using a generic div if no real image */}
                    {course.image && course.image !== "/course-placeholder.jpg" ? (
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                            <Video size={40} />
                        </div>
                    )}

                    <div className="absolute top-2 left-2 bg-white/90 text-black text-xs font-bold px-2 py-1 rounded-md z-10">
                        {course.tag}
                    </div>
                </div>

                <div className="px-1 flex flex-col flex-1">
                    <div className="flex items-center gap-1 mb-2 text-yellow-500 text-xs font-bold">
                        <Star size={14} fill="currentColor" />
                        <span>{course.rating}</span>
                        <span className="text-gray-400 font-normal">{course.reviews}</span>
                    </div>

                    <h3 className="text-gray-900 font-bold text-base leading-snug line-clamp-2 mb-1 flex-1 group-hover:text-primary transition-colors">
                        {course.title}
                    </h3>
                    <p className="text-gray-500 text-xs mb-3 truncate">{course.instructor}</p>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-bold">{course.price}</span>
                        </div>
                        <div className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 px-2 text-primary hover:text-primary hover:bg-primary/10 pointer-events-none")}>
                            Ver más
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
