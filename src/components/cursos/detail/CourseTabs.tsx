"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, PlayCircle, Check, FileText, Target, TrendingUp, LayoutList } from "lucide-react";

interface CourseTabsProps {
    modules: any[];
    totalLessons: number;
    totalModules: number;
    duration: string;
    description: string;
    learningOutcomes?: string;
}

export function CourseTabs({ modules = [], totalLessons, totalModules, duration, description, learningOutcomes }: CourseTabsProps) {
    const learningPoints = learningOutcomes ? learningOutcomes.split('\n').filter(line => line.trim() !== '') : [];

    return (
        <div className="space-y-14 md:space-y-16">
            {/* Three-block description structure — equal height */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
                {/* Block 1: Para quién es */}
                <div className="bg-white/[0.025] border border-white/[0.06] rounded-xl p-6 space-y-4 hover:border-white/[0.1] transition-colors flex flex-col">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-[#5D5CDE]/10 rounded-lg">
                            <Target size={18} className="text-[#5D5CDE]" />
                        </div>
                        <h3 className="text-base font-bold text-white">¿Para quién es?</h3>
                    </div>
                    <ul className="space-y-3 text-sm text-gray-400 leading-relaxed flex-1">
                        <li className="flex items-start gap-2.5">
                            <div className="mt-1.5 w-1 h-1 rounded-full bg-[#5D5CDE] shrink-0" />
                            <span>Personas que quieren aprender a invertir desde cero, sin experiencia previa</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                            <div className="mt-1.5 w-1 h-1 rounded-full bg-[#5D5CDE] shrink-0" />
                            <span>Quienes buscan entender cómo funcionan los mercados financieros</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                            <div className="mt-1.5 w-1 h-1 rounded-full bg-[#5D5CDE] shrink-0" />
                            <span>Cualquier persona con ganas de tomar decisiones informadas sobre su dinero</span>
                        </li>
                    </ul>
                </div>

                {/* Block 2: Qué vas a lograr */}
                <div className="bg-white/[0.025] border border-white/[0.06] rounded-xl p-6 space-y-4 hover:border-white/[0.1] transition-colors flex flex-col">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-[#5D5CDE]/10 rounded-lg">
                            <TrendingUp size={18} className="text-[#5D5CDE]" />
                        </div>
                        <h3 className="text-base font-bold text-white">¿Qué vas a lograr?</h3>
                    </div>
                    <div className="flex-1">
                        {learningPoints.length > 0 ? (
                            <ul className="space-y-3 text-sm text-gray-400 leading-relaxed">
                                {learningPoints.slice(0, 4).map((item, i) => (
                                    <li key={i} className="flex items-start gap-2.5">
                                        <div className="mt-0.5 p-0.5 bg-[#5D5CDE]/20 rounded-full shrink-0">
                                            <Check size={10} className="text-[#5D5CDE]" />
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500 leading-relaxed line-clamp-5">
                                {description
                                    ? description.slice(0, 160).trim() + (description.length > 160 ? "..." : "")
                                    : "Desarrollar habilidades prácticas aplicables de inmediato."}
                            </p>
                        )}
                    </div>
                </div>

                {/* Block 3: Cómo está estructurado */}
                <div className="bg-white/[0.025] border border-white/[0.06] rounded-xl p-6 space-y-4 hover:border-white/[0.1] transition-colors flex flex-col">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-[#5D5CDE]/10 rounded-lg">
                            <LayoutList size={18} className="text-[#5D5CDE]" />
                        </div>
                        <h3 className="text-base font-bold text-white">¿Cómo está estructurado?</h3>
                    </div>
                    <div className="space-y-0 flex-1">
                        {[
                            { label: "Secciones", value: totalModules },
                            { label: "Clases", value: totalLessons },
                            { label: "Duración total", value: duration },
                            { label: "Formato", value: "Video bajo demanda" },
                        ].map((row, i) => (
                            <div key={i} className={`flex items-center justify-between text-sm py-3 ${i < 3 ? "border-b border-white/[0.04]" : ""}`}>
                                <span className="text-gray-500">{row.label}</span>
                                <span className="font-semibold text-white text-sm">{row.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Full learning outcomes (if more than 4) */}
            {learningPoints.length > 4 && (
                <div className="border border-white/[0.06] p-6 md:p-8 rounded-xl bg-white/[0.015]">
                    <h2 className="text-lg font-bold text-white mb-5 font-headings">Todo lo que aprenderás</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                        {learningPoints.map((item, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                                <div className="mt-0.5 p-0.5 bg-[#5D5CDE]/20 rounded-full shrink-0">
                                    <Check size={11} className="text-[#5D5CDE]" />
                                </div>
                                <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Course Content Accordion */}
            <div>
                <h2 className="text-xl font-black text-white mb-5 font-headings">Contenido del curso</h2>
                <div className="flex flex-wrap gap-2.5 text-xs text-gray-500 mb-5">
                    <span className="bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 rounded-full font-medium">{totalModules} secciones</span>
                    <span className="bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 rounded-full font-medium">{totalLessons} clases</span>
                    <span className="bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 rounded-full font-medium">{duration} total</span>
                </div>
                <div className="border border-white/[0.06] rounded-xl overflow-hidden divide-y divide-white/[0.04]">
                    {modules.map((module, index) => (
                        <ModuleAccordion key={module.id} module={module} defaultOpen={index === 0} />
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
        <div className="bg-[#0B0F19]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left px-5 py-4 flex justify-between items-center hover:bg-white/[0.025] transition-colors group"
            >
                <span className="font-medium text-sm text-gray-300 group-hover:text-white transition-colors">{module.title}</span>
                <div className="flex items-center gap-3">
                    <span className="text-[11px] text-gray-600 font-medium tabular-nums">
                        {module.lessons?.length || 0} clases{durationLabel && ` · ${durationLabel}`}
                    </span>
                    {isOpen ? <ChevronUp size={16} className="text-gray-600" /> : <ChevronDown size={16} className="text-gray-600" />}
                </div>
            </button>
            {isOpen && (
                <div className="px-5 pb-3 space-y-0.5 bg-black/20 border-t border-white/[0.03]">
                    {module.lessons && module.lessons.length > 0 ? (
                        module.lessons.map((lesson: any) => (
                            <div key={lesson.id} className="flex justify-between items-center py-2.5 text-gray-500 hover:text-gray-300 transition-colors rounded-lg px-3 hover:bg-white/[0.02]">
                                <div className="flex items-center gap-2.5">
                                    {lesson.videoUrl ? <PlayCircle size={13} className="text-[#5D5CDE]/50" /> : <FileText size={13} className="text-gray-700" />}
                                    <span className="text-sm">{lesson.title}</span>
                                </div>
                                {lesson.duration > 0 && (
                                    <span className="text-[11px] font-mono text-gray-600 tabular-nums">
                                        {Math.floor(lesson.duration / 60)}:{Math.floor(lesson.duration % 60).toString().padStart(2, '0')}
                                    </span>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-gray-700 italic px-3 py-2">No hay lecciones en este módulo aún.</div>
                    )}
                </div>
            )}
        </div>
    );
}
