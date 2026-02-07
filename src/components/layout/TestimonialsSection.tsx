"use client";

import Image from "next/image";
import { Container } from "@/components/layout/Container";

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
        <figure className="relative w-full cursor-pointer overflow-hidden rounded-3xl border border-white/5 bg-[#0D0D0D] p-8 transition-all duration-300 hover:border-white/10 hover:bg-[#151515]">
            <div className="flex flex-row items-center gap-4 mb-6">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10">
                    <Image
                        src={review.image}
                        alt={review.author}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <figcaption className="text-base font-bold text-white">
                        {review.author}
                    </figcaption>
                    {/* Optional: Keep role if useful, or remove to match strict reference */}
                    {/* <p className="text-xs font-medium text-white/40">{review.role}</p> */}
                </div>
            </div>
            <blockquote className="text-base leading-relaxed text-gray-400 font-light">
                {review.text}
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
    // Double the array to ensure smooth infinite scroll
    const doubledReviews = [...reviews, ...reviews];

    return (
        <div
            className={cn("animate-marquee space-y-6", className)}
            style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
        >
            {doubledReviews.map((review, i) => (
                <ReviewCard key={`${review.id}-${i}`} review={review} />
            ))}
        </div>
    );
}

export function TestimonialsSection() {
    return (
        <section className="py-24 bg-[#0B0F19] relative overflow-hidden">
            <Container className="relative z-10">
                <div className="text-center mb-16 md:mb-24 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black font-display text-white mb-6 tracking-tight">
                        ¿Qué dicen nuestros <span className="text-[#5D5CDE]">alumnos</span>?
                    </h2>
                    <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed">
                        La comunidad de Aurora Academy crece día a día. Descubre por qué miles de estudiantes eligen nuestra plataforma.
                    </p>

                    {/* Social Proof Block */}
                    <div className="mt-8 flex flex-col items-center justify-center gap-3">
                        <div className="flex items-center -space-x-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0B0F19] bg-gray-800 overflow-hidden relative">
                                    <Image
                                        src={`https://ui-avatars.com/api/?name=User+${i}&background=random`}
                                        alt="User"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-[#0B0F19] bg-[#5D5CDE] flex items-center justify-center text-[10px] font-bold text-white">
                                +1k
                            </div>
                        </div>
                        <p className="text-sm font-bold text-white tracking-wide">
                            Unite a <span className="text-[#5D5CDE]">+1.000 alumnos activos</span>
                        </p>
                    </div>
                </div>

                <div className="relative h-[800px] max-h-[80vh] overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
                    <ReviewColumn reviews={TESTIMONIALS.slice(0, 3)} duration={45} />
                    <ReviewColumn reviews={TESTIMONIALS.slice(3, 6)} duration={55} className="hidden md:block" />
                    <ReviewColumn reviews={TESTIMONIALS.slice(6, 9)} duration={50} className="hidden lg:block" />
                </div>
            </Container>

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
