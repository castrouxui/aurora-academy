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
    const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

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
                    <p className="text-lg leading-8 text-gray-300 max-w-2xl mx-auto mb-10">
                        Tu hoja de ruta y acompañamiento diario en los mercados.
                        Desde tus primeros pasos hasta operar como un profesional.
                    </p>

                    {/* Billing Cycle Switch Hidden for Launch */}
                </Container>
            </section>

            {/* Trading Path Section */}
            <section className="relative z-10 pb-16">
                <Container>
                    {/* Dynamic Bundle Grid */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mb-12 items-start max-w-7xl mx-auto mt-6">
                        {/* mt-6 added to give space for the new top floating badges */}
                        {bundles.length > 0 ? (
                            // Render based on Dynamic Bundles from DB
                            bundles
                                .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
                                .map((bundle, index, sortedArr) => {
                                    // Try to match with metadata from PLANS
                                    const staticPlan = PLANS[index];
                                    const isRecommended = staticPlan?.isRecommended || index === 1;
                                    const tag = staticPlan?.tag || (index === 1 ? "EL MÁS BUSCADO" : undefined);

                                    // Price Logic (Simulation for Localhost)
                                    const basePrice = parseFloat(bundle.price);
                                    let finalPrice = basePrice;
                                    let periodicity = "mes";
                                    let installmentsText = undefined;
                                    let benefitBadge = undefined;
                                    let savingsBadge = undefined;

                                    if (billingCycle === "annual") {
                                        finalPrice = basePrice * 10;
                                        periodicity = "año";
                                        // benefitBadge removed to clean up visual clutter
                                        savingsBadge = "AHORRÁS 3 MESES";

                                        // Installments logic: 4 cuotas sin interés
                                        const installmentAmount = finalPrice / 4;
                                        const formattedInstallment = new Intl.NumberFormat("es-AR", {
                                            style: "currency",
                                            currency: "ARS",
                                            maximumFractionDigits: 0
                                        }).format(installmentAmount);

                                        installmentsText = `4 cuotas sin interés de ${formattedInstallment}`;
                                    }

                                    // Feature Construction
                                    let displayFeatures: (string | React.ReactNode)[] = [];

                                    // 1. INJECT FIXED BENEFITS (The "Marketing" ones)
                                    // Specifically for Trader & Portfolio: "1 curso nuevo cada 15 días"
                                    if (index >= 1) {
                                        displayFeatures.push(
                                            <span key={`benefit-15d-${bundle.id}`} className="inline-flex items-center gap-2 font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
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

                                        // Simple deduplication logic
                                        const existingStrings = displayFeatures.filter(f => typeof f === 'string') as string[];
                                        // Filter dynamic items that are already in the list OR are "Acceso a Comunidad de Inversores"
                                        const newItems = items.filter((item: string) => {
                                            if (existingStrings.includes(item)) return false;
                                            // Specific check for Comunidad to ensure it stays LAST as per user request (it's in static features)
                                            if (item.toLowerCase().includes("comunidad de inversores")) return false;
                                            return true;
                                        });

                                        displayFeatures.push(...newItems);
                                    }

                                    // 4. APPEND STATIC EXCLUSIVE FEATURES (that might have been deduplicated)
                                    // Specifically for Portfolio Manager (Index 2) -> "Acceso a Comunidad de Inversores"
                                    if (index === 2) {
                                        displayFeatures.push("Acceso a Comunidad de Inversores");
                                    }

                                    return (
                                        <PricingCard
                                            key={bundle.id}
                                            title={bundle.title}
                                            price={finalPrice.toString()}
                                            periodicity={periodicity}
                                            tag={tag}
                                            isRecommended={isRecommended}
                                            benefitBadge={benefitBadge}
                                            savingsBadge={savingsBadge}
                                            installments={installmentsText}
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
                                                handlePurchase(bundle.title, finalPrice.toString(), undefined, bundle.id);
                                            }}
                                        />
                                    );
                                })
                        ) : (
                            // Fallback to PLANS (This renders when bundles is empty, e.g. localhost without data)
                            PLANS.map((plan, index) => {
                                // Fallback Logic for Price - Need to strip "$" and "." to parse number
                                // e.g. "$54.900" -> 54900
                                const rawPriceString = plan.price.replace(/[^0-9]/g, '');
                                const basePrice = parseFloat(rawPriceString);

                                let finalPrice = basePrice;
                                let periodicity = "mes";
                                let installmentsText = undefined;
                                let benefitBadge = undefined;
                                let savingsBadge = undefined;

                                if (billingCycle === "annual") {
                                    finalPrice = basePrice * 10;
                                    periodicity = "año";
                                    // benefitBadge removed to clean up visual clutter
                                    savingsBadge = "AHORRÁS 3 MESES";

                                    const installmentAmount = finalPrice / 4;
                                    const formattedInstallment = new Intl.NumberFormat("es-AR", {
                                        style: "currency",
                                        currency: "ARS",
                                        maximumFractionDigits: 0
                                    }).format(installmentAmount);

                                    installmentsText = `4 cuotas sin interés de ${formattedInstallment}`;
                                }

                                return (
                                    <PricingCard
                                        key={index}
                                        title={plan.title}
                                        price={finalPrice.toString()}
                                        periodicity={periodicity}
                                        tag={plan.tag || undefined}
                                        isRecommended={plan.isRecommended}
                                        benefitBadge={benefitBadge}
                                        savingsBadge={savingsBadge}
                                        installments={installmentsText}
                                        description={
                                            <p className="text-gray-400 text-sm min-h-[40px] flex items-center text-left">
                                                {plan.description}
                                            </p>
                                        }
                                        features={plan.features}
                                        excludedFeatures={plan.excludedFeatures}
                                        buttonText="No disponible"
                                    />
                                );
                            })
                        )}
                    </div>

                    {/* Pricing Footer Info Centered matches Platzi */}
                    <div className="mx-auto max-w-6xl mt-8 md:mt-12 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 px-4 md:px-6 py-6 text-sm text-gray-400 border-t border-white/5 pt-8 text-center">
                        <div className="flex items-center gap-2 md:gap-3 opacity-80">
                            <span className="text-lg">🇦🇷</span>
                            <span className="font-normal text-gray-300 whitespace-nowrap">Precios en pesos argentinos.</span>
                        </div>

                        <div className="h-[24px] w-[1px] bg-white/10 hidden md:block" />

                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">PAGA CON:</span>
                            <div className="flex items-center gap-3">
                                {/* Mercado Pago Chip */}
                                <div className="bg-white/90 rounded px-1.5 h-6 flex items-center justify-center">
                                    <img src="/payment-icons/mercadopago-new.png" alt="Mercado Pago" className="h-5 w-auto object-contain" />
                                </div>
                                <CardsIcons />
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

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
        </div>
    );
}
