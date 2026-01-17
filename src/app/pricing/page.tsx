"use client";

import { useState, useEffect } from "react";
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
    const [selectedCourse, setSelectedCourse] = useState({
        title: "",
        price: "",
        courseId: undefined as string | undefined,
        bundleId: undefined as string | undefined
    });

    // Dynamic State
    const [bundles, setBundles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBundles() {
            try {
                const res = await fetch("/api/bundles");
                if (res.ok) {
                    const data = await res.json();
                    setBundles(data);
                }
            } catch (error) {
                console.error("Failed to fetch bundles:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchBundles();
    }, []);

    const handlePurchase = (title: string, price: string, courseId?: string, bundleId?: string) => {
        if (!session) {
            setIsLoginModalOpen(true);
            return;
        }
        setSelectedCourse({ title, price, courseId, bundleId });
        setIsPaymentModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white">
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

                    {/* Dynamic Bundle Grid */}
                    {
                        loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-12">
                                {bundles.map((bundle) => {
                                    // Calculate savings
                                    const totalValue = bundle.courses.reduce((sum: number, course: any) => sum + parseFloat(course.price), 0);
                                    const bundlePrice = parseFloat(bundle.price);
                                    const savings = totalValue - bundlePrice;

                                    // Combine features: Course Titles + Membership Items
                                    const features = [
                                        ...bundle.courses.map((c: any) => c.title),
                                        ...bundle.items.map((i: any) => i.name)
                                    ];

                                    return (
                                        <PricingCard
                                            key={bundle.id}
                                            title={bundle.title}
                                            price={`$${bundlePrice.toLocaleString('es-AR')}`}
                                            periodicity="único"
                                            students={bundle.description || "Acceso Completo"} // Use description as subtitle
                                            features={features}
                                            isRecommended={false} // logic can be added later if needed
                                            buttonText="Obtener Oferta"
                                            onAction={() => handlePurchase(bundle.title, bundle.price.toString(), undefined, bundle.id)}
                                        />
                                    );
                                })}
                            </div>
                        )
                    }

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
                </Container >
            </section >

            {/* Payment Modal */}
            {
                isPaymentModalOpen && (
                    <PaymentModal
                        isOpen={isPaymentModalOpen}
                        onClose={() => setIsPaymentModalOpen(false)}
                        courseTitle={selectedCourse.title}
                        coursePrice={selectedCourse.price}
                        courseId={selectedCourse.courseId}
                        bundleId={selectedCourse.bundleId}
                    />
                )
            }

            {/* Login Modal for unauthenticated purchases */}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                redirectUrl="/pricing"
                view="purchase"
            />
        </div >
    );
}
