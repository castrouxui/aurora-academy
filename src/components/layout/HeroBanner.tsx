import { Button } from "@/components/ui/button";
import Image from "next/image";

export function HeroBanner() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#4F46E5] to-[#7C3AED] px-8 py-16 md:px-16 md:py-20 text-white shadow-2xl">
                <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            Aprendé a invertir <br />
                            desde cero
                        </h1>
                        <p className="text-lg md:text-xl text-indigo-100 max-w-lg">
                            Cursos e informaciones diseñadas por traders con experiencia real en mercados. Formación clara, práctica y enfocada en decisiones reales.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold border-none">
                                Ver Cursos
                            </Button>
                            <Button size="lg" variant="outline" className="text-white border-white bg-transparent hover:bg-white/20">
                                Play Tour
                            </Button>
                        </div>
                    </div>

                    <div className="relative h-[300px] md:h-[400px] w-full hidden md:block">
                        {/* Placeholder for the guy looking at screens */}
                        <div className="absolute inset-0 bg-black/20 rounded-xl overflow-hidden backdrop-blur-xs border border-white/10 flex items-center justify-center">
                            {/* In a real app, use next/image here */}
                            <span className="text-white/50">[Imagen Trader]</span>
                        </div>
                        {/* We can use a generated image later if requested */}
                        {/* Decorative background elements inside the card */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl"></div>
                    </div>
                </div>

                {/* Background Overlay Texture or Gradient adjustments */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-black/10 to-transparent pointer-events-none"></div>
            </div>

            {/* Brand Logos Strip (As seen in design below hero) */}
            <div className="py-12 flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="text-xl font-bold">NETFLIX</span>
                <span className="text-xl font-bold">verizon</span>
                <span className="text-xl font-bold">Microsoft</span>
                <span className="text-xl font-bold">Google</span>
                <span className="text-xl font-bold">Lenovo</span>
            </div>
        </div>
    );
}
