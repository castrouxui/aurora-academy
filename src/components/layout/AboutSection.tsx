
import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { Instagram, Send } from "lucide-react";

export function AboutSection() {
    return (
        <section className="py-24 bg-[#0B0F19]">
            <Container>
                <div className="flex flex-col items-center gap-12 text-center">
                    {/* Text Content */}
                    <div className="space-y-8 max-w-3xl mx-auto">
                        <div className="space-y-6">
                            <h2 className="text-4xl md:text-5xl font-bold text-white">
                                Sobre nosotros
                            </h2>
                            <div className="space-y-4 text-gray-400 text-lg leading-relaxed">
                                <p>
                                    Hola, soy <strong>Francisco Castro</strong>, CEO de <strong>Aurora Advisors</strong> y fundador de <strong>Aurora Academy</strong>. Soy Licenciado en Administración y especialista en mercados financieros (<Link href="https://www.cnv.gov.ar/sitioWeb/RegistrosPublicos/Idoneos" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors">Matriculado CNV 2688</Link>).
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

                        {/* Social Media Links */}
                        <div className="flex justify-center gap-6">
                            <SocialLink
                                href="https://www.instagram.com/auroradvisorsok/?locale=it_IT&hl=en"
                                icon={<Instagram size={24} />}
                                label="Instagram"
                            />
                            <SocialLink
                                href="https://t.me/Auroradvisors"
                                icon={<Send size={24} />}
                                label="Telegram"
                            />
                            <SocialLink
                                href="https://twitter.com/francastromt"
                                icon={(
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                )}
                                label="X (Twitter)"
                            />
                        </div>
                    </div>

                    {/* Image */}
                    <div className="relative w-full max-w-[300px] mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-900/20">
                        <Image
                            src="/images/francisco-speaking.png"
                            alt="Francisco Castro"
                            width={300}
                            height={400}
                            className="object-cover w-full h-auto"
                            priority
                        />
                        {/* Overlay gradient for better blending */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/20 to-transparent" />
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
