"use client";

import { useState } from "react";
import { PricingCheckmark } from "@/components/pricing/PricingCheckmark";
import { ChevronDown, ChevronUp, PlayCircle, Check } from "lucide-react";

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
            <div className="border border-gray-100 p-8 rounded-3xl bg-gray-50/50">
                <h2 className="text-2xl font-black text-gray-900 mb-6 font-headings">Lo que aprenderás</h2>
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
                            <div className="mt-1 p-1 bg-green-100 rounded-full text-green-600">
                                <Check size={14} className="text-green-600" />
                            </div>
                            <span className="text-gray-600 font-medium leading-relaxed">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Course Content Accordion */}
            <div>
                <h2 className="text-2xl font-black text-gray-900 mb-6 font-headings">Contenido del curso</h2>
                <div className="text-sm text-gray-500 mb-6 flex gap-3 font-medium">
                    <span className="bg-gray-100 px-3 py-1 rounded-full">{totalModules} secciones</span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full">{totalLessons} clases</span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full">{duration} total</span>
                </div>
                <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100 shadow-sm">
                    {modules.map((module) => (
                        <ModuleAccordion key={module.id} module={module} />
                    ))}
                </div>
            </div>

            {/* Requirements */}
            <div>
                <h2 className="text-2xl font-black text-gray-900 mb-4 font-headings">Requisitos</h2>
                <ul className="list-disc list-inside space-y-3 text-gray-600">
                    <li>No se necesita experiencia previa en mercados financieros.</li>
                    <li>Ganas de aprender y disciplina para estudiar.</li>
                    <li>Un ordenador o dispositivo móvil con acceso a internet.</li>
                </ul>
            </div>

            {/* Description */}
            <div>
                <h2 className="text-2xl font-black text-gray-900 mb-4 font-headings">Descripción</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
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
        <div className="bg-white">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left px-6 py-5 flex justify-between items-center hover:bg-gray-50 transition-colors group"
            >
                <span className="font-bold text-gray-900 text-lg group-hover:text-[#5D5CDE] transition-colors">{module.title}</span>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 font-medium">{module.lessons?.length || 0} clases</span>
                    {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </div>
            </button>
            {isOpen && (
                <div className="px-6 py-4 space-y-2 bg-gray-50/50 border-t border-gray-100">
                    {module.lessons && module.lessons.length > 0 ? (
                        module.lessons.map((lesson: any) => (
                            <div key={lesson.id} className="flex justify-between items-center py-2 text-gray-600 hover:text-black transition-colors rounded-lg px-2 hover:bg-gray-100/50">
                                <div className="flex items-center gap-3">
                                    <PlayCircle size={16} className="text-[#5D5CDE]" />
                                    <span className="font-medium">{lesson.title}</span>
                                </div>
                                <span className="text-xs font-mono text-gray-400">10:00</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-gray-400 italic px-2">No hay lecciones en este módulo aún.</div>
                    )}
                </div>
            )}
        </div>
    );
}
