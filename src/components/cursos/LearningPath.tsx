"use client";

import { Container } from "../layout/Container";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { Play, Lock, Star } from "lucide-react";

// Helper for generating gradients based on id/index
const getGradient = (idx: number) => {
    const gradients = [
        "from-blue-600/40 to-indigo-900/80",
        "from-emerald-600/40 to-teal-900/80",
        "from-purple-600/40 to-fuchsia-900/80",
        "from-orange-600/40 to-red-900/80",
        "from-pink-600/40 to-rose-900/80",
        "from-cyan-600/40 to-blue-900/80",
        "from-primary/40 to-primary-foreground/10"
    ];
    return gradients[idx % gradients.length];
};

const phases = [
    {
        id: "01",
        title: "Fundamentos y Mindset",
        courses: [
            { title: "El camino del inversor", type: "CURSO", isFree: true, rating: 4.8, reviews: "2.1k", hours: "4.5", imageUrl: "https://utfs.io/f/30KHQePr0sHJHs4XoaWSxAXHgnULYsik7rvzC4tDoJf2hydB" },
            { title: "Los 7 Pilares del Éxito en Bolsa", type: "MICRO CURSO", isFree: false, rating: 4.9, reviews: "1.2k", hours: "3.2", imageUrl: "https://utfs.io/f/30KHQePr0sHJBXfXouQdI1jFQPvtCE4fx0kAGe9yXVOloaUT" },
            { title: "Finanzas Personales", type: "CURSO", isFree: false, rating: 4.7, reviews: "850", hours: "5.0", imageUrl: "https://utfs.io/f/30KHQePr0sHJ5zMMb6eyt9GSiMDvxUmA0XOfs1drNWIgC7Fc" },
            { title: "Introducción al Mercado de Capitales", type: "MENTORÍA", isFree: false, rating: 4.8, reviews: "1.5k", hours: "6.5", imageUrl: "https://utfs.io/f/30KHQePr0sHJsTys2IKM3P0Q5UnaWtEDlqK1vYJLAF6j27ym" }
        ]
    },
    {
        id: "02",
        title: "Análisis Técnico y Operatoria",
        courses: [
            { title: "¡Manejo de TradingView!", type: "MENTORÍA", isFree: false, rating: 4.9, reviews: "3.4k", hours: "2.0", imageUrl: "https://utfs.io/f/30KHQePr0sHJYWYDa2jezIr82D5wJO97FAgfZnl3dWsjH1Po" },
            { title: "Análisis Técnico", type: "CURSO", isFree: false, rating: 4.9, reviews: "4.1k", hours: "12.0", imageUrl: "https://utfs.io/f/30KHQePr0sHJeKZ8D9ToAhH54CZakgXw6qEsdBDlSfTpiQx9" },
            { title: "Mentoria Analisis Tecnico", type: "MENTORÍA", isFree: false, rating: 5.0, reviews: "200", hours: "8.5", imageUrl: "https://utfs.io/f/30KHQePr0sHJE0oo7zaYPAY9Q0Mh6Gr2KtZbIH1SN8pae75X" },
            { title: "Price Action", type: "MENTORÍA", isFree: false, rating: 4.8, reviews: "950", hours: "7.0", imageUrl: "https://utfs.io/f/30KHQePr0sHJsbVMhGKM3P0Q5UnaWtEDlqK1vYJLAF6j27ym" },
            { title: "Arbitraje Estadístico y Precisión con VWAP", type: "CURSO", isFree: false, rating: 4.9, reviews: "640", hours: "5.5", imageUrl: "https://utfs.io/f/30KHQePr0sHJBhhV8j9QdI1jFQPvtCE4fx0kAGe9yXVOloaU" },
            { title: "Domina el Stop Loss en 15 minutos", type: "MICRO CURSO", isFree: false, rating: 4.7, reviews: "1.1k", hours: "0.5", imageUrl: "https://utfs.io/f/30KHQePr0sHJLlIuWHVnMJ6ZY9UdxKl7WO5i3HSThta2PIzf" }
        ]
    },
    {
        id: "03",
        title: "Fundamental y Gestión de Riesgo",
        courses: [
            { title: "Análisis Fundamental", type: "MENTORÍA", isFree: false, rating: 4.8, reviews: "1.8k", hours: "10.0", imageUrl: "https://utfs.io/f/30KHQePr0sHJCxSnGLXzlkdwF4T9GHMXNLVKb6eu7j0rPfcO" },
            { title: "Dominando el Riesgo: De la Volatilidad a la Estabilidad del Portafolio", type: "MICRO CURSO", isFree: false, rating: 4.9, reviews: "730", hours: "4.5", imageUrl: "https://utfs.io/f/30KHQePr0sHJuokD911n1Mns8FThHWifYdVQRmZUzgK4kNaX" },
            { title: "Beneficio vs. Caja: La Guía de 22 Minutos para una Valuación Real", type: "MICRO CURSO", isFree: false, rating: 4.8, reviews: "920", hours: "0.5", imageUrl: "https://utfs.io/f/30KHQePr0sHJUKKkiDgcZ5w2vUQraWut4zgFXIiOlS71LpcM" },
            { title: "Mentoria Gestion de Cartera", type: "MENTORÍA", isFree: false, rating: 5.0, reviews: "150", hours: "9.0", imageUrl: "https://utfs.io/f/30KHQePr0sHJbi6Mng9QTe5Vo3qKwXOL8DRx6btI07kJPcAd" },
            { title: "Opciones Financieras", type: "CURSO", isFree: false, rating: 4.7, reviews: "500", hours: "6.0", imageUrl: "https://utfs.io/f/30KHQePr0sHJnDFCYk2mMJryZuNFPn9L7Y4UVxDKEeW1Xkso" },
            { title: "Futuros Financieros", type: "CURSO", isFree: false, rating: 4.8, reviews: "420", hours: "5.5", imageUrl: "https://utfs.io/f/30KHQePr0sHJ6CR7hHhJ5f4GBav9HCx8pyTg7woRztP6YeNM" },
            { title: "Fondos Comunes de Inversión", type: "CURSO", isFree: false, rating: 4.6, reviews: "880", hours: "3.0", imageUrl: "https://utfs.io/f/30KHQePr0sHJtXNBq7hWydzEIg376RA1CQVMsPNHOKqpbSGf" }
        ]
    },
    {
        id: "04",
        title: "Especialización e IA",
        courses: [
            { title: "IA en Inversiones", type: "MENTORÍA", isFree: false, rating: 4.9, reviews: "1.1k", hours: "4.0", imageUrl: "https://utfs.io/f/30KHQePr0sHJhrudoyE1oBH2XCc8yG4xOD6mQksRVeulPw7I" },
            { title: "Machine Learning e IA", type: "CURSO", isFree: false, rating: 4.8, reviews: "600", hours: "8.5", imageUrl: "https://utfs.io/f/30KHQePr0sHJBg6JiTQdI1jFQPvtCE4fx0kAGe9yXVOloaUT" },
            { title: "Testing con IA", type: "CURSO", isFree: false, rating: 4.9, reviews: "350", hours: "5.0", imageUrl: "https://utfs.io/f/30KHQePr0sHJQE57CBCtF6lxd1X0cM8YagwWKOzputHboynS" }
        ]
    }
];

