"use client";

import { useState, useEffect } from "react";
import { PricingCard } from "@/components/membresias/PricingCard";
import { PricingCheckmark } from "@/components/membresias/PricingCheckmark";
import { LeadMagnet } from "@/components/membresias/LeadMagnet";
import { Testimonials } from "@/components/membresias/Testimonials";
import { FAQ } from "@/components/membresias/FAQ";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/layout/Container";
import { PaymentModal } from "@/components/checkout/PaymentModal";
import { CardsIcons } from "@/components/ui/CardsIcons";
import { useSession } from "next-auth/react";
import { LoginModal } from "@/components/auth/LoginModal";
import { PLANS } from "@/constants/pricing";
import { cn } from "@/lib/utils";

export default function PricingPage() {
    const { data: session } = useSession();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState({
        title: "",
        price: "",
        courseId: undefined as string | undefined,
        bundleId: undefined as string | undefined,
        isAnnual: false
    });

    // Dynamic State
    const [bundles, setBundles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

    const PERSONA_DATA = [
        {
            label: "Inicial",
            description: "Ideal para dar tus primeros pasos. El escalón de entrada para dominar los conceptos base.",
            authorityBadge: false,
            doubtRemoval: undefined
        },
        {
            label: "Elite",
            description: "Para traders que buscan consistencia e IA. Operá activamente con actualización constante.",
            authorityBadge: false,
            doubtRemoval: undefined
        },
        {
            label: "Portfolio",
            description: "La experiencia definitiva para profesionales. Networking de alto nivel y visión macro.",
            authorityBadge: true,
            doubtRemoval: undefined
        }
    ];

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

    const handlePurchase = (title: string, price: string, courseId?: string, bundleId?: string, isAnnual?: boolean) => {
        if (!session) {
            setIsLoginModalOpen(true);
            return;
        }

        setSelectedCourse({
            title,
            price,
            courseId,
            bundleId,
            isAnnual: isAnnual || false
        });
        setIsPaymentModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white">
            <Navbar />

            {/* Announcement Bar - Controlled by TopBanner for consistency, but if needed here, we'll make it cleaner */}
            {/* Removing the local announcement bar to avoid duplication once TopBanner is updated */}

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-40 md:pt-48 pb-12 md:pb-14">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
                <Container className="relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 font-display tracking-tight">
                        Evolucioná tu capital con el respaldo de expertos
                    </h1>
                    <p className="text-base md:text-lg leading-relaxed text-gray-400 max-w-2xl mx-auto mb-4">
                        Tu hoja de ruta y acompañamiento diario en los mercados.
                        Desde tus primeros pasos hasta operar como un profesional.
                    </p>
                    {/* Social Proof */}
                    <p className="text-sm text-gray-500 mb-12">
                        Sumate a los más de 1000 alumnos activos que ya están aprendiendo
                    </p>

                    {/* Toggle with Enhanced Badge */}
                    <div className="flex justify-center mt-8 mb-12">
                        <div className="bg-[#1e2235] p-1.5 rounded-2xl flex items-center shadow-2xl border border-white/5 relative">
                            <button
                                onClick={() => setBillingCycle("monthly")}
                                className={cn(
                                    "relative z-10 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                                    billingCycle === "monthly"
                                        ? "text-black"
                                        : "text-gray-400 hover:text-white"
                                )}
                            >
                                Mensual
                                {billingCycle === "monthly" && (
                                    <div className="absolute inset-0 bg-white rounded-xl -z-10 animate-in fade-in zoom-in-95 duration-200" />
                                )}
                            </button>
                            <button
                                onClick={() => setBillingCycle("annual")}
                                className={cn(
                                    "relative z-10 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-3",
                                    billingCycle === "annual"
                                        ? "text-black"
                                        : "text-gray-400 hover:text-white"
                                )}
                            >
                                Anual
                                <span className={cn(
                                    "text-[9px] md:text-[10px] font-black px-2 py-1 rounded-md whitespace-nowrap",
                                    billingCycle === "annual"
                                        ? "bg-emerald-500 text-white shadow-lg"
                                        : "bg-white/10 text-gray-400"
                                )}>
                                    Ahorrá 25%
                                </span>
                                {billingCycle === "annual" && (
                                    <div className="absolute inset-0 bg-white rounded-xl -z-10 animate-in fade-in zoom-in-95 duration-200" />
                                )}
                            </button>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Trading Path Section */}
            <section className="relative z-10 pb-16">
                <Container>
                    {/* Dynamic Bundle Grid */}
                    <div id="precios" className="grid grid-cols-1 gap-5 md:grid-cols-3 mb-12 items-stretch max-w-7xl mx-auto mt-0 scroll-mt-32">
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
                                        finalPrice = basePrice * 9;
                                        periodicity = "año";
                                        benefitBadge = "¡OFERTA LANZAMIENTO: 12 meses + 3 GRATIS!";
                                        savingsBadge = undefined;

                                        // Installments logic: 3 cuotas sin interés (Standard)
                                        const installmentAmount = finalPrice / 3;
                                        const formattedInstallment = new Intl.NumberFormat("es-AR", {
                                            style: "currency",
                                            currency: "ARS",
                                            maximumFractionDigits: 0
                                        }).format(installmentAmount);

                                        installmentsText = `3 cuotas sin interés de ${formattedInstallment}`;
                                    }

                                    // Feature Construction - Use 100% dynamic logic from DB for all plans
                                    let displayFeatures: (string | React.ReactNode)[] = [];

                                    // 1. INJECT FIXED BENEFITS (The "Marketing" ones)
                                    // Specifically for Trader & Portfolio: "1 curso nuevo cada 15 días"
                                    if (index >= 1) {
                                        displayFeatures.push(
                                            <span key={`benefit-15d-${bundle.id}`} className="inline-flex items-center gap-2 font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-lg border border-emerald-400/20">
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

                                    // Calculate savings for display
                                    const monthlyCost = basePrice * 12;
                                    const savings = monthlyCost - finalPrice;
                                    const formattedSavings = new Intl.NumberFormat("es-AR", {
                                        style: "currency",
                                        currency: "ARS",
                                        maximumFractionDigits: 0
                                    }).format(savings);

                                    const formattedTotal = new Intl.NumberFormat("es-AR", {
                                        style: "currency",
                                        currency: "ARS",
                                        maximumFractionDigits: 0
                                    }).format(finalPrice);

                                    return (
                                        <PricingCard
                                            key={bundle.id}
                                            title={bundle.title}
                                            price={finalPrice.toString()}
                                            periodicity={periodicity}
                                            tag={tag}
                                            isRecommended={isRecommended}
                                            isAnnual={billingCycle === "annual"}
                                            totalPrice={formattedTotal}
                                            savings={billingCycle === "annual" ? `${Math.round(((basePrice * 12 - finalPrice) / (basePrice * 12)) * 100)}%` : undefined}
                                            description={
                                                PERSONA_DATA[index]?.description || staticPlan?.description || bundle.description || "Todo lo que necesitás para empezar"
                                            }
                                            features={displayFeatures}
                                            excludedFeatures={staticPlan?.excludedFeatures || []}
                                            buttonText="Elegir plan"
                                            installments={installmentsText}
                                            originalMonthlyPrice={basePrice.toString()}
                                            // Persona Props
                                            persona={PERSONA_DATA[index]}
                                            authorityBadge={PERSONA_DATA[index]?.authorityBadge}
                                            doubtRemoval={PERSONA_DATA[index]?.doubtRemoval}
                                            onAction={() => {
                                                handlePurchase(bundle.title, finalPrice.toString(), undefined, bundle.id, billingCycle === "annual");
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
                                    finalPrice = basePrice * 9;
                                    periodicity = "año";
                                    benefitBadge = "¡OFERTA LANZAMIENTO: 12 meses + 3 GRATIS!";
                                    savingsBadge = undefined;

                                    const installmentAmount = finalPrice / 3;
                                    const formattedInstallment = new Intl.NumberFormat("es-AR", {
                                        style: "currency",
                                        currency: "ARS",
                                        maximumFractionDigits: 0
                                    }).format(installmentAmount);

                                    installmentsText = `3 cuotas sin interés de ${formattedInstallment}`;
                                }

                                const monthlyCost = basePrice * 12;
                                const savings = monthlyCost - finalPrice;
                                const formattedSavings = new Intl.NumberFormat("es-AR", {
                                    style: "currency",
                                    currency: "ARS",
                                    maximumFractionDigits: 0
                                }).format(savings);

                                const formattedTotal = new Intl.NumberFormat("es-AR", {
                                    style: "currency",
                                    currency: "ARS",
                                    maximumFractionDigits: 0
                                }).format(finalPrice);

                                return (
                                    <PricingCard
                                        key={index}
                                        title={plan.title}
                                        price={finalPrice.toString()}
                                        periodicity={periodicity}
                                        tag={plan.tag || undefined}
                                        isRecommended={plan.isRecommended}
                                        isAnnual={billingCycle === "annual"}
                                        totalPrice={formattedTotal}
                                        savings={billingCycle === "annual" ? `${Math.round(((basePrice * 12 - finalPrice) / (basePrice * 12)) * 100)}%` : undefined}
                                        description={PERSONA_DATA[index]?.description || plan.description}
                                        features={plan.features}
                                        excludedFeatures={plan.excludedFeatures}
                                        buttonText="Elegir plan"
                                        installments={installmentsText}
                                        originalMonthlyPrice={basePrice.toString()}
                                        // Persona Props
                                        persona={PERSONA_DATA[index]}
                                        authorityBadge={PERSONA_DATA[index]?.authorityBadge}
                                        doubtRemoval={PERSONA_DATA[index]?.doubtRemoval}
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

                    {/* Lead Magnet Section - Moved to Bottom as Safety Net */}
                    <LeadMagnet />
                </Container>
            </section>

            {/* Testimonials Section */}
            <Testimonials />

            {/* FAQ Section */}
            <FAQ />

            {/* Footer */}
            <Footer />

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
                        isAnnual={selectedCourse.isAnnual}
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
