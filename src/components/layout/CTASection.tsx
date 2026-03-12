"use client";

import { Container } from "../layout/Container";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

export function CTASection() {
    const { ref, isInView } = useInView();

    return (
        <section ref={ref} className="py-28 bg-background">
            <Container>
                <div className={cn("max-w-2xl mx-auto text-center fade-in-up", isInView && "visible")}>
                    <h2 className="text-4xl md:text-5xl font-display font-medium leading-[1.1] tracking-normal text-foreground mb-6">
                        Tu carrera como trader profesional empieza hoy.
                    </h2>
                    <p className="text-muted-foreground font-normal text-base mb-10 max-w-lg mx-auto">
                        Accede a todos los cursos, herramientas de IA y mentoría con un solo plan. Sin permanencia.
                    </p>
                    <Button
                        asChild
                        size="lg"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg"
                    >
                        <Link href="/membresias">
                            Ver Planes <MoveRight className="ml-2 w-5 h-5" />
                        </Link>
                    </Button>
                    <p className="text-sm text-muted-foreground mt-4">
                        Garantía de reembolso 7 días. Sin preguntas.
                    </p>
                </div>
            </Container>
        </section>
    );
}
