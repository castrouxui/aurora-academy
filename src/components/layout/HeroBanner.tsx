"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { getRegisteredUserCount, getReviewAvatars } from "@/actions/user";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/auth/LoginModal";

export function HeroBanner() {
    const [userCount, setUserCount] = useState<number | null>(null);
    const [avatars, setAvatars] = useState<string[]>([]);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    useEffect(() => {
        getRegisteredUserCount().then(count => {
            setUserCount(count);
        });
        getReviewAvatars().then((imgs: string[]) => {
            setAvatars(imgs.slice(0, 4));
        });
    }, []);

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    return (

        <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
            <Container className="relative z-10 w-full flex flex-col items-center justify-center pt-40 md:pt-48">
                <div className="flex flex-col items-center space-y-6 md:space-y-8 text-center px-4 md:px-0">
                    <div className="space-y-4 md:space-y-6 max-w-[900px]">
                        {/* High-Impact Social Proof Pill */}
                        <div className="inline-flex items-center gap-4 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-1000">
                            <div className="flex -space-x-3">
                                {avatars.length > 0 ? avatars.map((src, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0B0F19] overflow-hidden bg-gray-800">
                                        <img src={src} alt="Student" className="w-full h-full object-cover" />
                                    </div>
                                )) : (
                                    <div className="w-8 h-8 rounded-full border-2 border-[#0B0F19] bg-gray-800 animate-pulse" />
                                )}
                            </div>
                            <div className="flex flex-col items-start leading-none">
                                <span className="text-white font-bold text-sm">+{userCount || '...'}</span>
                                <span className="text-gray-400 text-[9px] font-bold uppercase tracking-wider">Estudiantes Activos</span>
                            </div>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-2xl mb-4 md:mb-6 font-display leading-[0.95]">
                            Dejá de ahorrar,<br />
                            <span className="text-[#5D5CDE]">
                                empezá a invertir.
                            </span>
                        </h1>

                        <p className="mx-auto max-w-[750px] text-gray-300 text-base sm:text-lg md:text-xl font-medium leading-relaxed mb-6 md:mb-8 md:px-6">
                            Aprendé con la metodología práctica de <span className="text-white font-bold">Fran Castro</span>. Contenido 100% on-demand para proteger tu capital y dominar el mercado. Sin vueltas.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                        <Link href="/membresias" className="w-full sm:w-auto">
                            <Button
                                className="h-16 px-10 text-base font-bold w-full sm:w-auto bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white rounded-xl shadow-xl shadow-[#5D5CDE]/20 transition-all active:scale-95"
                            >
                                Ver planes
                            </Button>
                        </Link>
                        <Link href="/cursos/cml05hq7n00025z0eogogsnge" className="w-full sm:w-auto relative z-20">
                            <Button variant="outline" className="h-16 px-10 text-base font-bold w-full sm:w-auto text-white border border-white/20 bg-white/5 hover:bg-white hover:text-black rounded-xl backdrop-blur-sm transition-all active:scale-95">
                                Curso gratis: El camino del inversor
                            </Button>
                        </Link>
                    </div>
                </div>
            </Container>

            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover opacity-50"
                >
                    <source src="/hero-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                {/* Gradient Overlay for better text readability and seamless transition */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/50 to-[#0B0F19]/40"></div>
            </div>

            {/* Login Modal */}
            <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
        </section>
    );
}
