"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { Container } from "./Container";
import { UserMenu } from "./UserMenu";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/cursos", label: "Cursos" },
        { href: "/mentoria", label: "Mentoría 1:1" },
        { href: "/membresias", label: "Precios" },
        { href: "/contacto", label: "Contacto" },
    ];

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-[500] h-16 flex items-center transition-colors duration-300",
                isScrolled
                    ? "bg-background/95 border-b border-border/60"
                    : "bg-transparent"
            )}
        >
            <Container className="flex items-center justify-between">
                {/* Left: Logo & Nav Links */}
                <div className="flex items-center gap-8">
                    <Logo />

                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-semibold transition-colors tracking-tight",
                                    pathname === link.href
                                        ? "text-primary"
                                        : "text-foreground/70 hover:text-foreground"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right: Auth & Mobile Menu */}
                <div className="flex items-center gap-3">
                    {/* Auth Buttons (Desktop) */}
                    <div className="hidden md:flex items-center gap-2">
                        {session ? (
                            <UserMenu />
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    asChild
                                    className="rounded-full text-sm font-semibold text-foreground/70 hover:text-foreground hover:bg-muted"
                                >
                                    <Link href="/login">Inicia Sesión</Link>
                                </Button>
                                <Button
                                    asChild
                                    className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6"
                                >
                                    <Link href="/register">Regístrate</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted transition-colors"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </Container>

            {/* Mobile Menu - Slide Down Panel */}
            <div
                className={cn(
                    "absolute top-16 left-0 right-0 bg-background border-b border-border transition-all duration-300 md:hidden overflow-hidden",
                    isMobileMenuOpen
                        ? "max-h-[400px] opacity-100"
                        : "max-h-0 opacity-0 pointer-events-none"
                )}
            >
                <div className="px-6 py-6 space-y-4">
                    <nav className="flex flex-col gap-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "text-base font-semibold py-2 transition-colors",
                                    pathname === link.href
                                        ? "text-primary"
                                        : "text-foreground/80 hover:text-foreground"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="pt-4 border-t border-border space-y-3">
                        {session ? (
                            <UserMenu />
                        ) : (
                            <>
                                <Button asChild variant="outline" className="w-full rounded-lg">
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        Inicia Sesión
                                    </Link>
                                </Button>
                                <Button asChild className="w-full rounded-lg">
                                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                        Crear cuenta gratis
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
