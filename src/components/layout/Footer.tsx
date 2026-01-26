import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { Facebook, Instagram, Linkedin, Twitter, Youtube, MoveRight, Bitcoin, TrendingUp, DollarSign, Send } from "lucide-react";
import { Container } from "@/components/layout/Container";

export function Footer() {
    return (
        <footer className="w-full">
            {/* Top Banner (Community Style) */}
            <div className="bg-black text-white py-12 md:py-20 relative overflow-hidden border-b border-gray-800">
                {/* Background Gradient Effect */}
                <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#5D5CDE]/20 blur-[80px] md:blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                <Container>
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-12 relative z-10">
                        {/* Left Side: Copy & CTA */}
                        <div className="flex flex-col items-center lg:items-start space-y-6 md:space-y-8 max-w-2xl text-center lg:text-left">
                            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
                                <span className="text-white text-xs md:text-sm font-medium">Comunidad Aurora</span>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
                                Estudia con traders de toda la región y crea vínculos para toda la vida
                            </h2>

                            <Link href="/membresias">
                                <Button className="shiny-hover h-14 px-8 rounded-full bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white font-black text-lg shadow-[0_0_20px_rgba(93,92,222,0.5)] transition-all hover:scale-105">
                                    Unirme a la comunidad
                                    <MoveRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>

                        {/* Right Side: Social Proof & Avatars */}
                        <div className="flex flex-col items-center lg:items-end gap-8">
                            {/* Avatar Group */}
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-12 h-12 rounded-full border-2 border-black overflow-hidden relative bg-gray-800">
                                            {/* Using generic placeholders for demo */}
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 15}`}
                                                alt="Student"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-lg leading-none">+1.000</span>
                                    <span className="text-gray-400 text-sm font-medium">Estudiantes Activos</span>
                                </div>
                            </div>

                            {/* Market Icons */}
                            <div className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mr-2">Mercados:</span>
                                <div className="flex items-center gap-4 text-white/80">
                                    <div className="flex items-center gap-2" title="Crypto">
                                        <Bitcoin size={24} className="text-orange-500" />
                                    </div>
                                    <div className="flex items-center gap-2" title="Forex">
                                        <DollarSign size={24} className="text-green-500" />
                                    </div>
                                    <div className="flex items-center gap-2" title="Stocks">
                                        <TrendingUp size={24} className="text-blue-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Bottom Footer */}
            <div className="bg-[#121620] text-gray-400 py-16 border-t border-gray-800">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

                        {/* Brand Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="space-y-4">
                                <Logo />
                                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                                    Cursos y formaciones diseñadas por traders con experiencia real en mercados.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <SocialIcon icon={<Instagram size={20} />} href="#" />
                                <SocialIcon icon={<Twitter size={20} />} href="#" />
                                <SocialIcon icon={<Youtube size={20} />} href="#" />
                                <SocialIcon icon={<Send size={20} />} href="#" />
                            </div>
                        </div>

                        {/* Links Columns */}
                        <div className="space-y-4">
                            <h4 className="text-white font-semibold uppercase text-sm tracking-wider">Plataforma</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="/cursos" className="hover:text-white transition-colors">Cursos</Link></li>
                                <li><Link href="/membresias" className="hover:text-white transition-colors">Precios</Link></li>
                                <li><Link href="/nosotros" className="hover:text-white transition-colors">Nosotros</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-white font-semibold uppercase text-sm tracking-wider">Legales</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="/terms" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
                                <li><Link href="/privacy" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
                                <li><Link href="/refund-policy" className="hover:text-white transition-colors">Política de Reembolso</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-white font-semibold uppercase text-sm tracking-wider">Ayuda</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="mailto:contacto@auroracademy.net" className="hover:text-white transition-colors">Contacto</Link></li>
                            </ul>
                        </div>

                    </div>

                    <div className="mt-16 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
                        © 2026 - Aurora Advisors. Todos los derechos reservados.
                    </div>
                </Container>
            </div>
        </footer>
    );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
    return (
        <a href={href} className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
            {icon}
        </a>
    );
}
