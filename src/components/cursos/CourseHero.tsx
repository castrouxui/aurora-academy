import Link from "next/link";
import { Star, AlertCircle, Globe } from "lucide-react";

interface CourseHeroProps {
    title: string;
    description: string;
    rating: number;
    reviews: string;
    students: string;
    lastUpdated: string;
    language: string;
}

export function CourseHero({ title, description, rating, reviews, students, lastUpdated, language }: CourseHeroProps) {
    return (
        <div className="bg-[#1F2937] text-white py-8 md:py-12">
            <div className="container mx-auto px-4 lg:flex gap-8">
                <div className="lg:w-2/3 space-y-4">
                    {/* Breadcrumbs */}
                    <div className="text-sm text-gray-400 mb-4 flex gap-2">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/courses" className="hover:text-primary transition-colors">Cursos</Link>
                        <span>/</span>
                        <span className="text-white truncate max-w-[200px]">{title}</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold leading-tight">{title}</h1>
                    <p className="text-lg text-gray-300 leading-relaxed">{description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-yellow-500 font-bold">
                            <span className="bg-yellow-500/10 px-2 py-0.5 rounded text-yellow-500 text-xs">Bestseller</span>
                            <span className="ml-2">{rating}</span>
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} size={14} fill={star <= Math.round(rating) ? "currentColor" : "none"} />
                                ))}
                            </div>
                        </div>
                        <span className="text-primary underline cursor-pointer">({reviews} valoraciones)</span>
                        <span>{students} estudiantes</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-white">
                        <div className="flex items-center gap-1">
                            <AlertCircle size={16} />
                            <span>Última actualización: {lastUpdated}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Globe size={16} />
                            <span>{language}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
