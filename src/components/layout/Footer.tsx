import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { Container } from "@/components/layout/Container";

export function Footer() {
    return (
        <footer className="w-full">
            {/* Top Banner */}
            <div className="bg-[#4F46E5] text-white py-16">
                <Container className="flex flex-col items-center text-center gap-12">

                    {/* Left Text & Buttons */}
                    <div className="max-w-2xl space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                            Aprendé junto a los +1000 alumnos de todo el mundo.
                        </h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/my-courses">
                                <Button className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold h-11 px-6">
                                    Unite A La Comunidad
                                </Button>
                            </Link>
                            <Link href="/courses">
                                <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white h-11 px-6 bg-white/20 border border-transparent">
                                    Ver todos los cursos
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        <div>
                            <p className="text-3xl font-bold">+10</p>
                            <p className="text-indigo-200 text-sm mt-1">Cursos online</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold">+1000</p>
                            <p className="text-indigo-200 text-sm mt-1">Alumnos certificados</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold">100%</p>
                            <p className="text-indigo-200 text-sm mt-1">Tasa de éxito</p>
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
                            <div className="scale-100 origin-left">
                                <Logo />
                            </div>
                            <p className="text-sm leading-relaxed max-w-sm">
                                Aliquam rhoncus ligula est, non pulvinar elit convallis nec. Donec mattis odio at.
                            </p>
                            <div className="flex gap-4">
                                <SocialIcon icon={<Instagram size={20} />} href="#" />
                                <SocialIcon icon={<Twitter size={20} />} href="#" />
                                <SocialIcon icon={<Youtube size={20} />} href="#" />
                            </div>
                        </div>

                        {/* Links Columns */}
                        <div className="space-y-4">
                            <h4 className="text-white font-semibold uppercase text-sm tracking-wider">Sección</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="#" className="hover:text-white transition-colors">Development</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Finance & Accounting</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Design</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Business</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-white font-semibold uppercase text-sm tracking-wider">Sección</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors flex items-center gap-2">Become Instructor <span className="text-indigo-400">→</span></Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Career</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-white font-semibold uppercase text-sm tracking-wider">Sección</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">FAQs</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Terms & Condition</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
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
