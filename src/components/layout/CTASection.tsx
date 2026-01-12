import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import Link from "next/link";
import { Zap, Users, MonitorPlay, Trophy } from "lucide-react";

export function CTASection() {
    return (
        <section className="py-24 bg-black/20">
            <Container>
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">
                        ¿Por qué elegir <span className="text-[#5D5CDE]">Aurora</span>?
                    </h2>
                    <p className="text-gray-400 text-lg">
                        No somos solo una academia. Somos tu puente hacia la libertad financiera profesional.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                    {/* Main Feature - Large */}
                    <div className="md:col-span-2 row-span-1 rounded-3xl bg-[#5D5CDE] p-10 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300 border border-white/10 shadow-2xl shadow-primary/20">
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <h3 className="text-3xl font-bold text-white mb-2">Aprende Haciendo</h3>
                                <p className="text-indigo-100 text-lg max-w-md">Sin teoría aburrida. Analizamos el mercado en vivo y operamos con dinero real desde el día 1.</p>
                            </div>
                            <Link href="/courses">
                                <Button className="w-fit bg-white text-[#5D5CDE] hover:bg-gray-100 font-bold rounded-full px-8 py-6 text-lg shadow-lg shiny-hover">
                                    Ver Carreras
                                </Button>
                            </Link>
                        </div>
                        <MonitorPlay size={200} className="absolute -bottom-10 -right-10 text-white/10 group-hover:text-white/20 transition-colors rotate-12" />
                    </div>

                    {/* Feature 2 - Tall (Community) */}
                    <div className="md:col-span-1 row-span-1 rounded-3xl bg-[#1F2937] p-8 relative overflow-hidden group hover:bg-[#2D3748] transition-colors border border-white/5">
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-[#5D5CDE]/20 rounded-2xl flex items-center justify-center mb-6 text-[#5D5CDE]">
                                <Users size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Comunidad VIP</h3>
                            <p className="text-gray-400">Acceso exclusivo a nuestro Telegram. Señales, análisis diario y networking con otros traders.</p>
                        </div>
                    </div>

                    {/* Feature 3 - Fast Track */}
                    <div className="md:col-span-1 row-span-1 rounded-3xl bg-[#1F2937] p-8 relative overflow-hidden group hover:bg-[#2D3748] transition-colors border border-white/5">
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 text-emerald-500">
                                <Zap size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Rápida Salida</h3>
                            <p className="text-gray-400">Nuestros programas están diseñados para insertarte en el mercado laboral o de prop trading en meses.</p>
                        </div>
                    </div>

                    {/* Feature 4 - Mentorship (Was White) */}
                    <div className="md:col-span-2 row-span-1 rounded-3xl bg-gradient-to-br from-gray-900 to-black p-10 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300 border border-white/10">
                        <div className="relative z-10 text-white">
                            <h3 className="text-3xl font-bold mb-2">Mentoria Garantizada</h3>
                            <p className="text-gray-400 text-lg max-w-lg mb-8">
                                No estarás solo. Tienes acceso directo a tus instructores para resolver dudas y revisar tus operaciones.
                            </p>
                            <Link href="/about">
                                <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black font-bold rounded-full px-8 py-6 text-lg shiny-hover backdrop-blur-sm bg-white/5">
                                    Conocé al Equipo
                                </Button>
                            </Link>
                        </div>
                        <Trophy size={180} className="absolute -top-6 -right-6 text-white/5 group-hover:text-white/10 transition-colors" />
                    </div>
                </div>
            </Container>
        </section>
    );
}
