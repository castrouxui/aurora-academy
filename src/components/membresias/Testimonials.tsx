import { Star } from "lucide-react";
import Image from "next/image";

interface Testimonial {
    name: string;
    role: string;
    quote: string;
    avatar: string;
    rating: number;
}

const TESTIMONIALS: Testimonial[] = [
    {
        name: "Marcos L.",
        role: "Trader de Divisas",
        quote: "Metodología directa y sin vueltas. En poco tiempo logré estructurar mi operativa con un criterio profesional real.",
        avatar: "/testimonials/marcos.jpg",
        rating: 5,
    },
    {
        name: "Sofía R.",
        role: "Inversora Institucional",
        quote: "El soporte de la comunidad es lo que hace la diferencia. No estás solo ante el gráfico, el análisis compartido es invaluable.",
        avatar: "/testimonials/sofia.jpg",
        rating: 5,
    },
    {
        name: "Javier G.",
        role: "Especialista en Mercados",
        quote: "La metodología práctica de Fran me permitió proteger mi capital en momentos de alta volatilidad. Es trading real.",
        avatar: "/testimonials/javier.jpg",
        rating: 5,
    },
];

export function Testimonials() {
    return (
        <section className="relative py-16 md:py-20 bg-[#0a0d14]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-3 font-display uppercase tracking-tight">
                        Lo que dicen nuestros alumnos
                    </h2>
                    <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
                        Historias reales de transformación financiera
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {TESTIMONIALS.map((testimonial, index) => (
                        <div
                            key={index}
                            className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-transparent backdrop-blur-sm p-6 md:p-8 transition-all duration-300 hover:border-white/20 hover:shadow-xl"
                        >
                            {/* Subtle top accent */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-4 h-4 fill-amber-400 text-amber-400"
                                    />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-6">
                                "{testimonial.quote}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
                                <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                                    <span className="text-lg font-bold text-white">
                                        {testimonial.name.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
