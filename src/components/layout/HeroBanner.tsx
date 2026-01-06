import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroBanner() {
    return (
        <section className="relative w-full py-24 md:py-32 lg:py-48 xl:py-56 overflow-hidden">
            <div className="container px-4 md:px-6 relative z-10 h-full flex flex-col items-center justify-center">
                <div className="flex flex-col items-center space-y-6 text-center">
                    <div className="space-y-4 max-w-[800px]">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-white drop-shadow-lg">
                            Aprendé a invertir desde cero
                        </h1>
                        <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl drop-shadow-md font-medium leading-relaxed">
                            Cursos y formaciones diseñadas por <strong className="text-white">traders con experiencia real en mercados</strong>.
                            Formación clara, práctica y enfocada en <strong className="text-white">decisiones reales</strong>.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <Link href="/pricing">
                            <Button className="h-12 px-8 text-lg w-full sm:w-auto bg-white text-black hover:bg-gray-200 border-transparent font-semibold" size="lg">
                                Acceder
                            </Button>
                        </Link>
                        <Link href="#categories" scroll={true}>
                            <Button variant="ghost" className="h-12 px-8 text-lg w-full sm:w-auto text-white hover:bg-white/10 hover:text-white" size="lg">
                                Explorar
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover opacity-50"
                >
                    <source src="/hero-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                {/* Gradient Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/40 to-[#0B0F19]/30"></div>
            </div>
        </section>
    );
}
