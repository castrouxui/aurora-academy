import { ChevronDown, PlayCircle, FileText, Lock } from "lucide-react";

const curriculum = [
    {
        title: "Introducción al Trading",
        lessons: [
            { title: "Bienvenida al curso", duration: "02:15", type: "video", free: true },
            { title: "¿Qué es el mercado financiero?", duration: "05:30", type: "video", free: true },
            { title: "Glosario básico", duration: "10:00", type: "article", free: false },
        ]
    },
    {
        title: "Análisis Técnico Básico",
        lessons: [
            { title: "Velas Japonesas", duration: "12:45", type: "video", free: false },
            { title: "Soportes y Resistencias", duration: "15:20", type: "video", free: false },
            { title: "Tendencias", duration: "08:10", type: "video", free: false },
        ]
    },
    {
        title: "Psicología del Trading",
        lessons: [
            { title: "Gestión de emociones", duration: "20:00", type: "video", free: false },
            { title: "El plan de trading", duration: "14:50", type: "video", free: false },
        ]
    }
];

export function CurriculumList() {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contenido del curso</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                15 secciones • 105 clases • 12h 30m de duración total
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                {curriculum.map((module, i) => (
                    <div key={i} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left">
                            <div className="flex items-center gap-3 font-semibold text-gray-900 dark:text-white">
                                <ChevronDown size={20} />
                                {module.title}
                            </div>
                            <span className="text-sm text-gray-500">{module.lessons.length} clases</span>
                        </button>
                        <div className="bg-white dark:bg-[#0B0F19]">
                            {module.lessons.map((lesson, j) => (
                                <div key={j} className="flex items-center justify-between p-3 pl-12 hover:bg-gray-50 dark:hover:bg-[#1F2937]/50 transition-colors">
                                    <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                                        {lesson.type === 'video' ? <PlayCircle size={16} /> : <FileText size={16} />}
                                        <span className={lesson.free ? "text-primary font-medium" : ""}>{lesson.title}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        {lesson.free && <span className="text-primary font-bold">Vista previa</span>}
                                        <span>{lesson.duration}</span>
                                        {!lesson.free && <Lock size={12} />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
