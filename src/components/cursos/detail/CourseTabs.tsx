"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, PlayCircle, Check, FileText, Target, TrendingUp, LayoutList, Sparkles } from "lucide-react";
import { generateCourseOutcomes } from "@/actions/generate-course-outcomes";

interface CourseTabsProps {
    modules: any[];
    totalLessons: number;
    totalModules: number;
    duration: string;
    description: string;
    learningOutcomes?: string;
    title: string;
}

export function CourseTabs({ modules = [], totalLessons, totalModules, duration, description, learningOutcomes, title }: CourseTabsProps) {
    const [aiOutcomes, setAiOutcomes] = useState<string[]>([]);
    const [isLoadingAI, setIsLoadingAI] = useState(false);

    // Initial parsing of manual outcomes
    const manualPoints = learningOutcomes ? learningOutcomes.split('\n').filter(line => line.trim() !== '') : [];

    // Determine what to show: Manual > AI > Description fallback
    const displayPoints = manualPoints.length > 0 ? manualPoints : aiOutcomes;
    const showDescriptionFallback = displayPoints.length === 0 && !isLoadingAI;

    useEffect(() => {
        // If no manual outcomes, try to generate
        if (manualPoints.length === 0 && title && description) {
            setIsLoadingAI(true);
            generateCourseOutcomes(title, description)
                .then((outcomes) => {
                    if (outcomes && outcomes.length > 0) {
                        setAiOutcomes(outcomes);
                    }
                })
                .catch(console.error)
                .finally(() => setIsLoadingAI(false));
        }
    }, [title, description, manualPoints.length]);

    // Description bullets: Max 4
    // We'll simulate bullet points from the description if standard prose
    const descBullets = [
        "Aprenderás los fundamentos clave para dominar este tema.",
        "Desarrollarás habilidades prácticas aplicables de inmediato.",
        "Entenderás cómo evitar los errores más comunes.",
        description ? description.slice(0, 60) + "..." : "Obtendrás una base sólida para seguir creciendo."
    ].slice(0, 4);

    return (
        <div className="space-y-24 md:space-y-32">
            {/* Three-block description structure — equal height */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                {/* Block 1: Para quién es */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8 space-y-6 hover:border-white/[0.1] transition-colors flex flex-col">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-[#5D5CDE]/10 rounded-xl">
                            <Target size={20} className="text-[#5D5CDE]" />
                        </div>
                        <h3 className="text-lg font-bold text-white font-headings">¿Para quién es?</h3>
                    </div>
                    <ul className="space-y-4 text-sm text-gray-400 leading-relaxed flex-1">
                        <li className="flex items-start gap-3">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#5D5CDE] shrink-0 shadow-[0_0_8px_rgba(93,92,222,0.5)]" />
                            <span>Personas que quieren aprender a invertir desde cero.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#5D5CDE] shrink-0 shadow-[0_0_8px_rgba(93,92,222,0.5)]" />
                            <span>Quienes buscan entender cómo funcionan los mercados.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#5D5CDE] shrink-0 shadow-[0_0_8px_rgba(93,92,222,0.5)]" />
                            <span>Cualquier persona con ganas de tomar el control.</span>
                        </li>
                    </ul>
                </div>

                {/* Block 2: Qué vas a lograr (AI Powered) */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8 space-y-6 hover:border-white/[0.1] transition-colors flex flex-col relative overflow-hidden group">
                    {/* AI Glow Effect */}
                    {displayPoints === aiOutcomes && aiOutcomes.length > 0 && (
                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                            <Sparkles className="text-amber-400 animate-pulse" size={24} />
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-[#5D5CDE]/10 rounded-xl">
                            <TrendingUp size={20} className="text-[#5D5CDE]" />
                        </div>
                        <h3 className="text-lg font-bold text-white font-headings">¿Qué vas a lograr?</h3>
                    </div>
                    <div className="flex-1">
                        {isLoadingAI ? (
                            <div className="space-y-3 animate-pulse">
                                <div className="h-4 bg-white/5 rounded w-3/4" />
                                <div className="h-4 bg-white/5 rounded w-1/2" />
                                <div className="h-4 bg-white/5 rounded w-5/6" />
                            </div>
                        ) : displayPoints.length > 0 ? (
                            <ul className="space-y-4 text-sm text-gray-400 leading-relaxed">
                                {displayPoints.slice(0, 4).map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="mt-0.5 p-0.5 bg-[#5D5CDE]/20 rounded-full shrink-0">
                                            <Check size={12} className="text-[#5D5CDE]" />
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500 leading-relaxed line-clamp-5">
                                {description || "Desarrollar habilidades prácticas aplicables de inmediato."}
                            </p>
                        )}
                    </div>
                </div>

                {/* Block 3: Cómo está estructurado */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8 space-y-6 hover:border-white/[0.1] transition-colors flex flex-col">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-[#5D5CDE]/10 rounded-xl">
                            <LayoutList size={20} className="text-[#5D5CDE]" />
                        </div>
                        <h3 className="text-lg font-bold text-white font-headings">Estructura</h3>
                    </div>
                    <div className="space-y-0 flex-1 flex flex-col justify-center">
                        {[
                            { label: "Secciones", value: totalModules },
                            { label: "Clases", value: totalLessons },
                            { label: "Duración total", value: duration },
                            { label: "Formato", value: "On-demand" },
                        ].map((row, i) => (
                            <div key={i} className={`flex items-center justify-between text-sm py-3.5 ${i < 3 ? "border-b border-white/[0.04]" : ""}`}>
                                <span className="text-gray-500">{row.label}</span>
                                <span className="font-semibold text-white text-sm">{row.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Course Content Accordion */}
            <div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-8 font-headings tracking-tight">Contenido del curso</h2>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-8">
                    <span className="bg-white/[0.04] border border-white/[0.06] px-4 py-2 rounded-full font-medium tracking-wide text-gray-300">{totalModules} SECCIONES</span>
                    <span className="bg-white/[0.04] border border-white/[0.06] px-4 py-2 rounded-full font-medium tracking-wide text-gray-300">{totalLessons} CLASES</span>
                    <span className="bg-white/[0.04] border border-white/[0.06] px-4 py-2 rounded-full font-medium tracking-wide text-gray-300">{duration.toUpperCase()}</span>
                </div>
                {/* Accordions */}
                <div className="space-y-4">
                    {modules.map((module, index) => (
                        <div key={module.id} className="border border-white/[0.06] rounded-2xl overflow-hidden bg-white/[0.015]">
                            <ModuleAccordion key={module.id} module={module} defaultOpen={index === 0} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ModuleAccordion({ module, defaultOpen = false }: { module: any; defaultOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const totalModuleDuration = module.lessons?.reduce((acc: number, lesson: any) => acc + (lesson.duration || 0), 0) || 0;
    const moduleMins = Math.floor(totalModuleDuration / 60);
    const moduleHrs = Math.floor(moduleMins / 60);
    const remainingMins = moduleMins % 60;

    let durationLabel = "";
    if (moduleHrs > 0) {
        durationLabel = `${moduleHrs}h ${remainingMins > 0 ? `${remainingMins}m` : ""}`;
    } else if (moduleMins > 0) {
        durationLabel = `${moduleMins} min`;
    }

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left px-6 py-5 flex justify-between items-center hover:bg-white/[0.025] transition-colors group"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${isOpen ? "border-[#5D5CDE] bg-[#5D5CDE]/10 text-[#5D5CDE]" : "border-white/10 bg-white/5 text-gray-500"}`}>
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    <span className={`font-semibold text-base transition-colors ${isOpen ? "text-white" : "text-gray-400 group-hover:text-gray-200"}`}>{module.title}</span>
                </div>
                <span className="text-xs text-gray-600 font-medium tabular-nums hidden sm:block">
                    {module.lessons?.length || 0} clases • {durationLabel || "0m"}
                </span>
            </button>
            {isOpen && (
                <div className="px-6 pb-6 pt-2 space-y-1">
                    {module.lessons && module.lessons.length > 0 ? (
                        module.lessons.map((lesson: any) => (
                            <div key={lesson.id} className="flex justify-between items-center py-3 px-4 text-gray-400 hover:text-white transition-all rounded-xl hover:bg-white/[0.04] group cursor-default">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    {lesson.videoUrl ?
                                        <PlayCircle size={16} className="text-[#5D5CDE] shrink-0 group-hover:scale-110 transition-transform" /> :
                                        <FileText size={16} className="text-gray-600 shrink-0" />
                                    }
                                    <span className="text-sm truncate">{lesson.title}</span>
                                </div>
                                {lesson.duration > 0 && (
                                    <span className="text-xs font-mono text-gray-600 tabular-nums shrink-0 ml-4 group-hover:text-gray-500">
                                        {Math.floor(lesson.duration / 60)}:{Math.floor(lesson.duration % 60).toString().padStart(2, '0')}
                                    </span>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-gray-700 italic px-4 py-2">No hay lecciones.</div>
                    )}
                </div>
            )}
        </div>
    );
}
