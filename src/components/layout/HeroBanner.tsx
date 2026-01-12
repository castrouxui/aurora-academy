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

        <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
            <Container className="relative z-10 w-full flex flex-col items-center justify-center pt-20">
                <div className="flex flex-col items-center space-y-6 md:space-y-8 text-center px-4 md:px-0">
                    <div className="space-y-4 md:space-y-6 max-w-[900px]">
                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl/none font-black tracking-tighter text-white drop-shadow-lg mb-4 md:mb-6">
                            Aprendé a invertir desde cero
                        </h1>
                        <p className="mx-auto max-w-[700px] text-gray-200 text-base sm:text-lg md:text-xl drop-shadow-md font-medium leading-relaxed mb-6 md:mb-8">
                            Cursos y formaciones diseñadas por <strong className="text-white">traders con experiencia real en mercados</strong>.
                            Formación clara, práctica y enfocada en <strong className="text-white">decisiones reales</strong>.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                        <Button
                            onClick={openLoginModal}
                            className="h-12 sm:h-14 px-8 sm:px-10 text-lg sm:text-xl w-full sm:w-auto bg-[#5D5CDE] text-white hover:bg-[#4B4AC0] border-transparent font-bold rounded-full shadow-lg shiny-hover transition-transform hover:scale-105"
                        >
                            Aplicar Ahora
                        </Button>
                        <Link href="#courses" className="w-full sm:w-auto">
                            <Button variant="outline" className="h-12 sm:h-14 px-8 sm:px-10 text-lg sm:text-xl w-full sm:w-auto text-white border-white/20 bg-white/5 hover:bg-white hover:text-black font-bold rounded-full backdrop-blur-sm transition-transform hover:scale-105">
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
                {/* Gradient Overlay for better text readability and seamless transition */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/50 to-[#0B0F19]/40"></div>
            </div>

            {/* Login Modal */}
            <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
        </section>
    );
}
