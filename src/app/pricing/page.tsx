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
            title: "Inicial",
            price: "$10",
            periodicity: "único",
            students: "Nivel Básico",
            features: [
                "Introducción a los Mercados",
                "Análisis Técnico Básico",
                "Gestión de Riesgo I",
                "Acceso a Comunidad Discord",
            ],
            isRecommended: false,
            buttonText: "Comprar ahora",
        },
        {
            title: "Intermedio",
            price: "$100.000",
            periodicity: "único",
            students: "Nivel Intermedio",
            features: [
                "Estrategias de Trading",
                "Psicotrading",
                "Análisis Fundamental",
                "Sesiones en Vivo (Grabadas)",
            ],
            isRecommended: false,
            buttonText: "Comprar ahora",
        },
        {
            title: "Avanzado",
            price: "$150.000",
            periodicity: "único",
            students: "Nivel Profesional",
            features: [
                "Smart Money Concepts",
                "Trading Institucional",
                "Mentoría 1 a 1",
                "Acceso Vitalicio",
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
            <section className="relative overflow-hidden py-16 sm:py-24">
                <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50 blur-3xl"></div>
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
                        <div className="relative rounded-3xl border border-primary bg-[#1F2937] p-8 shadow-2xl md:p-12 overflow-hidden">
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
                                <div className="rounded-2xl bg-[#0B0F19] p-8 border border-gray-800 flex flex-col items-center justify-center text-center">
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

            {/* Other Courses Section */}
            <section className="py-16 bg-card/20 border-t border-gray-800">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h2 className="mb-8 text-center text-3xl font-bold">
                        Otros Cursos Especializados
                    </h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {otherCourses.map((course, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col justify-between rounded-xl border border-gray-800 bg-card p-6 transition-colors hover:border-gray-700 hover:bg-card/80"
                            >
                                <div>
                                    <h3 className="text-xl font-semibold text-foreground">
                                        {course.title}
                                    </h3>
                                    <p className="mt-4 text-sm text-gray-400">
                                        Impulsa tus conocimientos en áreas específicas.
                                    </p>
                                </div>
                                <div className="mt-6">
                                    <Button variant="outline" className="w-full">
                                        Ver Detalles
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
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
            />
        </div>
    );
}
