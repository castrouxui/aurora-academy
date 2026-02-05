"use client";

import Image from "next/image";
import { Container } from "./Container";
import { CheckCircle2, PlayCircle, Users } from "lucide-react";

export function AuthoritySection() {
    const points = [
        {
            icon: <CheckCircle2 className="w-6 h-6 text-[#5D5CDE]" />,
            title: "Método probado",
            description: "Estrategias que él mismo usa a diario en los mercados reales."
        },
        {
            icon: <PlayCircle className="w-6 h-6 text-[#5D5CDE]" />,
            title: "Sin relleno",
            description: "Contenido 100% on-demand para que aprendas a tu ritmo, sin vueltas."
        },
        {
            icon: <Users className="w-6 h-6 text-[#5D5CDE]" />,
            title: "Comunidad",
            description: "Soporte constante y análisis compartido entre alumnos y mentores."
        }
    ];

    return (
        <section className="py-20 md:py-32 bg-[#0a0d14] overflow-hidden">
            <Container>
                <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
                    {/* Image Column */}
                    <div className="flex-1 relative">
                        <div className="relative aspect-square w-full max-w-[500px] mx-auto rounded-[32px] overflow-hidden border border-white/10 shadow-2xl shadow-[#5D5CDE]/10 group">
                            <Image
                                src="/images/francisco-speaking.png"
                                alt="Fran Castro - Fundador de Aurora Academy"
                                fill
                                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-60" />

                            {/* Floating Professional Badge */}
                            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                                <p className="font-display font-bold text-white text-lg">Fran Castro</p>
                                <p className="text-sm text-gray-400 font-medium">Head Trader & Fundador</p>
                            </div>
                        </div>

                        {/* Decorative Background Elements */}
                        <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#5D5CDE]/20 rounded-full blur-[80px] -z-10 animate-pulse" />
                        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -z-10" />
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 space-y-8 md:space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-5xl font-black text-white font-display leading-tight tracking-tight">
                                Aprendé con <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5D5CDE] to-indigo-400">
                                    quien opera de verdad.
                                </span>
                            </h2>
                            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
                                No busques teoría vacía. Formate con una metodología diseñada para proteger tu capital y maximizar tus resultados.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {points.map((point, index) => (
                                <div key={index} className="flex gap-4 md:gap-6 group">
                                    <div className="mt-1 shrink-0 p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-[#5D5CDE]/40 transition-colors">
                                        {point.icon}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold text-white font-display uppercase tracking-wider">
                                            {point.title}
                                        </h3>
                                        <p className="text-gray-400 leading-relaxed font-medium">
                                            {point.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
