"use client";

import { useState } from "react";
import { PricingCard } from "@/components/pricing/PricingCard";
import { PricingCheckmark } from "@/components/pricing/PricingCheckmark";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/layout/Container";
import { PaymentModal } from "@/components/checkout/PaymentModal";
import { useSession } from "next-auth/react";
import { LoginModal } from "@/components/auth/LoginModal";

export default function PricingPage() {
    const { data: session } = useSession();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState({ title: "", price: "" });

    const handlePurchase = (title: string, price: string) => {
        if (!session) {
            setIsLoginModalOpen(true);
            return;
        }
        setSelectedCourse({ title, price });
        setIsPaymentModalOpen(true);
    };

    const tradingPlans = [
        {
            title: "Trading Inicial",
            price: "$1",
            periodicity: "único",
            students: "Nivel Básico",
            features: [
                "Introducción a los Mercados",
                "Análisis Técnico Básico",
                "Gestión de Riesgo I",
                "Acceso a Comunidad Discord",
                "Acceso inmediato y vitalicio",
                "Garantía de satisfacción (7 días)",
                "Pago 100% seguro SSL",
            ],
            isRecommended: false,
            buttonText: "Comprar ahora",
        },
        {
            title: "Trading Intermedio",
            price: "$100.000",
            periodicity: "único",
            students: "Nivel Intermedio",
            features: [
                "Estrategias de Trading",
                "Psicotrading",
                "Análisis Fundamental",
                "Sesiones en Vivo (Grabadas)",
                "Acceso inmediato y vitalicio",
                "Garantía de satisfacción (7 días)",
                "Pago 100% seguro SSL",
            ],
            isRecommended: false,
            buttonText: "Comprar ahora",
        },
        {
            title: "Trading Avanzado",
            price: "$150.000",
            periodicity: "único",
            students: "Nivel Profesional",
            features: [
                "Trading Institucional",
                "Smart Money Concepts",
                "Mentorías 1 a 1",
                "Acceso a Sala de Señales VIP",
                "Acceso inmediato y vitalicio",
                "Garantía de satisfacción (7 días)",
                "Pago 100% seguro SSL",
            ],
            isRecommended: false,
            buttonText: "Comprar ahora",
        },
    ];

    const bundlePlan = {
        title: "Trader de 0 a 100",
        price: "$250.000",
        periodicity: "único",
        students: "Bundle Completo",
        features: [
            "Todo el contenido de Inicial, Intermedio y Avanzado",
            "Descuento especial por paquete",
            "Certificación Integral",
            "Acceso prioritario a eventos",
        ],
        isRecommended: true,
        buttonText: "Obtener Oferta Completa",
    };

    const otherCourses = [
        { title: "Finanzas Personales", price: "Consultar" },
        { title: "Fondos Comunes de Inversión", price: "Consultar" },
        { title: "IA + Inversiones", price: "Consultar" },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-36 pb-12">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
                <Container className="relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Formación Profesional
                    </h1>
                    <p className="text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
                        Desde tus primeros pasos hasta operar como un profesional.
                        Elige tu nivel o lleva el paquete completo.
                    </p>
                </Container>
            </section>

            {/* Trading Path Section */}
            <section className="relative z-10 pb-16">
                <Container>
                    <h2 className="mb-12 text-center text-3xl md:text-4xl font-bold text-white">
                        Carrera de Trading
                    </h2>

                    {/* Individual Levels */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-12">
                        {tradingPlans.map((plan, index) => (
                            <PricingCard
                                key={index}
                                {...plan}
                                onAction={() => handlePurchase(plan.title, plan.price)}
                            />
                        ))}
                    </div>

                    {/* Bundle Card (Full Width Highlight) */}
                    <div className="w-full">
                        <div className="relative rounded-3xl border border-[#5D5CDE] bg-[#0B0F19] p-6 md:p-12 shadow-[0_0_50px_rgba(93,92,222,0.15)] overflow-hidden">
                            {/* Glow Effect */}
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#5D5CDE]/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                            <div className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl bg-[#5D5CDE] px-8 py-2 text-sm font-black text-white shadow-lg uppercase tracking-widest">
                                RECOMENDADO
                            </div>
                            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-center mt-8 relative z-10">
                                <div>
                                    <h3 className="text-3xl md:text-5xl font-black text-white mb-4">{bundlePlan.title}</h3>
                                    <p className="text-gray-300 text-xl font-medium">La formación definitiva para dominar los mercados.</p>
                                    <ul className="mt-8 space-y-5">
                                        {bundlePlan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-4">
                                                <div className="rounded-full bg-[#5D5CDE]/20 p-1.5 text-[#5D5CDE]">
                                                    <PricingCheckmark />
                                                </div>
                                                <span className="text-gray-200 text-lg">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="rounded-3xl bg-white/5 p-8 border border-white/10 flex flex-col items-center justify-center text-center backdrop-blur-sm shadow-2xl">
                                    <p className="text-gray-400 mb-2 font-medium uppercase tracking-wider text-sm">Precio Paquete</p>
                                    <div className="text-5xl md:text-6xl font-black text-white mb-2 drop-shadow-lg">
                                        {bundlePlan.price}
                                    </div>
                                    <p className="text-emerald-400 font-bold mb-8 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                                        ¡Ahorras $40.000 con este pack!
                                    </p>
                                    <Button
                                        className="w-full text-lg h-16 font-bold shadow-[0_0_30px_rgba(93,92,222,0.3)] hover:scale-105 transition-transform bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white shiny-hover rounded-2xl"
                                        size="lg"
                                        onClick={() => handlePurchase(bundlePlan.title, bundlePlan.price)}
                                    >
                                        {bundlePlan.buttonText}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Footer Info */}
                    <div className="mx-auto max-w-4xl mt-6 flex items-center justify-center gap-8 px-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🇦🇷</span>
                            <span>Precios en pesos argentinos.</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs">Pagá con</span>
                            <img
                                src="/mercadopago.png"
                                alt="Mercado Pago"
                                className="h-6 w-auto opacity-70 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    </div>
                </Container>
            </section>


            {/* Payment Modal */}
            {isPaymentModalOpen && (
                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    courseTitle={selectedCourse.title}
                    coursePrice={selectedCourse.price}
                />
            )}

            {/* Login Modal for unauthenticated purchases */}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                redirectUrl="/pricing"
                view="purchase"
            />
        </div>
    );
}
