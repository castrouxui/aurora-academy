"use client";

import { MoveRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "./Container";
import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

export function HeroBanner() {
    const { ref, isInView } = useInView(0.1);

    return (
        <section ref={ref} className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-32 pb-24 bg-background">
            {/* Background glowing effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />

            <Container className="relative z-10 flex flex-col lg:flex-row items-center gap-16 w-full max-w-7xl mx-auto">

                {/* Left Column: Copywriting & CTAs */}
                <div className={cn("flex-1 text-left fade-in-up", isInView && "visible")}>
                    {/* CNV Trust Signal */}
                    <div className="inline-flex items-center gap-3 px-1.5 py-1.5 bg-secondary/80 backdrop-blur-sm border border-border rounded-full mb-8">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-widest">
                            <Sparkles className="w-3.5 h-3.5" />
                            MATRÍCULA CNV #2688
                        </div>
                        <span className="text-sm font-medium text-muted-foreground pr-4">Regulación Oficial</span>
                    </div>

                    {/* Headline */}
                    <div className="space-y-6">
                        <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-black leading-[1.1] tracking-tight text-foreground">
                            Dejá de adivinar.<br />
                            Empezá a <span className="text-primary relative inline-block">
                                operar.
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-xl leading-relaxed">
                            La inflación no te saca la plata, te la saca tu falta de sistema. Aprendé a proteger y multiplicar tu capital con la misma estrategia de la mesa institucional.
                        </p>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-10">
                        <Button
                            asChild
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_40px_rgba(82,102,235,0.3)] h-14 px-8 w-full sm:w-auto rounded-xl transition-all hover:-translate-y-1"
                        >
                            <Link href="/membresias">
                                Empezar ahora <MoveRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="h-14 px-8 w-full sm:w-auto font-bold border-border/80 text-foreground hover:bg-secondary/80 rounded-xl transition-all hover:border-border"
                        >
                            <Link href="/cursos">
                                Ver ruta de estudio
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Right Column: Bento Grid/Mockup */}
                <div className={cn("hidden lg:flex flex-1 relative h-[500px] w-full justify-center items-center fade-in-up", isInView && "visible")} style={{ transitionDelay: "0.2s" }}>

                    {/* Main Mockup Card */}
                    <div className="absolute z-10 w-full max-w-sm glass-panel p-6 rounded-2xl shadow-2xl shadow-black/50 border border-white/5 right-0 transform translate-y-8">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                            <div className="w-14 h-14 rounded-xl overflow-hidden border border-border bg-secondary">
                                <img src="/francisco-speaking.png" alt="Fran Castro" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <div className="text-foreground font-bold text-lg">Francisco Castro</div>
                                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Mentor Principal</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 rounded-xl bg-secondary/50 border border-white/5">
                                <span className="text-sm font-medium text-muted-foreground">Egresados Exitosos</span>
                                <span className="text-base font-bold text-foreground">1,000+</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-secondary/50 border border-white/5">
                                <span className="text-sm font-medium text-muted-foreground">Miembros VIP Activos</span>
                                <span className="text-base font-bold text-emerald-400">150+ Hoy</span>
                            </div>
                        </div>
                    </div>

                    {/* Floating Element 1 - Decor */}
                    <div className="absolute top-10 left-0 z-20 glass-panel px-4 py-3 rounded-xl flex items-center gap-3 animate-bounce shadow-xl" style={{ animationDuration: '4s' }}>
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-foreground">14 Años Mdo.</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Experiencia Institucional</div>
                        </div>
                    </div>

                    {/* Abstract tech blocks in background */}
                    <div className="absolute inset-0 grid grid-cols-2 gap-4 p-8 opacity-20 -z-10 rotate-6 scale-110 blur-[1px]">
                        <div className="bg-primary/40 rounded-3xl h-full w-full"></div>
                        <div className="bg-secondary rounded-3xl h-3/4 w-full mt-auto"></div>
                        <div className="bg-white/10 rounded-3xl h-1/2 w-full col-span-2"></div>
                    </div>
                </div>

                {/* Mobile Stats (only shows on small screens) */}
                <div className="lg:hidden w-full mt-12 grid grid-cols-2 gap-4">
                    <div className="glass-panel p-4 rounded-xl text-center">
                        <div className="text-2xl font-black text-foreground">14<span className="text-primary text-sm">Años</span></div>
                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Mercados</div>
                    </div>
                    <div className="glass-panel p-4 rounded-xl text-center">
                        <div className="text-2xl font-black text-foreground">1k<span className="text-primary text-sm">+</span></div>
                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Egresados</div>
                    </div>
                </div>

            </Container>
        </section>
    );
}
