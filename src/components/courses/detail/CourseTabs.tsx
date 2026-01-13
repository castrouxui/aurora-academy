"use client";

import { useState } from "react";
import { PricingCheckmark } from "@/components/pricing/PricingCheckmark";
import { ChevronDown, ChevronUp, PlayCircle, Check, FileText } from "lucide-react";

interface CourseTabsProps {
    modules: any[];
    totalLessons: number;
    totalModules: number;
    duration: string;
}

export function CourseTabs({ modules = [], totalLessons, totalModules, duration }: CourseTabsProps) {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div className="space-y-12">
            {/* What you'll learn */}
            <div className="border border-white/10 p-8 rounded-3xl bg-white/5">
                <h2 className="text-2xl font-black text-white mb-6 font-headings">Lo que aprenderás</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {[
                        "Dominarás el análisis técnico desde cero a avanzado",
                        "Aprenderás a gestionar el riesgo como un profesional",
                        "Entenderás la psicología del trading y el control emocional",
                        "Desarrollarás tu propia estrategia de trading rentable",
                        "Conocerás los diferentes mercados financieros y cómo operarlos",
                        "Interpretarás gráficos y patrones de velas japonesas"
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className="mt-1 p-1 bg-[#5D5CDE]/20 rounded-full text-[#5D5CDE]">
                                <Check size={14} className="text-[#5D5CDE]" />
                            </div>
                            <span className="text-gray-300 font-medium leading-relaxed">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Course Content Accordion */}
            <div>
                <h2 className="text-2xl font-black text-white mb-6 font-headings">Contenido del curso</h2>
                <div className="text-sm text-gray-400 mb-6 flex gap-3 font-medium">
                    <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full">{totalModules} secciones</span>
                    <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full">{totalLessons} clases</span>
                    <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full">{duration} total</span>
                </div>
                <div className="border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5 shadow-lg">
                    {modules.map((module) => (
                        <ModuleAccordion key={module.id} module={module} />
                    ))}
                </div>
            </div>

            {/* Requirements */}
            <div>
                <h2 className="text-2xl font-black text-white mb-4 font-headings">Requisitos</h2>
                <ul className="list-disc list-inside space-y-3 text-gray-300 ml-2">
                    <li>No se necesita experiencia previa en mercados financieros.</li>
                    <li>Ganas de aprender y disciplina para estudiar.</li>
                    <li>Un ordenador o dispositivo móvil con acceso a internet.</li>
                </ul>
            </div>

            {/* Description */}
            <div>
                <h2 className="text-2xl font-black text-white mb-4 font-headings">Descripción</h2>
                <div className="space-y-4 text-gray-300 leading-relaxed text-lg">
                    <p>
                        Este curso completo de Trading Profesional está diseñado para llevarte desde un nivel principiante hasta un nivel avanzado, proporcionándote todas las herramientas necesarias para operar en los mercados financieros con confianza y consistencia.
                    </p>
                    <p>
                        Aprenderás no solo análisis técnico y fundamental, sino también aspectos cruciales como la gestión monetaria y la psicología del trading, que son los pilares fundamentales de cualquier trader exitoso.
                    </p>
                    <p>
                        El curso incluye ejemplos prácticos en tiempo real, análisis de casos de estudio y ejercicios para reforzar tu aprendizaje. Además, tendrás acceso a nuestra comunidad exclusiva donde podrás compartir tus análisis y resolver dudas.
                    </p>
                </div>
            </div>
        </div>
    );
}

function ModuleAccordion({ module }: { module: any }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-[#0B0F19]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left px-6 py-5 flex justify-between items-center hover:bg-white/5 transition-colors group"
            >
                <span className="font-bold text-gray-200 text-lg group-hover:text-[#5D5CDE] transition-colors">{module.title}</span>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 font-medium">{module.lessons?.length || 0} clases</span>
                    {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </div>
            </button>
            {isOpen && (
                <div className="px-6 py-4 space-y-2 bg-black/20 border-t border-white/5">
                    {module.lessons && module.lessons.length > 0 ? (
                        module.lessons.map((lesson: any) => (
                            <div key={lesson.id} className="flex justify-between items-center py-2 text-gray-400 hover:text-white transition-colors rounded-lg px-2 hover:bg-white/5">
                                <div className="flex items-center gap-3">
                                    {lesson.videoUrl ? <PlayCircle size={16} className="text-[#5D5CDE]" /> : <FileText size={16} className="text-gray-500" />}
                                    <span className="font-medium">{lesson.title}</span>
                                </div>
                                {/* Duration Display */}
                                {lesson.duration > 0 && (
                                    <span className="text-xs font-mono text-gray-500">
                                        {Math.floor(lesson.duration / 60)}:{Math.floor(lesson.duration % 60).toString().padStart(2, '0')}
                                    </span>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-gray-600 italic px-2">No hay lecciones en este módulo aún.</div>
                    )}
                </div>
            )}
        </div>
    );
}
