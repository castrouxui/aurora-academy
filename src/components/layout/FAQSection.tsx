"use client";

import { useState } from "react";
import { Container } from "../layout/Container";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";

const faqs = [
    {
        question: "¿Necesito conocimientos previos para empezar?",
        answer: "No, el programa arranca totalmente desde bases lógicas financieras puestas en práctica sencilla. Pasamos rápido de lo básico a lo profesional para que fundes cuentas con consciencia rápidamente."
    },
    {
        question: "¿Con cuánto capital recomiendan arrancar a operar?",
        answer: "Podés empezar en varios Brokers argentinos desde $10.000 ARS. Nunca recomendamos usar ahorros destinados para gastos mensuales (el \"sueldo\"). En la academia te enseñamos a gestionar el riesgo, tengas $100 dólares o $100.000."
    },
    {
        question: "¿Tienen garantía de mi dinero?",
        answer: "Sí. Contás con 7 días corridos desde tu compra para revisar todo el contenido por dentro, sumarte a la comunidad y ver una clase en vivo o las bitácoras. Si determinás que esto no va a ayudarte, mandás un mail y solicitás el 100% depositado de vuelta y sin mediar con humanos."
    },
    {
        question: "¿Cómo funciona la comunidad de Telegram?",
        answer: "Es exclusiva para los planes Elite y PM. No es un chat libre de desinformación. Funciona para que yo envíe las bitácoras de voz diariamente evaluando la apertura y cierre del mercado, y para organizar análisis serios con miembros que sí ejecutan posiciones reales."
    }
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const { ref, isInView } = useInView();

    return (
        <section ref={ref} className="py-24 bg-background border-t border-border/50">
            <Container className="max-w-3xl mx-auto">
                <div className={cn("text-center mb-16 fade-in-up", isInView && "visible")}>
                    <span className="text-sm text-primary font-medium mb-4 block">
                        <HelpCircle className="w-4 h-4 inline mr-1.5" />Preguntas Comunes
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight text-foreground mb-4">
                        Despejá tus dudas.
                    </h2>
                    <p className="text-muted-foreground font-normal text-base">
                        Todo lo que necesitás saber de Aurora Academy antes de tomar tu próxima gran decisión.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div
                                key={idx}
                                className={cn(
                                    "border-b border-border transition-all duration-300",
                                    isOpen ? "bg-muted/10" : "bg-transparent hover:bg-muted/5",
                                    idx === 0 && "border-t"
                                )}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                                    className="w-full flex items-center justify-between py-6 px-4 md:px-6 text-left"
                                >
                                    <h3 className="font-bold text-[18px] md:text-[20px] text-foreground pr-8 leading-tight">{faq.question}</h3>
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 border border-border",
                                        isOpen ? "rotate-180 bg-foreground text-background" : "bg-secondary text-foreground"
                                    )}>
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </button>

                                <div
                                    className={cn(
                                        "grid transition-all duration-300 ease-in-out",
                                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                    )}
                                >
                                    <div className="overflow-hidden">
                                        <p className="px-4 md:px-6 pb-6 pt-2 text-[16px] text-muted-foreground leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
