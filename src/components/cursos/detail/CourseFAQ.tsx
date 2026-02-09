"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const FREQUENTLY_ASKED_QUESTIONS = [
    {
        question: "¿Necesito experiencia previa para tomar este curso?",
        answer: "No, este curso está diseñado para guiarte desde los fundamentos básicos hasta conceptos avanzados. Comenzamos desde cero, explicándote qué es el mercado, cómo funciona y cómo puedes participar en él."
    },
    {
        question: "¿Por cuánto tiempo tengo acceso?",
        answer: "Tendrás acceso ilimitado a todo el contenido, actualizaciones y nuevas clases mientras tu membresía se mantenga activa."
    },
    {
        question: "¿Otorgan certificado al finalizar?",
        answer: "¡Por supuesto! Al completar el 100% de las lecciones y aprobar los exámenes prácticos, recibirás un certificado digital oficial de Aurora Academy validando tus conocimientos, que podrás compartir en LinkedIn."
    },

    {
        question: "¿Qué métodos de pago aceptan?",
        answer: "Aceptamos todas las tarjetas de crédito y débito a través de MercadoPago (para Argentina) y PayPal (para pagos internacionales). También puedes abonar mediante transferencia bancaria o criptomonedas contactando a soporte."
    }
];

export function CourseFAQ() {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-[#5D5CDE]/20 rounded-lg">
                    <HelpCircle className="text-[#5D5CDE]" size={24} />
                </div>
                <h2 className="text-2xl font-black text-white font-headings">Preguntas Frecuentes</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {FREQUENTLY_ASKED_QUESTIONS.map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </div>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden transition-all duration-300 hover:border-white/20">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-6 text-left"
            >
                <span className="font-bold text-lg text-white">{question}</span>
                {isOpen ? (
                    <ChevronUp className="text-[#5D5CDE] shrink-0" size={20} />
                ) : (
                    <ChevronDown className="text-gray-400 shrink-0" size={20} />
                )}
            </button>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="px-6 pb-6 pt-0 text-gray-400 leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    );
}
