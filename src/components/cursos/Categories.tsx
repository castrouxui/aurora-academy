"use client";

import { Container } from "../layout/Container";
import Link from "next/link";
import { ArrowRight, TrendingUp, Cpu, MonitorPlay, BarChart3, Binary } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

const categories = [
    {
        title: "Mentoriado Personalizado",
        description: "Acompañamiento 1 a 1 para transformar tu trading.",
        icon: TrendingUp,
        href: "/mentoria",
        count: "Cupos limitados",
    },
    {
        title: "Trading Algorítmico",
        description: "Automatiza y optimiza tus estrategias con IA.",
        icon: Cpu,
        href: "/cursos/algoritmico",
        count: "2 Cursos",
    },
    {
        title: "Análisis Técnico Avanzado",
        description: "Perfecciona tus entradas y salidas en el mercado.",
        icon: BarChart3,
        href: "/cursos/analisis-tecnico",
        count: "4 Cursos",
    },
    {
        title: "Criptos & DeFi",
        description: "Navega el ecosistema descentralizado con seguridad.",
        icon: Binary,
        href: "/cursos/crypto",
        count: "3 Cursos",
    },
    {
        title: "Live Sessions",
        description: "Análisis en vivo de los mercados.",
        icon: MonitorPlay,
        href: "/cursos/live",
        count: "Semanal",
    },
];

export function Categories() {
    const { ref, isInView } = useInView();

    return (
        <section ref={ref} className="py-28 bg-background">
            <Container>
                {/* Header */}
                <div className={cn("flex flex-col md:flex-row justify-between items-end gap-6 mb-16 fade-in-up", isInView && "visible")}>
                    <div className="max-w-2xl">
                        <span className="text-sm text-primary font-medium mb-3 block">
                            Rutas de Aprendizaje
                        </span>
                        <h2 className="text-3xl md:text-4xl font-display font-medium leading-[1.15] tracking-normal text-foreground">
                            Explora nuestras áreas de especialización técnica.
                        </h2>
                    </div>
                    <Link
                        href="/cursos"
                        className="inline-flex items-center text-sm font-semibold text-foreground hover:text-primary transition-colors gap-1"
                    >
                        Ver todos los cursos
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Uniform 3-column Grid */}
                <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 fade-in-up", isInView && "visible")} style={{ transitionDelay: "0.1s" }}>
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link
                                key={category.title}
                                href={category.href}
                                className="group flex items-center gap-4 p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
                            >
                                {/* Icon */}
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Icon className="w-6 h-6" />
                                </div>

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors">
                                        {category.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {category.description}
                                    </p>
                                </div>

                                {/* Arrow */}
                                <ArrowRight className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                            </Link>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
