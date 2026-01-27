"use client";

import { useState, useEffect } from "react";
import { PricingCard } from "@/components/membresias/PricingCard";
import { PricingCheckmark } from "@/components/membresias/PricingCheckmark";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/layout/Container";
import { PaymentModal } from "@/components/checkout/PaymentModal";
import { CardsIcons } from "@/components/ui/CardsIcons";
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
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mb-12 items-start max-w-7xl mx-auto">
                        {bundles.length > 0 ? (
                            // Render based on Dynamic Bundles from DB
                            bundles
                                .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
                                .map((bundle, index, sortedArr) => {
                                    // Try to match with metadata from PLANS
                                    const staticPlan = PLANS[index];
                                    const isRecommended = staticPlan?.isRecommended || index === 1;
                                    const tag = staticPlan?.tag || (index === 1 ? "EL MÁS BUSCADO" : undefined);

                                    // Feature Construction
                                    let displayFeatures: (string | React.ReactNode)[] = [];

                                    // 1. INJECT FIXED BENEFITS (The "Marketing" ones)
                                    // Specifically for Trader & Portfolio: "1 curso nuevo cada 15 días"
                                    if (index >= 1) {
                                        displayFeatures.push(
                                            <span key={`benefit-15d-${bundle.id}`} className="inline-flex items-center gap-2 font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                                                <span>🔥</span> 1 curso nuevo cada 15 días
                                            </span>
                                        );
                                    }

                                    // 2. DYNAMIC COURSES (The "Real" content)
                                    // Logic for "Everything in previous plan"
                                    const currentCourseTitles = bundle.courses.map((c: any) => c.title);

                                    if (index > 0) {
                                        const prevBundle = sortedArr[index - 1];
                                        const prevCourseTitles = prevBundle.courses.map((c: any) => c.title);

                                        // Check if current bundle has all courses of previous bundle
                                        const hasAllPrevious = prevCourseTitles.length > 0 &&
                                            prevCourseTitles.every((t: string) => currentCourseTitles.includes(t));

                                        if (hasAllPrevious) {
                                            displayFeatures.push(`Todo lo del Plan ${prevBundle.title}`);
                                            // Add only the NEW courses
                                            const newCourses = currentCourseTitles.filter((t: string) => !prevCourseTitles.includes(t));
                                            displayFeatures.push(...newCourses);
                                        } else {
                                            // No full overlap, just list everything
                                            displayFeatures.push(...currentCourseTitles);
                                        }
                                    } else {
                                        // First plan, list all
                                        displayFeatures.push(...currentCourseTitles);
                                    }

                                    // 3. DYNAMIC ITEMS (Other benefits from DB)
                                    if (bundle.items && bundle.items.length > 0) {
                                        const items = bundle.items.map((i: any) => {
                                            let name = i.name;
                                            // Format "Canal" or "Telegram" items
                                            if ((name.toLowerCase().includes("canal") || name.toLowerCase().includes("telegram")) && !name.toLowerCase().startsWith("acceso a")) {
                                                return `Acceso a ${name}`;
                                            }
                                            return name;
                                        });

                                        // Simple deduplication against already added features (strings only)
                                        const existingStrings = displayFeatures.filter(f => typeof f === 'string') as string[];
                                        const newItems = items.filter((item: string) => !existingStrings.includes(item));

                                        displayFeatures.push(...newItems);
                                    }

                                    return (
                                        <PricingCard
                                            key={bundle.id}
                                            title={bundle.title}
                                            price={bundle.price.toString()}
                                            periodicity="mes"
                                            tag={tag}
                                            isRecommended={isRecommended}
                                            // Use static special feature (Community Block) if available
                                            description={
                                                <p className="text-gray-400 text-sm min-h-[40px] flex items-center text-left">
                                                    {/* Prioritize STATIC description for better copy */}
                                                    {staticPlan?.description || bundle.description || "Acceso completo"}
                                                </p>
                                            }
                                            features={displayFeatures}
                                            excludedFeatures={staticPlan?.excludedFeatures || []}
                                            buttonText="Suscribirme"
                                            onAction={() => {
                                                handlePurchase(bundle.title, bundle.price.toString(), undefined, bundle.id);
                                            }}
                                        />
                                    );
                                })
                        ) : (
                            // Fallback to Skeleton or Empty State if loading (handled by loading check usually)
                            // or PLANS if fetch failed? Let's stick to PLANS as fallback if bundles is empty
                            PLANS.map((plan, index) => (
                                <PricingCard
                                    key={index}
                                    title={plan.title}
                                    price={plan.price}
                                    periodicity="mes"
                                    tag={plan.tag || undefined}
                                    isRecommended={plan.isRecommended}
                                    description={
                                        <p className="text-gray-400 text-sm min-h-[40px] flex items-center text-left">
                                            {plan.description}
                                        </p>
                                    }
                                    features={plan.features}
                                    excludedFeatures={plan.excludedFeatures}
                                    buttonText="No disponible"
                                />
                            ))
                        )}
                    </div>

                    {/* Pricing Footer Info Centered */}
                    <div className="mx-auto max-w-6xl mt-12 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 px-6 text-sm text-gray-400 border-t border-white/5 pt-8 text-center">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🇦🇷</span>
                            <span className="font-medium whitespace-nowrap">Precios en pesos argentinos.</span>
                        </div>

                        <div className="h-[1px] w-8 md:h-4 md:w-[1px] bg-white/20 hidden md:block" />

                        <div className="flex items-center gap-4">
                            <span className="text-xs uppercase tracking-wider opacity-60">Paga con:</span>
                            <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100 pb-1">
                                <img src="/mercadopago.png" alt="Mercado Pago" className="h-5 w-auto" />
                                <div className="flex gap-2">
                                    <CardsIcons />
                                </div>
                            </div>
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
