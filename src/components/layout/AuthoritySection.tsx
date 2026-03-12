"use client";

import { Container } from "../layout/Container";
import { CheckCircle2, Trophy, Target } from "lucide-react";
import Image from "next/image";

export function AuthoritySection() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Huge Typography & Stats */}
                    <div className="flex flex-col space-y-10">
                        <div className="space-y-6">
                            <span className="text-primary font-bold tracking-widest uppercase text-sm">
                                Track Record Comprobado
                            </span>
                            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground font-display leading-[0.9] tracking-tighter">
                                No enseñamos teoría. <br />
                                <span className="text-muted-foreground">Operamos la realidad.</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border/50">
                            <div>
                                <h4 className="text-5xl font-black text-foreground font-display mb-2">+5M</h4>
                                <p className="text-sm font-medium text-muted-foreground">En capital fondeado por nuestros alumnos este año.</p>
                            </div>
                            <div>
                                <h4 className="text-5xl font-black text-foreground font-display mb-2">98%</h4>
                                <p className="text-sm font-medium text-muted-foreground">De tasa de retención en Mentorías 1:1.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Visual Clean Card (No glow, just pure structure) */}
                    <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-muted/30 rounded-[3rem] border border-border p-8 flex flex-col justify-between overflow-hidden group">
                        {/* Background subtle pattern */}
                        <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                        <div className="relative z-10 bg-background rounded-2xl p-4 shadow-sm self-start inline-flex items-center gap-3 border border-border/50">
                            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                <Trophy className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</p>
                                <p className="text-sm font-black text-foreground">Top Rated Academy</p>
                            </div>
                        </div>

                        <div className="relative z-10 mt-auto bg-background/80 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-border shadow-2xl shadow-black/50 transform transition-transform duration-500 group-hover:-translate-y-2">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-inner">
                                    <Target className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-black text-xl text-foreground font-display">El Método Aurora</h3>
                                    <p className="text-sm text-muted-foreground font-medium">Validado por +10k horas de mercado</p>
                                </div>
                            </div>
                            <ul className="space-y-3">
                                {[
                                    "Basado en Smart Money Concepts reales.",
                                    "Psicología de trading aplicada y medible.",
                                    "Gestión de riesgo matemática estricta."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
