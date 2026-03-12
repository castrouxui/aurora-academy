"use client";

import { Container } from "../layout/Container";
import { Headphones, Clock, Video } from "lucide-react";

export function OnDemandSupportSection() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <Container>
                <div className="bg-muted/30 rounded-[3rem] p-8 md:p-16 border border-border relative overflow-hidden">
                    {/* Gradient Effects */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-foreground font-bold text-xs uppercase tracking-widest shadow-sm mb-6">
                            <Video className="w-4 h-4 text-primary" /> Metodología de Estudio
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-foreground font-display tracking-tight leading-tight">
                            Tu aprendizaje a tu ritmo. <br className="hidden md:block" />
                            Sin depender de horarios vivos.
                        </h2>
                        <p className="mt-6 text-lg text-muted-foreground font-medium">
                            Sabemos que tenés una vida estructurada. Todo nuestro contenido está 100% On-Demand, pregrabado con la más alta calidad y directo al grano. Sin pausas innecesarias ni desvíos.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        {/* On Demand Feature */}
                        <div className="bg-background rounded-[2rem] p-8 border border-border/50 shadow-sm flex gap-6 group hover:border-primary/30 transition-colors">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 text-primary">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-foreground font-display mb-2">Aprende 24/7</h3>
                                <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                                    Conectate a las clases las veces que quieras, cuando quieras. Desde tu PC o celular. Retrocedé, pausá, repetí hasta dominar el concepto.
                                </p>
                            </div>
                        </div>

                        {/* Support Feature */}
                        <div className="bg-background rounded-[2rem] p-8 border border-border/50 shadow-sm flex gap-6 group hover:border-primary/30 transition-colors">
                            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shrink-0 text-white shadow-inner shadow-white/20">
                                <Headphones className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-foreground font-display mb-2">Canal de Soporte Directo</h3>
                                <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                                    ¿Te trabaste en un tema? Tenés a disposición nuestro soporte directo y mentoría activa por canales privados de Discord para despejar todas tus dudas.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
