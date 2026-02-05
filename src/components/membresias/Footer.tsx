import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="relative border-t border-white/10 bg-[#0a0d14]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
                    {/* Logo & Description */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#5D5CDE] to-[#9233EA] rounded-lg flex items-center justify-center">
                                <span className="text-white font-black text-lg md:text-xl">A</span>
                            </div>
                            <div>
                                <p className="text-base md:text-lg font-bold text-white tracking-tight">
                                    AURORA
                                </p>
                                <p className="text-xs text-gray-500 -mt-0.5">ACADEMY</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                            Tu hoja de ruta para dominar los mercados financieros desde cero hasta operar como un profesional.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                            Enlaces Rápidos
                        </h3>
                        <nav className="flex flex-col space-y-2">
                            <Link
                                href="/cursos"
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Cursos
                            </Link>
                            <Link
                                href="/membresias"
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Membresías
                            </Link>
                            <Link
                                href="/nosotros"
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Nosotros
                            </Link>
                        </nav>
                    </div>

                    {/* Social & Contact */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                            Seguinos
                        </h3>
                        <div className="flex gap-3">
                            <a
                                href="https://www.instagram.com/modular.ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:scale-105"
                            >
                                <Instagram className="w-5 h-5 text-gray-400" />
                            </a>
                            <a
                                href="https://www.linkedin.com/company/modular-ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:scale-105"
                            >
                                <Linkedin className="w-5 h-5 text-gray-400" />
                            </a>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Parte de la familia{" "}
                            <a
                                href="https://modular.ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                            >
                                Modular.ai
                            </a>
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
                        <p>© {new Date().getFullYear()} Aurora Academy. Todos los derechos reservados.</p>
                        <div className="flex gap-4">
                            <Link
                                href="/terminos"
                                className="hover:text-gray-300 transition-colors"
                            >
                                Términos y Condiciones
                            </Link>
                            <Link
                                href="/privacidad"
                                className="hover:text-gray-300 transition-colors"
                            >
                                Política de Privacidad
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
