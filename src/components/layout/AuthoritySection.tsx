"use client";

import Image from "next/image";
import { Container } from "./Container";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AuthoritySection() {
    return (
        <section className="py-28 md:py-36 border-b border-white/6">
            <Container>
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">

                    {/* Image */}
                    <div className="w-full lg:w-5/12 shrink-0">
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                            <Image
                                src="/images/francisco-speaking.png"
                                alt="Fran Castro"
                                fill
                                className="object-cover object-top"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/80 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <p className="text-white font-bold text-lg font-display">Fran Castro</p>
                                <p className="text-gray-400 text-sm mt-1">CEO de Aurora Advisors · Co-Fundador de Aurora Academy</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-10">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#5D5CDE] mb-6">
                                Tu instructor
                            </p>
                            <h2 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white leading-tight mb-6">
                                Aprendé con quien<br />opera de verdad.
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                Dejá de buscar teoría vacía. Formate con la metodología diseñada por quien está en los mercados todos los días.
                            </p>
                        </div>

                        <div className="space-y-0 border border-white/8 rounded-2xl overflow-hidden">
                            {[
                                { label: "Metodología", value: "Estrategias que Fran usa en operaciones reales, no simulaciones." },
                                { label: "Ritmo", value: "100% on-demand — aprendés cuando querés, sin horarios fijos." },
                                { label: "Comunidad", value: "Canal premium con análisis compartido y soporte constante." },
                            ].map((row, i) => (
                                <div key={i} className="flex gap-6 p-6 border-b border-white/6 last:border-0 hover:bg-white/[0.02] transition-colors">
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#5D5CDE] w-28 shrink-0 pt-0.5">{row.label}</span>
                                    <span className="text-gray-300 text-sm leading-relaxed">{row.value}</span>
                                </div>
                            ))}
                        </div>

                        <Link href="/membresias" className="inline-flex">
                            <button className="group h-12 px-7 rounded-xl border border-white/15 text-white font-semibold text-sm hover:border-white/30 hover:bg-white/5 transition-all flex items-center gap-3">
                                Ver planes
                                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}
