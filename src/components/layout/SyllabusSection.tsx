"use client";

import { useState } from "react";
import { Container } from "../layout/Container";
import { ChevronDown, BookOpen, Layers, BarChart, Target, Binary } from "lucide-react";
import { cn } from "@/lib/utils";

const syllabus = [
    {
        week: "Módulo 1",
        title: "Fundamentos Estructurales",
        icon: Layers,
        topics: [
            "Introducción a Smart Money Concepts (SMC)",
            "Estructura de mercado avanzada (BOS & CHoCH)",
            "Mapeo de temporalidades múltiples",
            "Liquidez institucional y zonas trampa"
        ]
    },
    {
        week: "Módulo 2",
        title: "Zonas de Alta Probabilidad",
        icon: Target,
        topics: [
            "Order Blocks (OB) vs. Mitigation Blocks",
            "Fair Value Gaps (FVG) e Imbalances",
            "Refinamiento de zonas para entradas sniper",
            "Identificación de Inducement (Inducción)"
        ]
    },
    {
        week: "Módulo 3",
        title: "Gestión y Ejecución",
        icon: BarChart,
        topics: [
            "Modelos de entrada (Continuación y Reversión)",
            "Gestión de riesgo matemática asimétrica",
            "Plan de trading estructurado paso a paso",
            "Economía del comportamiento y psicología del trader"
        ]
    },
    {
        week: "Módulo 4",
        title: "Ecosistema Crypto & DeFi",
        icon: Binary,
        topics: [
            "Ciclos de mercado en Criptomonedas",
            "Análisis on-chain básico para confirmaciones",
            "DeFi básico: Yield Farming y Staking seguro",
            "Estrategias de portafolio para Bull Markets"
        ]
    }
];

export function SyllabusSection() {
    const [openIndex, setOpenIndex] = useState<number>(0);

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <Container className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-6">
                        <BookOpen className="w-4 h-4" /> Temario Académico
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-foreground font-display tracking-tight leading-tight">
                        Un programa diseñado para <br className="hidden md:block" />
                        <span className="text-muted-foreground">transformar tu visión de los gráficos.</span>
                    </h2>
                </div>

                <div className="space-y-4">
                    {syllabus.map((module, idx) => {
                        const isOpen = openIndex === idx;
                        const Icon = module.icon;

                        return (
                            <div
                                key={idx}
                                className={cn(
                                    "border border-border rounded-2xl overflow-hidden transition-all duration-300",
                                    isOpen ? "bg-muted/40 shadow-xl shadow-black/5" : "bg-muted/10 hover:bg-muted/20"
                                )}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                                    className="w-full text-left p-6 md:p-8 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors shrink-0",
                                            isOpen ? "bg-primary text-white" : "bg-background text-foreground/50 border border-border"
                                        )}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-primary mb-1 uppercase tracking-wider">{module.week}</p>
                                            <h3 className="text-xl md:text-2xl font-black text-foreground font-display">{module.title}</h3>
                                        </div>
                                    </div>
                                    <ChevronDown
                                        className={cn(
                                            "w-6 h-6 text-muted-foreground transition-transform duration-300",
                                            isOpen && "rotate-180"
                                        )}
                                    />
                                </button>

                                <div
                                    className={cn(
                                        "grid transition-all duration-300 ease-in-out",
                                        isOpen ? "grid-rows-[1fr] opacity-100 pb-6 md:pb-8" : "grid-rows-[0fr] opacity-0"
                                    )}
                                >
                                    <div className="overflow-hidden">
                                        <div className="px-6 md:px-8 ml-0 md:ml-18">
                                            <ul className="space-y-4">
                                                {module.topics.map((topic, topicIdx) => (
                                                    <li key={topicIdx} className="flex items-start gap-4">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                                        <span className="text-muted-foreground font-medium">{topic}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
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
