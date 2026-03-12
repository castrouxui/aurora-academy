"use client";

import { Container } from "../layout/Container";
import { Bot, Network, Workflow, Zap } from "lucide-react";

export function EcosystemSection() {
    const features = [
        {
            icon: Bot,
            title: "Aurora AI Copilot",
            description: "Analiza el mercado en tiempo real, detecta patrones y envía alertas precisas directamente a tu celular.",
            highlight: "Nuevo",
            span: "md:col-span-2 md:row-span-2",
            gradient: "from-blue-500/10 to-purple-500/10",
        },
        {
            icon: Network,
            title: "Comunidad Elite",
            description: "Conecta con traders fondeados que operan en vivo todos los días.",
            span: "md:col-span-1",
            gradient: "from-orange-500/10 to-transparent",
        },
        {
            icon: Workflow,
            title: "Rutas Automatizadas",
            description: "Tu progreso trackeado por nuestro sistema, adaptando el contenido a tu nivel.",
            span: "md:col-span-1",
            gradient: "from-emerald-500/10 to-transparent",
        },
        {
            icon: Zap,
            title: "Ejecución Milimétrica",
            description: "Aprende estrategias de Smart Money Concepts para entrar al mercado sin dudar.",
            span: "md:col-span-2",
            gradient: "from-pink-500/10 to-transparent",
        }
    ];

    return (
        <section className="py-24 bg-background overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <Container className="relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-6">
                        <Bot className="w-4 h-4" /> Ecosistema Tecnológico
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-foreground font-display tracking-tight leading-tight">
                        Trading potenciado por <br className="hidden md:block" /> inteligencia artificial.
                    </h2>
                    <p className="mt-6 text-lg md:text-xl text-muted-foreground font-medium">
                        No solo te enseñamos una estrategia. Te damos el ecosistema completo para reducir tu curva de aprendizaje a la mitad.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px] max-w-5xl mx-auto">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        const isMain = idx === 0;

                        return (
                            <div
                                key={idx}
                                className={`group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] bg-muted/30 border border-border p-8 md:p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 ${feature.span}`}
                            >
                                {/* Gradient Background Hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                                <div className="flex justify-between items-start relative z-10">
                                    <div className={`p-4 rounded-2xl ${isMain ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-muted text-foreground'} transition-transform duration-500 group-hover:scale-110`}>
                                        <Icon className={`${isMain ? 'w-8 h-8' : 'w-6 h-6'}`} />
                                    </div>
                                    {feature.highlight && (
                                        <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full animate-pulse">
                                            {feature.highlight}
                                        </span>
                                    )}
                                </div>

                                <div className="relative z-10 mt-auto pt-8">
                                    <h3 className={`${isMain ? 'text-3xl' : 'text-xl'} font-black text-foreground font-display mb-3 tracking-tight group-hover:text-primary transition-colors`}>
                                        {feature.title}
                                    </h3>
                                    <p className={`${isMain ? 'text-lg' : 'text-sm'} font-medium text-muted-foreground leading-relaxed max-w-[90%]`}>
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
