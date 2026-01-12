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
            <div className="group h-full flex flex-col bg-white dark:bg-[#1F2937] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-transparent dark:border-gray-800">
                <div className="relative h-48 w-full overflow-hidden shrink-0">
                    {/* Placeholder for image - using a generic div if no real image */}
                    {course.image && course.image !== "/course-placeholder.jpg" ? (
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800">
                            <Video size={40} />
                        </div>
                    )}

                    <div className="absolute top-3 left-3 bg-white/95 text-black text-[10px] font-bold px-3 py-1.5 rounded-full z-10 uppercase tracking-wide shadow-sm">
                        {course.tag}
                    </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-1.5 mb-3">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill="currentColor" className="stroke-none" />
                            ))}
                        </div>
                        <span className="text-gray-400 text-xs font-medium">{course.reviews}</span>
                    </div>

                    <h3 className="text-gray-900 dark:text-white font-extrabold text-xl leading-tight line-clamp-2 mb-2 flex-1 group-hover:text-[#5D5CDE] transition-colors">
                        {course.title}
                    </h3>

                    <div className="w-10 h-1 bg-gray-100 dark:bg-gray-700 rounded-full mb-4 group-hover:bg-[#5D5CDE] transition-colors"></div>

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 font-medium uppercase">Inversión</span>
                            <span className="text-gray-900 dark:text-white font-black text-lg">{course.price}</span>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-white group-hover:bg-[#5D5CDE] group-hover:text-white transition-colors">
                            <Video size={18} />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
