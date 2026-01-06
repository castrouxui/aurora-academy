import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroBanner() {
    return (
        <section className="relative w-full py-24 md:py-32 lg:py-48 xl:py-56 overflow-hidden">
            <div className="container px-4 md:px-6 relative z-10 h-full flex flex-col items-center justify-center">
                <div className="flex flex-col items-center space-y-6 text-center">
                    <div className="space-y-4 max-w-[800px]">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-white drop-shadow-lg">
                            Aprende a Invertir con Expertos Reales
                        </h1>
                        <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl drop-shadow-md font-medium">
                            Domina los mercados financieros con nuestra plataforma educativa líder. Cursos de Trading, Inversiones y Finanzas Personales.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <Link href="/courses">
                            <Button className="h-12 px-8 text-lg w-full sm:w-auto" size="lg">Explorar Cursos</Button>
                        </Link>
                        <Link href="/pricing">
                            <Button variant="outline" className="h-12 px-8 text-lg w-full sm:w-auto text-black bg-white hover:bg-gray-200 border-transparent" size="lg">Ver Planes</Button>
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