export function LearningPath() {
    const { ref, isInView } = useInView(0.1);

    return (
        <section ref={ref} className="py-20 relative overflow-hidden bg-background border-t border-border/50">
            {/* Ambient Lighting */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[200px] bg-primary/5 blur-[100px] pointer-events-none rounded-full" />

            <Container className="relative z-10 max-w-7xl mx-auto">
                <div className={cn("mb-16 fade-in-up", isInView && "visible")}>
                    <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight text-foreground mb-4">
                        Ruta de <span className="text-primary">0 a 100</span>
                    </h2>
                    <p className="text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
                        Desbloqueá tu potencial completando la carrera estructurada. Solo el primer paso es de acceso libre.
                    </p>
                </div>

                <div className="space-y-16">
                    {phases.map((phase, phaseIndex) => (
                        <div
                            key={phase.id}
                            className={cn("fade-in-up", isInView && "visible")}
                            style={{ transitionDelay: `${phaseIndex * 0.15}s` }}
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg">
                                    {phase.id}
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                                    {phase.title}
                                </h3>
                            </div>

                            {/* Standard Grid Instead of Horizontal Scroll */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {phase.courses.map((course, courseIndex) => {
                                    const globalIndex = phaseIndex * 10 + courseIndex; // Unique offset for gradients
                                    return (
                                        <div
                                            key={courseIndex}
                                            className={cn(
                                                "relative group flex flex-col bg-card rounded-[16px] border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-border/80",
                                                !course.isFree ? "opacity-90 hover:opacity-100" : "opacity-100"
                                            )}
                                        >
                                            {/* Top Image Banner */}
                                            <div className={cn(
                                                "relative h-[160px] w-full bg-gradient-to-br flex items-center justify-center overflow-hidden shrink-0",
                                                getGradient(globalIndex)
                                            )}>
                                                {/* Abstract Logo Placeholder */}
                                                <div className="w-16 h-16 rounded-[14px] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500 will-change-transform">
                                                    <span className="text-white font-black text-xl drop-shadow-md">AA</span>
                                                </div>

                                                {/* Dimmer backdrop for locked courses */}
                                                {!course.isFree && (
                                                    <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] z-10 flex items-center justify-center transition-all duration-300 group-hover:bg-background/20" />
                                                )}

                                                {/* Free badge */}
                                                {course.isFree && (
                                                    <div className="absolute top-4 left-4 z-10">
                                                        <span className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-md">
                                                            GRATIS
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Play Button Overlay (If unlocked) */}
                                                {course.isFree && (
                                                    <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                                                        <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                                            <Play className="w-5 h-5 ml-1 fill-current" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Bottom Card Content */}
                                            <div className="p-5 flex flex-col flex-1 relative">

                                                {/* Lock icon overlaying the edge (if locked) */}
                                                {!course.isFree && (
                                                    <div className="absolute -top-7 right-5 w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground shadow-md z-20 transition-transform duration-300 group-hover:-translate-y-1 group-hover:text-foreground">
                                                        <Lock className="w-5 h-5" />
                                                    </div>
                                                )}

                                                {/* Course Title */}
                                                <h4 className="font-bold text-[17px] leading-snug mb-3 text-foreground line-clamp-2 h-[42px] mt-1">
                                                    {course.title}
                                                </h4>

                                                <div className="mt-auto space-y-4">
                                                    {/* Course Subtype */}
                                                    <div className="flex items-center">
                                                        <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">
                                                            {course.type}
                                                        </span>
                                                    </div>

                                                    {/* Stats Row (Similar to Platzi/Udemy) */}
                                                    <div className="flex items-center gap-2 pt-3 border-t border-border/50 font-medium whitespace-nowrap overflow-hidden">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                                                            <span className="text-[12px] text-foreground">{course.rating}</span>
                                                        </div>
                                                        <span className="text-border text-[10px]">•</span>
                                                        <span className="text-[12px] text-muted-foreground truncate">{course.reviews} ratings</span>
                                                        <span className="text-border text-[10px]">•</span>
                                                        <span className="text-[12px] text-muted-foreground truncate">{course.hours} hs</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bottom progress/state bar for extra visual flair */}
                                            <div className={cn(
                                                "h-1 w-full absolute bottom-0 left-0",
                                                course.isFree ? "bg-emerald-500" : "bg-border transition-colors group-hover:bg-primary/50"
                                            )} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
