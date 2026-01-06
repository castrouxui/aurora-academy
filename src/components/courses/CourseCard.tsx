import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Star, Video } from 'lucide-react';
import Image from 'next/image';

interface CourseProps {
    id?: string;
    title: string;
    instructor: string;
    rating: number;
    reviews: string;
    price: string;
    oldPrice: string;
    image: string;
    tag: string;
}

export function CourseCard({ course }: { course: CourseProps }) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden p-3 shadow-lg hover:translate-y-[-5px] transition-transform duration-300 h-full flex flex-col">
            <div className="relative h-40 w-full mb-3 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                {/* Placeholder for image - using a generic div if no real image */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                    <Video size={40} />
                </div>
                <div className="absolute top-2 left-2 bg-white/90 text-black text-xs font-bold px-2 py-1 rounded-md z-10">
                    {course.tag}
                </div>
                {/* If we had real images: <Image src={course.image} alt={course.title} fill className="object-cover" /> */}
            </div>

            <div className="px-1 flex flex-col flex-1">
                <div className="flex items-center gap-1 mb-2 text-yellow-500 text-xs font-bold">
                    <Star size={14} fill="currentColor" />
                    <span>{course.rating}</span>
                    <span className="text-gray-400 font-normal">{course.reviews}</span>
                </div>

                <h3 className="text-gray-900 font-bold text-base leading-snug line-clamp-2 mb-1 flex-1">
                    {course.title}
                </h3>
                <p className="text-gray-500 text-xs mb-3 truncate">{course.instructor}</p>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-bold">{course.price}</span>
                        <span className="text-gray-400 text-xs line-through">{course.oldPrice}</span>
                    </div>
                    <Button size="sm" variant="ghost" className="h-8 px-2 text-primary hover:text-primary hover:bg-primary/10">
                        Ver más
                    </Button>
                </div>
            </div>
        </div>
    );
}
