
import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { Instagram, Send } from "lucide-react";

export function AboutSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B0F19] pt-32 md:pt-40 pb-20">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#5D5CDE]/10 rounded-full blur-[120px] -mr-40 -mt-40 mix-blend-screen" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] -ml-20 -mb-20 mix-blend-screen" />
            </div>

            <Container className="relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">

                    {/* Content */}
                    <div className="flex-1 text-center md:text-left space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5D5CDE]/10 border border-[#5D5CDE]/20 text-[#5D5CDE] text-xs font-bold uppercase tracking-wider mb-6">
                                <span>La Misión</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black font-display text-white leading-[0.95] tracking-tighter mb-8 max-w-4xl">
                                Democratizando el <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5D5CDE] to-indigo-400">Trading Profesional</span>
                            </h1>
                            <div className="space-y-4 text-gray-400 text-lg leading-relaxed max-w-2xl text-justify">
                                <p>
                                    Hola, soy <strong className="text-white">Francisco Castro</strong>, CEO de <strong>Aurora Advisors</strong> y Co-Fundador de <strong>Aurora Academy</strong>. Soy Licenciado en Administración y especialista en mercados financieros (<Link href="https://www.cnv.gov.ar/sitioWeb/RegistrosPublicos/Idoneos" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">Matriculado CNV 2688</Link>).
                                </p>
                                <p>
                                    Con más de 10 años de experiencia en el sector bursátil, he asesorado a cientos de individuos y empresas. Sin embargo, mi verdadera pasión radica en la educación: creé Aurora Academy con la misión de democratizar el acceso al conocimiento financiero profesional.
                                </p>
                                <p>
                                    En esta academia, vuelco toda mi experiencia práctica y teórica para que no solo inviertas, sino que entiendas el <em>porqué</em> detrás de cada decisión. Busco formarte para que puedas navegar los mercados con criterio propio, disciplina y herramientas estadísticas avanzadas.
                                </p>
                                <p>
                                    Ya sea que estés dando tus primeros pasos o busques profesionalizar tu estrategia, aquí encontrarás un camino claro y estructurado para potenciar tu libertad financiera.
                                </p>
                            </div>
                        </div>

                        {/* Social Stats / Links */}
                        <div className="flex flex-col sm:flex-row items-center md:items-start gap-6 pt-4">
                            <div className="flex gap-4">
                                <SocialLink
                                    href="https://www.instagram.com/auroradvisorsok/?locale=it_IT&hl=en"
                                    icon={<Instagram size={20} />}
                                    label="Instagram"
                                />
                                {/* <SocialLink
                                    href="https://t.me/Auroradvisors"
                                    icon={<Send size={20} />}
                                    label="Telegram"
                                /> */}
                                <SocialLink
                                    href="https://twitter.com/francastromt"
                                    icon={(
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                    )}
                                    label="X"
                                />
                            </div>
                            <div className="h-px sm:h-auto w-Full sm:w-px bg-gray-800" />
                            <div className="flex items-center gap-3">
                                <Link href="https://www.cnv.gov.ar/sitioWeb/RegistrosPublicos/Idoneos" target="_blank" className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Matrícula CNV #2688
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Image / Visual */}
                    <div className="flex-1 relative w-full max-w-[500px] md:max-w-none">
                        <div className="relative aspect-[4/5] md:aspect-square w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/10 group">
                            <Image
                                src="/images/francisco-speaking.png"
                                alt="Francisco Castro"
                                fill
                                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-60" />

                            {/* Floating Badge */}
                            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
                                <p className="font-bold text-white">Francisco Castro</p>
                                <p className="text-xs text-gray-400">Fundador & Head Trader</p>
                            </div>
                        </div>

                        {/* Decorative elements behind */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -z-10" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl -z-10" />
                    </div>

                </div>
            </Container>
        </section>
    );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 hover:-translate-y-1 shiny-hover"
            aria-label={label}
        >
            <div className="text-gray-400 group-hover:text-blue-400 transition-colors">
                {icon}
            </div>
        </Link>
    );
}
