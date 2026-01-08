import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MyCourseCardProps {
    id: string;
    title: string;
    image: string;
    author: string;
    progress: number; // 0 to 100
    lastLesson?: string;
}

export function MyCourseCard({
    id,
    title,
    image,
    author,
    progress,
    lastLesson = "Introducción al Curso"
}: MyCourseCardProps) {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-800 bg-[#121620] transition-all hover:border-gray-700 hover:shadow-2xl">
            {/* Image Section */}
            <div className="relative aspect-video w-full overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="rounded-full bg-primary/90 p-3 text-white shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                        <PlayCircle size={32} fill="currentColor" className="text-white" />
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-1 flex-col p-5">
                <div className="mb-4 flex-1">
                    <h3 className="mb-1 text-lg font-bold text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-400">{author}</p>
                </div>

                {/* Progress Section */}
                <div className="space-y-3">
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>{progress}% completado</span>
                        {/* Optional: Add logic for "Not started" vs "In progress" */}
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-orange-400 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Last Lesson Hint */}
                    {progress > 0 && progress < 100 && (
                        <p className="text-xs text-gray-500 truncate">
                            Continuar: <span className="text-gray-300">{lastLesson}</span>
                        </p>
                    )}

                    <Link href={`/learn/${id}`} className="block w-full">
                        <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium group-hover:bg-primary group-hover:text-white transition-all">
                            {progress === 0 ? "Comenzar Curso" : "Continuar Viendo"}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
