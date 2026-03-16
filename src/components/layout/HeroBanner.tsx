"use client";

import { Container } from "@/components/layout/Container";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LoginModal } from "@/components/auth/LoginModal";
import { getRegisteredUserCount } from "@/actions/user";
import { ArrowRight, Play } from "lucide-react";

export function HeroBanner() {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [userCount, setUserCount] = useState<number | null>(null);

    useEffect(() => {
        getRegisteredUserCount().then(setUserCount);
    }, []);

    return (
        <section className="relative w-full min-h-screen flex items-end md:items-center overflow-hidden">
            {/* Video */}
            <div className="absolute inset-0 z-0">
                <video autoPlay loop muted playsInline className="h-full w-full object-cover opacity-20">
                    <source src="/hero-video.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19]/80 via-[#0B0F19]/60 to-[#0B0F19]" />
            </div>

            <Container className="relative z-10 w-full pb-20 pt-36 md:pt-0">
                <div className="max-w-4xl">

                    {/* Label */}
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#5D5CDE] mb-8">
                        Educación Financiera · Aurora Academy
                    </p>

                    {/* Headline */}
                    <h1 className="font-black font-display tracking-tighter leading-[0.88] text-white mb-8">
                        <span className="block text-[clamp(3rem,8vw,7rem)]">Dejá de ahorrar,</span>
                        <span className="block text-[clamp(3rem,8vw,7rem)] text-[#5D5CDE]">empezá a invertir.</span>
                    </h1>

                    {/* Divider */}
                    <div className="w-16 h-px bg-white/20 mb-8" />

                    {/* Subtitle */}
                    <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl mb-12">
                        Aprendé con la metodología práctica de{" "}
                        <span className="text-white font-semibold">Fran Castro</span>.
                        Contenido 100% on-demand para proteger tu capital y dominar los mercados.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                        <Link href="/membresias">
                            <button className="group h-14 px-8 rounded-xl bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white font-bold text-base transition-colors flex items-center gap-3">
                                Ver planes
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        <Link href="/cursos/cml05hq7n00025z0eogogsnge">
                            <button className="group h-14 px-8 rounded-xl border border-white/15 text-white font-semibold text-base hover:border-white/30 hover:bg-white/5 transition-all flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center">
                                    <Play size={10} fill="white" className="ml-px" />
                                </span>
                                Curso gratis
                            </button>
                        </Link>
                    </div>

                    {/* Student count */}
                    <p className="mt-10 text-sm text-gray-500">
                        <span className="text-white font-semibold">+{userCount ?? '...'} estudiantes</span> ya están aprendiendo a invertir
                    </p>
                </div>
            </Container>

            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </section>
    );
}
