"use client";

import { useState } from "react";
import { PricingCheckmark } from "@/components/pricing/PricingCheckmark";

export function CourseTabs() {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div>
            {/* Tabs Header */}
            {/* 
            <div className="flex border-b border-gray-800 mb-8 overflow-x-auto">
                {["Visión general", "Contenido", "Instructor", "Reseñas"].map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                            activeTab === tab 
                            ? "border-primary text-white" 
                            : "border-transparent text-gray-400 hover:text-white"
                        }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
             For MVP/Design match, we might just layout sections vertically as it's often better for SEO and UX, 
             but let's implement the specific sections requested first.
            */}

            <div className="space-y-8">
                {/* What you'll learn */}
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

                {/* Course Content Accordion (Mock) */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Contenido del curso</h2>
                    <div className="text-sm text-gray-400 mb-4 flex gap-2">
                        <span>12 secciones</span> • <span>95 clases</span> • <span>14h 42m de duración total</span>
                    </div>
                    <div className="border border-gray-700 rounded-lg divide-y divide-gray-700">
                        {/* Section 1 */}
                        <div className="bg-[#1F2937]">
                            <button className="w-full text-left px-6 py-4 flex justify-between items-center bg-[#252f3f] hover:bg-[#2d3848] transition-colors">
                                <span className="font-bold text-white">Introducción a los Mercados Financieros</span>
                                <span className="text-sm text-gray-400">4 clases • 28min</span>
                            </button>
                            <div className="px-6 py-4 space-y-3 bg-[#111827]">
                                <div className="flex justify-between text-sm text-gray-300">
                                    <div className="flex gap-3">
                                        <PlayCircleIcon />
                                        <span>¿Qué es el Trading y cómo funciona?</span>
                                    </div>
                                    <span>08:42</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-300">
                                    <div className="flex gap-3">
                                        <PlayCircleIcon />
                                        <span>Diferencia entre Inversión y Trading</span>
                                    </div>
                                    <span>05:15</span>
                                </div>
                            </div>
                        </div>
                        {/* Section 2 (Collapsed Mock) */}
                        <div>
                            <button className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-[#1f2937] transition-colors">
                                <span className="font-bold text-white">Análisis Técnico: Velas Japonesas</span>
                                <span className="text-sm text-gray-400">6 clases • 45min</span>
                            </button>
                        </div>
                        <div>
                            <button className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-[#1f2937] transition-colors">
                                <span className="font-bold text-white">Estructura de Mercado</span>
                                <span className="text-sm text-gray-400">8 clases • 1h 12min</span>
                            </button>
                        </div>
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
        </div>
    );
}

function PlayCircleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
            <circle cx="12" cy="12" r="10" />
            <polygon points="10 8 16 12 10 16 10 8" />
        </svg>
    );
}
