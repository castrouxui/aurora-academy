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
                    {/* Dynamic Bundle Grid */}
                    {
                        loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-12">
                                {bundles
                                    .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
                                    .map((bundle, index, allBundles) => {
                                        // Calculate savings
                                        const totalValue = bundle.courses.reduce((sum: number, course: any) => sum + parseFloat(course.price), 0);
                                        const bundlePrice = parseFloat(bundle.price);
                                        const savings = totalValue - bundlePrice;

                                        // Extract tag from title
                                        let displayTitle = bundle.title;
                                        let tag = undefined;
                                        const match = bundle.title.match(/\((.*?)\)/);
                                        if (match) {
                                            tag = match[1];
                                            displayTitle = bundle.title.replace(/\(.*?\)/, '').trim();
                                        }

                                        // Identify Plan Level
                                        const lowerTitle = displayTitle.toLowerCase();
                                        const isMaster = lowerTitle.includes("master") || lowerTitle.includes("mentoria") || lowerTitle.includes("completo");
                                        const isPro = !isMaster && index === 1; // Middle plan is usually Pro/Recommended if not Master

                                        const isRecommended = isPro;
                                        if (isPro) tag = "EL MÁS ELEGIDO";

                                        // --- Feature Deduplication Logic ---
                                        let features: string[] = [];

                                        // Get current raw features
                                        const currentFeatures = [
                                            ...bundle.courses.map((c: any) => c.title),
                                            ...bundle.items.map((i: any) => i.name)
                                        ];

                                        if (index > 0) {
                                            // Check against previous plan
                                            const previousBundle = allBundles[index - 1];
                                            let previousTitle = previousBundle.title.replace(/\(.*?\)/, '').trim();

                                            // Simple heuristic: If it's a higher tier, assume it includes the previous one
                                            // In a perfect world we'd check ID intersection, but for visual clarity this is safer:
                                            features = [
                                                `Todo lo del plan ${previousTitle} y:`,
                                                // Filter out features that might be in the previous plan (by name exact match)
                                                // If names differ slightly, they will show up.
                                                ...currentFeatures.filter(f =>
                                                    !previousBundle.courses.some((pc: any) => pc.title === f) &&
                                                    !previousBundle.items.some((pi: any) => pi.name === f)
                                                )
                                            ];
                                        } else {
                                            features = currentFeatures;
                                        }

                                        // Special Master Feature
                                        let specialFeature = undefined;
                                        if (isMaster) {
                                            specialFeature = {
                                                title: "Reunión 1 a 1 Exclusiva",
                                                description: "Agenda una reunión mensual privada con Fran Castro para mentoría personalizada."
                                            };
                                        }

                                        return (
                                            <PricingCard
                                                key={bundle.id}
                                                title={displayTitle}
                                                price={`$${bundlePrice.toLocaleString('es-AR')}`}
                                                periodicity="mes"
                                                tag={tag}
                                                specialFeature={specialFeature}
                                                description={
                                                    <div className="flex flex-col gap-2 h-8 justify-center">
                                                        {/* Savings Highlight Only - Description text removed as requested */}
                                                        {savings > 0 && (
                                                            <div className="text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 text-xs uppercase tracking-wide shadow-[0_0_10px_rgba(52,211,153,0.1)]">
                                                                ¡Ahorras ${savings.toLocaleString('es-AR')}!
                                                            </div>
                                                        )}
                                                    </div>
                                                }
                                                features={features}
                                                isRecommended={isRecommended}
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
