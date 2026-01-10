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
                        <div className="relative rounded-3xl border border-primary bg-[#1F2937] p-6 md:p-12 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-xl bg-primary px-6 py-2 text-sm font-bold text-white shadow-lg uppercase tracking-wider">
                                RECOMENDADO
                            </div>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center mt-4">
                                <div>
                                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{bundlePlan.title}</h3>
                                    <p className="text-gray-400 text-lg">La formación definitiva para dominar los mercados.</p>
                                    <ul className="mt-8 space-y-4">
                                        {bundlePlan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-3">
                                                <div className="rounded-full bg-primary/20 p-1">
                                                    <PricingCheckmark />
                                                </div>
                                                <span className="text-gray-200 text-lg">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="rounded-2xl bg-[#0B0F19] p-6 md:p-8 border border-gray-800 flex flex-col items-center justify-center text-center">
                                    <p className="text-gray-400 mb-2">Precio Paquete</p>
                                    <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                                        {bundlePlan.price}
                                    </div>
                                    <p className="text-emerald-400 font-medium mb-8">
                                        Estás ahorrando $40.000 al invertir en este paquete
                                    </p>
                                    <Button
                                        className="w-full text-lg h-14 font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-transform"
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
