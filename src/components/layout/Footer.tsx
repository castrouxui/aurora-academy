import Link from "next/link";
import { Logo } from "./Logo";
import { Instagram, Youtube, Send } from "lucide-react";
import { Container } from "@/components/layout/Container";

function XIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor" width="1em" height="1em">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
        </svg>
    );
}

export function Footer() {
    return (
        <footer className="w-full border-t border-border bg-background">
            <Container className="py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Logo />
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            Cursos y formaciones diseñadas por traders con experiencia real en mercados.
                        </p>
                        <div className="flex gap-2">
                            <SocialIcon icon={<Instagram size={16} />} href="https://www.instagram.com/auroradvisorsok/" />
                            <SocialIcon icon={<XIcon className="w-4 h-4" />} href="https://x.com/francastromt" />
                            <SocialIcon icon={<Youtube size={16} />} href="https://www.youtube.com/channel/UCkMuy306bU7ZOrNb3NgYqew" />
                            <SocialIcon icon={<Send size={16} />} href="https://t.me/Auroradvisors" />
                        </div>
                    </div>

                    {/* Links */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Plataforma</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/cursos" className="text-muted-foreground hover:text-foreground transition-colors">Cursos</Link></li>
                            <li><Link href="/membresias" className="text-muted-foreground hover:text-foreground transition-colors">Precios</Link></li>
                            <li><Link href="/mentoria" className="text-muted-foreground hover:text-foreground transition-colors">Mentoría 1:1</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Legales</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Términos y Condiciones</Link></li>
                            <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Política de Privacidad</Link></li>
                            <li><Link href="/refund-policy" className="text-muted-foreground hover:text-foreground transition-colors">Política de Reembolso</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Ayuda</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/contacto" className="text-muted-foreground hover:text-foreground transition-colors">Contacto</Link></li>
                            <li><Link href="mailto:contacto@auroracademy.net" className="text-muted-foreground hover:text-foreground transition-colors">contacto@auroracademy.net</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <span>&copy; 2026 Aurora Advisors. Todos los derechos reservados.</span>
                    <div className="flex items-center gap-4">
                        <Link href="/terms" className="hover:text-foreground transition-colors">Términos</Link>
                        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacidad</Link>
                        <Link href="/refund-policy" className="hover:text-foreground transition-colors">Reembolso</Link>
                    </div>
                </div>
            </Container>
        </footer>
    );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors">
            {icon}
        </a>
    );
}
