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
        question: "¿Cómo funcionan las 4 cuotas sin interés?",
        answer: "Al elegir el plan anual, podés pagar en 4 cuotas fijas sin interés a través de Mercado Pago con cualquier tarjeta de crédito. El monto total se divide exactamente por 4.",
    },
    {
        question: "¿Tengo garantía si no me gusta?",
        answer: "Sí, contamos con una garantía de satisfacción total de 24 horas. Si el contenido no cumple con tus expectativas, te devolvemos el 100% de tu inversión sin preguntas.",
    },
    {
        question: "¿El contenido es grabado o en vivo?",
        answer: "Todo el contenido formativo es 100% on-demand para que aprendas a tu ritmo. Además, sumamos análisis de mercado periódicos en la comunidad para mantener la práctica actualizada.",
    },
    {
        question: "¿Cómo accedo a la comunidad de alumnos?",
        answer: "Una vez realizada la suscripción, recibirás un acceso inmediato a nuestro canal premium de Telegram donde se centraliza todo el soporte y networking.",
    },
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="relative py-16 md:py-20 bg-[#10141d]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-3 font-display uppercase tracking-tight">
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
