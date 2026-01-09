"use client";

import { useState } from "react";
import { PricingCheckmark } from "@/components/pricing/PricingCheckmark";
import { ChevronDown, ChevronUp, PlayCircle } from "lucide-react";

interface CourseTabsProps {
    modules: any[];
    totalLessons: number;
    totalModules: number;
    duration: string;
}

export function CourseTabs({ modules = [], totalLessons, totalModules, duration }: CourseTabsProps) {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div className="space-y-8">
            {/* What you'll learn - Static for now */}
            <div className="border border-gray-700 p-6 rounded-xl bg-card/10">
                <h2 className="text-xl font-bold text-white mb-6">Lo que aprenderás</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                    {[
                        "Dominarás el análisis técnico desde cero a avanzado",
                        "Aprenderás a gestionar el riesgo como un profesional",
                        "Entenderás la psicología del trading y el control emocional",
                        "Desarrollarás tu propia estrategia de trading rentable",
                        "Conocerás los diferentes mercados financieros y cómo operarlos",
                        "Interpretarás gráficos y patrones de velas japonesas"
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className="mt-0.5"><PricingCheckmark /></div>
                            <span className="text-sm text-gray-300">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Course Content Accordion */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-6">Contenido del curso</h2>
                <div className="text-sm text-gray-400 mb-4 flex gap-2">
                    <span>{totalModules} secciones</span> • <span>{totalLessons} clases</span> • <span>{duration} de duración total</span>
                </div>
                <div className="border border-gray-700 rounded-lg divide-y divide-gray-700">
                    {modules.map((module) => (
                        <ModuleAccordion key={module.id} module={module} />
                    ))}
                </div>
            </div>

            {/* Requirements */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-4">Requisitos</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                    <li>No se necesita experiencia previa en mercados financieros.</li>
                    <li>Ganas de aprender y disciplina para estudiar.</li>
                    <li>Un ordenador o dispositivo móvil con acceso a internet.</li>
                </ul>
            </div>

            {/* Description */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-4">Descripción</h2>
                <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
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
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left px-6 py-4 flex justify-between items-center bg-[#1F2937] hover:bg-[#2d3848] transition-colors"
            >
                <span className="font-bold text-white">{module.title}</span>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">{module.lessons?.length || 0} clases</span>
                    {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </div>
            </button>
            {isOpen && (
                <div className="px-6 py-4 space-y-3 bg-[#111827]">
                    {module.lessons && module.lessons.length > 0 ? (
                        module.lessons.map((lesson: any) => (
                            <div key={lesson.id} className="flex justify-between text-sm text-gray-300">
                                <div className="flex gap-3">
                                    <PlayCircle size={16} className="text-gray-500 mt-0.5" />
                                    <span>{lesson.title}</span>
                                </div>
                                <span>10:00</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-gray-500 italic">No hay lecciones en este módulo aún.</div>
                    )}
                </div>
            )}
        </div>
    );
}
