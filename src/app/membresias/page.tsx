"use client";

import { useState, useEffect } from "react";
import { PricingCard } from "@/components/membresias/PricingCard";
import { PricingCheckmark } from "@/components/membresias/PricingCheckmark";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/layout/Container";
import { PaymentModal } from "@/components/checkout/PaymentModal";
import { useSession } from "next-auth/react";
import { LoginModal } from "@/components/auth/LoginModal";
import { PLANS } from "@/constants/pricing";

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

        setSelectedCourse({
            title,
            price,
            courseId,
            bundleId
        });
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
                        Evolucioná tu capital con el respaldo de expertos
                    </h1>
                    <p className="text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
                        Tu hoja de ruta y acompañamiento diario en los mercados.
                        Desde tus primeros pasos hasta operar como un profesional.
                    </p>
                </Container>
            </section>

            {/* Trading Path Section */}
            <section className="relative z-10 pb-16">
                <Container>
                    {/* Dynamic Bundle Grid */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-12 items-start">
                        {PLANS.map((plan, index) => {
                            // Map to existing bundles for ID if available
                            const bundle = bundles.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))[index];
                            const bundleId = bundle?.id;

                            return (
                                <PricingCard
                                    key={index}
                                    title={plan.title}
                                    price={plan.price}
                                    periodicity="mes"
                                    tag={plan.tag || undefined}
                                    isRecommended={plan.isRecommended}
                                    specialFeature={plan.specialFeature}
                                    description={
                                        <p className="text-gray-400 text-sm min-h-[40px] flex items-center justify-center">
                                            {plan.description}
                                        </p>
                                    }
                                    features={plan.features}
                                    excludedFeatures={plan.excludedFeatures}
                                    buttonText={bundleId ? "Suscribirme" : "No disponible"}
                                    onAction={() => {
                                        if (bundleId) {
                                            handlePurchase(plan.title, plan.price.replace(".", "").replace("$", "").trim(), undefined, bundleId);
                                        }
                                    }}
                                />
                            );
                        })}
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
                redirectUrl="/membresias"
                view="purchase"
            />
        </div >
    );
}
