"use client";

import { Container } from "../layout/Container";
import Image from "next/image";
import { Users } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

export function InstructorSection() {
    const { ref, isInView } = useInView();

    return (
        <section ref={ref} className="py-28 bg-background">
            <Container>
                <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-12 items-center fade-in-up", isInView && "visible")}>
                    {/* Image Side */}
                    <div className="relative">
                        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-border">
                            <Image
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200"
                                alt="Fran - Instructor Jefe"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="flex flex-col space-y-6">
                        <div>
                            <span className="text-sm text-primary font-medium mb-3 block">
                                <Users className="w-4 h-4 inline mr-1.5" />Instructor Principal
                            </span>
                            <h2 className="text-3xl md:text-4xl font-display font-medium leading-[1.15] tracking-normal text-foreground">
                                Aprende directamente de quien{" "}
                                <span className="text-primary">opera todos los días.</span>
                            </h2>
                        </div>

                        <div className="space-y-4 text-base text-muted-foreground font-normal leading-relaxed">
                            <p>
                                Hola, soy <strong className="text-foreground">Fran</strong>. Mi metodología no se basa en teoría sacada de libros de los años 90. Se basa en lo que funciona <strong>hoy</strong> en los mercados financieros.
                            </p>
                            <p>
                                Creé Aurora Academy con un solo propósito: democratizar el acceso al trading institucional de alto nivel. Sin humo, sin indicadores mágicos. Solo estructura, liquidez y gestión de riesgo asimétrica.
                            </p>
                        </div>

                        {/* Stats Strip (merged from AuthoritySection) */}
                        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
                            <div>
                                <p className="text-3xl font-display font-medium text-foreground">+5M</p>
                                <p className="text-xs text-muted-foreground font-normal">Capital fondeado</p>
                            </div>
                            <div>
                                <p className="text-3xl font-display font-medium text-foreground">7+</p>
                                <p className="text-xs text-muted-foreground font-normal">Años de experiencia</p>
                            </div>
                            <div>
                                <p className="text-3xl font-display font-medium text-foreground">10k+</p>
                                <p className="text-xs text-muted-foreground font-normal">Alumnos formados</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
