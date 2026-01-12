"use client";

import { Container } from "@/components/layout/Container";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/auth/LoginModal";

export function HeroBanner() {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    return (
        <section className="relative w-full py-24 md:py-32 lg:py-48 xl:py-56 overflow-hidden">
            <Container className="relative z-10 h-full flex flex-col items-center justify-center">
                <div className="flex flex-col items-center space-y-8 text-center">
                    <div className="space-y-6 max-w-[900px]">
                        <h1 className="text-5xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-8xl/none text-white drop-shadow-xl uppercase">
                            Invertí en tu futuro.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5D5CDE] to-indigo-400">Domina el mercado.</span>
                        </h1>
                        <p className="mx-auto max-w-[800px] text-gray-200 text-lg md:text-2xl drop-shadow-md font-medium leading-relaxed">
                            Carreras intensivas en <strong className="text-white">Trading, Crypto y Finanzas</strong>.
                            <br className="hidden md:block" />
                            Online, en vivo y a tu ritmo. 100% Práctico.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <Button
                            onClick={openLoginModal}
                            className="h-14 px-10 text-xl w-full sm:w-auto bg-[#5D5CDE] text-white hover:bg-[#4B4AC0] border-transparent font-bold rounded-full shadow-[0_0_40px_-10px_rgba(93,92,222,0.6)] transition-transform hover:scale-105"
                        >
                            Aplicar Ahora
                        </Button>
                        <Link href="#courses">
                            <Button variant="outline" className="h-14 px-10 text-xl w-full sm:w-auto text-white border-white/20 bg-white/5 hover:bg-white hover:text-black font-bold rounded-full backdrop-blur-sm transition-transform hover:scale-105">
                                Explorar Carreras
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
                {/* Gradient Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/40 to-[#0B0F19]/30"></div>
            </div>

            {/* Login Modal */}
            <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
        </section>
    );
}
