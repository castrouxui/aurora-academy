"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
    question: string;
    answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
    {
        question: "¿Qué incluye cada membresía?",
        answer: "Todas las membresías incluyen acceso al Canal de Aurora Academy con análisis diarios, videos educativos, y soporte de la comunidad. Los planes superiores añaden cursos nuevos cada 15 días, mentoría técnica, y networking profesional.",
    },
    {
        question: "¿Cómo funcionan las cuotas sin interés?",
        answer: "Los planes anuales se pueden dividir en 4 cuotas fijas sin interés a través de Mercado Pago. Solo pagas el total anual dividido en 4 pagos mensuales, sin costos adicionales.",
    },
    {
        question: "¿Puedo cambiar de plan después?",
        answer: "Sí, puedes hacer upgrade a un plan superior en cualquier momento. Se te cobrará la diferencia de manera inmediata y mantendrás todos los beneficios del nuevo plan al instante. El downgrade solo está disponible al momento de renovación.",
    },
    {
        question: "¿Cuál es la política de reembolso?",
        answer: "Ofrecemos garantía de satisfacción de 24 horas. Si no estás conforme con el contenido, te devolvemos el 100% de tu dinero dentro de las primeras 24 horas desde la compra.",
    },
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="relative py-16 md:py-20 bg-[#10141d]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                        Preguntas Frecuentes
                    </h2>
                    <p className="text-sm md:text-base text-gray-400">
                        Todo lo que necesitás saber antes de empezar
                    </p>
                </div>

                {/* Accordion */}
                <div className="space-y-3">
                    {FAQ_ITEMS.map((item, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div
                                key={index}
                                className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/30 via-slate-800/20 to-transparent backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-white/20"
                            >
                                {/* Question Button */}
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left transition-colors"
                                >
                                    <span className="text-sm md:text-base font-semibold text-white">
                                        {item.question}
                                    </span>
                                    <ChevronDown
                                        className={cn(
                                            "w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300",
                                            isOpen && "rotate-180 text-emerald-400"
                                        )}
                                    />
                                </button>

                                {/* Answer */}
                                <div
                                    className={cn(
                                        "grid transition-all duration-300 ease-in-out",
                                        isOpen
                                            ? "grid-rows-[1fr] opacity-100"
                                            : "grid-rows-[0fr] opacity-0"
                                    )}
                                >
                                    <div className="overflow-hidden">
                                        <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                                            <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                                                {item.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
