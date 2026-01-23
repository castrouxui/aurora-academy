import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import Link from "next/link";
import { Zap, Users, MonitorPlay, Trophy } from "lucide-react";

export function CTASection() {
    return (
        <section className="py-24 bg-black/20">
            <Container>
                <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                    <h2 className="text-2xl md:text-5xl font-black text-white mb-4 md:mb-6 uppercase tracking-tight">
                        ¿Por qué elegir <span className="text-[#5D5CDE]">Aurora</span>?
                    </h2>
                    <p className="text-gray-400 text-base md:text-lg">
                        No somos solo una academia. Somos tu puente hacia la libertad financiera profesional.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6 auto-rows-auto md:auto-rows-[300px]">
                    {/* Main Feature - Large */}
                    <div className="md:col-span-2 row-span-1 rounded-3xl bg-[#5D5CDE] p-6 md:p-10 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300 border border-white/10 shadow-2xl shadow-primary/20 min-h-[250px] md:min-h-0">
                        <div className="relative z-10 h-full flex flex-col justify-between gap-6 md:gap-0">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Aprende Haciendo</h3>
                                <p className="text-indigo-100 text-sm md:text-lg max-w-md">Sin teoría aburrida. Analizamos el mercado en vivo y operamos con dinero real desde el día 1.</p>
                            </div>
                            <Link href="/courses">
                                <Button className="w-fit bg-white text-[#5D5CDE] hover:bg-gray-100 font-bold rounded-full px-6 py-4 md:px-8 md:py-6 text-base md:text-lg shadow-lg shiny-hover">
                                    Ver Carreras
                                </Button>
                            </Link>
                        </div>
                        <MonitorPlay className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 text-white/10 group-hover:text-white/20 transition-colors rotate-12 w-32 h-32 md:w-[200px] md:h-[200px]" />
                    </div>

                    {/* Feature 2 - Tall (Community) */}
                    <div className="md:col-span-1 row-span-1 rounded-3xl bg-[#1F2937] p-6 md:p-8 relative overflow-hidden group hover:bg-[#2D3748] transition-colors border border-white/5 min-h-[200px] md:min-h-0">
                        <div className="relative z-10">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-[#5D5CDE]/20 rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-[#5D5CDE]">
                                <Users size={28} className="md:w-8 md:h-8" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Comunidad VIP</h3>
                            <p className="text-sm md:text-base text-gray-400">Acceso exclusivo a nuestro Telegram. Señales, análisis diario y networking con otros traders.</p>
                        </div>
                    </div>

                    {/* Feature 3 - Fast Track */}
                    <div className="md:col-span-1 row-span-1 rounded-3xl bg-[#1F2937] p-6 md:p-8 relative overflow-hidden group hover:bg-[#2D3748] transition-colors border border-white/5 min-h-[200px] md:min-h-0">
                        <div className="relative z-10">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-emerald-500">
                                <Zap size={28} className="md:w-8 md:h-8" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Educación Financiera</h3>
                            <p className="text-sm md:text-base text-gray-400">Programas integrales diseñados para que domines los mercados financieros y alcances tu libertad económica.</p>
                        </div>
                    </div>

                    {/* Feature 4 - Mentorship (Was White) */}
                    <div className="md:col-span-2 row-span-1 rounded-3xl bg-gradient-to-br from-gray-900 to-black p-6 md:p-10 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300 border border-white/10 min-h-[250px] md:min-h-0">
                        <div className="relative z-10 text-white h-full flex flex-col justify-between gap-6 md:gap-0">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-2">Mentoria Garantizada</h3>
                                <p className="text-gray-400 text-sm md:text-lg max-w-lg mb-0 md:mb-8">
                                    No estarás solo. Tienes acceso directo a tus instructores para resolver dudas y revisar tus operaciones.
                                </p>
                            </div>
                            <Link href="/about">
                                <Button variant="outline" className="w-fit border-white/20 text-white hover:bg-white hover:text-black font-bold rounded-full px-6 py-4 md:px-8 md:py-6 text-base md:text-lg shiny-hover backdrop-blur-sm bg-white/5">
                                    Conocé al Equipo
                                </Button>
                            </Link>
                        </div>
                        <Trophy className="absolute -top-4 -right-4 md:-top-6 md:-right-6 text-white/5 group-hover:text-white/10 transition-colors w-32 h-32 md:w-[180px] md:h-[180px]" />
                    </div>
                </div>
            </Container>
        </section>
    );
}
