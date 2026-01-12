"use client";

import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Quote, Star } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface Testimonial {
    id: number;
    author: string;
    text: string;
    image: string;
    role: string;
}

const TESTIMONIALS: Testimonial[] = [
    {
        id: 1,
        author: "Ezequiel",
        text: "La plataforma es increíblemente intuitiva y los cursos están muy bien estructurados. Llevo 6 meses estudiando y mis resultados han mejorado notablemente gracias a la claridad del contenido.",
        image: "https://framerusercontent.com/images/p7bvoFnbGtK8RZ1HSLiAUiHxx8.jpg",
        role: "Alumno de Trading"
    },
    {
        id: 2,
        author: "Pato Touceda",
        text: "Lo mejor de Aurora Academy es la calidad de producción de las lecciones. Los videos en alta definición y los recursos descargables hacen que aprender conceptos complejos sea un placer.",
        image: "https://framerusercontent.com/images/AvfrQfX4hg4yY1cKJQO4OAaXQ.png",
        role: "Alumno de Crypto"
    },
    {
        id: 3,
        author: "Juany",
        text: "La calidad de los cursos y la plataforma es de otro nivel. Las bitácoras y el seguimiento personalizado marcan la diferencia. Nunca había visto una academia tan completa.",
        image: "https://framerusercontent.com/images/2zaizaltMbd0hfmlArpqcyuC20.png",
        role: "Suscriptor Pro"
    },
    {
        id: 4,
        author: "Santino Herrera",
        text: "Más allá de las alertas, lo que más valoro es el contenido educativo. He aprendido más aquí en 3 meses que en años buscando información por mi cuenta. La plataforma es un 10.",
        image: "https://framerusercontent.com/images/IZ6QsMgI2gFXUCOrdoCUsgOcvk.jpg",
        role: "Alumno de Trading"
    },
    {
        id: 5,
        author: "Juan Huérfano",
        text: "Una plataforma robusta y confiable. Los cursos van directo al grano sin perder tiempo en teoría innecesaria. Es, sin dudas, la mejor inversión en mi educación financiera.",
        image: "https://framerusercontent.com/images/4KykQdxaykJ3SmZZ9orjS0MT8.jpg",
        role: "Alumno Avanzado"
    },
    {
        id: 6,
        author: "Fabián",
        text: "Empecé sin saber nada y ahora opero con confianza gracias al curso de análisis técnico. La metodología explicada en la plataforma es única y fácil de aplicar.",
        image: "https://framerusercontent.com/images/ReDEVMJsLlrTYoDjEJ0Y42clXY.png",
        role: "Alumno Inicial"
    },
    {
        id: 7,
        author: "Graciela",
        text: "La estructura de los cursos te permite ir a tu propio ritmo. Me encanta cómo la plataforma te guía paso a paso, combinando teoría con práctica en tiempo real. ¡Excelente experiencia!",
        image: "https://framerusercontent.com/images/zWYaQp7huo4iC7pJ5b9SfnRR4.jpg",
        role: "Alumna de Inversiones"
    },
    {
        id: 8,
        author: "Cristian",
        text: "Llevo años en esto y nunca vi una plataforma tan completa. Desde los videos hasta el soporte, todo está pensado para que aprendas de verdad y no pierdas el tiempo.",
        image: "https://framerusercontent.com/images/zKJ6HAHTifYjmA2FxMEnpqy1jEg.png",
        role: "Suscriptor Plus"
    },
    {
        id: 9,
        author: "Adrián",
        text: "La interfaz es moderna, súper rápida y funciona perfecto en el celular. Da gusto estudiar así. Además, los contenidos se actualizan constantemente con nuevas estrategias.",
        image: "https://framerusercontent.com/images/Ush6w0oEeByTIiHE4LqQyBcb3Ng.jpg",
        role: "Alumno de Trading"
    }
];

function ReviewCard({ review }: { review: Testimonial }) {
    return (
        <figure className="relative h-full w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
            <div className="flex flex-row items-center gap-3 mb-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20">
                    <Image
                        src={review.image}
                        alt={review.author}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <figcaption className="text-sm font-bold text-white">
                        {review.author}
                    </figcaption>
                    <p className="text-xs font-medium text-[#5D5CDE]">{review.role}</p>
                </div>
                <div className="ml-auto">
                    <Quote className="text-white/20" size={20} />
                </div>
            </div>
            <blockquote className="text-sm leading-relaxed text-gray-300 font-medium">
                "{review.text}"
            </blockquote>
        </figure>
    );
}

function ReviewColumn({
    reviews,
    className,
    duration = 20
}: {
    reviews: Testimonial[];
    className?: string;
    duration?: number;
}) {
    const columnRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={columnRef}
            className={cn("animate-marquee space-y-6", className)}
            style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
        >
            {reviews.concat(reviews).map((review, i) => (
                <ReviewCard key={`${review.id}-${i}`} review={review} />
            ))}
        </div>
    );
}

export function TestimonialsSection() {
    return (
        <section className="py-24 bg-[#0B0F19] relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none opacity-50" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none opacity-50" />

            <Container className="relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
                        ¿Qué dicen nuestros <span className="text-[#5D5CDE]">alumnos</span>?
                    </h2>
                    <p className="text-lg text-gray-400">
                        La comunidad de Aurora Academy crece día a día. Descubre por qué miles de estudiantes eligen nuestra plataforma para formarse.
                    </p>
                </div>

                <div className="relative h-[700px] max-h-[80vh] overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
                    <ReviewColumn reviews={TESTIMONIALS.slice(0, 3)} duration={40} />
                    <ReviewColumn reviews={TESTIMONIALS.slice(3, 6)} duration={50} className="hidden md:block" />
                    <ReviewColumn reviews={TESTIMONIALS.slice(6, 9)} duration={45} className="hidden lg:block" />
                </div>
            </Container>

            {/* Custom Animation Styles */}
            <style jsx global>{`
                @keyframes marquee {
                    from { transform: translateY(0); }
                    to { transform: translateY(calc(-50% - 12px)); }
                }
                .animate-marquee {
                    animation: marquee var(--marquee-duration) linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
