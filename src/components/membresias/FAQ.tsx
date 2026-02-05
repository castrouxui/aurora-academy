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
        question: "¿Cómo funcionan las cuotas con Mercado Pago?",
        answer: "Podés pagar en 3 cuotas fijas sin interés. Es importante que el cupo disponible de tu tarjeta de crédito cubra el monto total de la inversión al momento de la compra.",
    },
    {
        question: "¿Tengo garantía si no estoy conforme?",
        answer: "Sí, confiamos 100% en nuestra metodología. Por eso tenés una garantía de satisfacción de 24hs. Si el contenido no es para vos, te devolvemos el total sin vueltas.",
    },
    {
        question: "¿Tengo horarios fijos para las clases?",
        answer: "No. Todo el contenido es 100% on-demand. Podés acceder en cualquier momento y aprender a tu propio ritmo, desde cualquier dispositivo.",
    },
    {
        question: "¿Cómo accedo a la comunidad de soporte?",
        answer: "Inmediatamente después del pago, recibirás el acceso al canal premium de Telegram donde Fran y el equipo comparten análisis y responden dudas a diario.",
    },
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="relative py-16 md:py-20 bg-[#10141d]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-3 font-display tracking-tight">
                        Preguntas frecuentes
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
                                className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden transition-all duration-300 hover:border-white/20"
                            >
                                {/* Question Button */}
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full flex items-center justify-between gap-4 p-6 text-left transition-colors"
                                >
                                    <span className="font-bold text-lg text-white">
                                        {item.question}
                                    </span>
                                    {isOpen ? (
                                        <ChevronDown className="text-[#5D5CDE] shrink-0 rotate-180 transition-transform duration-300 w-5 h-5" />
                                    ) : (
                                        <ChevronDown className="text-gray-400 shrink-0 transition-transform duration-300 w-5 h-5" />
                                    )}
                                </button>

                                {/* Answer */}
                                <div
                                    className={cn(
                                        "overflow-hidden transition-all duration-300 ease-in-out",
                                        isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                                    )}
                                >
                                    <div className="px-6 pb-6 pt-0 text-gray-400 leading-relaxed">
                                        {item.answer}
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
