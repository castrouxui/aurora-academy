"use client";

import { useState, useEffect } from "react";
import { PricingCard } from "@/components/membresias/PricingCard";
import { PricingCheckmark } from "@/components/membresias/PricingCheckmark";
import { LeadMagnet } from "@/components/membresias/LeadMagnet";
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

            {/* Announcement Bar - Minimal Urgency Indicator */}
            <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-white/10">
                <Container>
                    <div className="flex items-center justify-center gap-3 py-2.5 text-center">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        <span className="text-sm text-gray-300">
                            Oferta de febrero:
                            <span className="ml-2 font-bold text-white tabular-nums">
                                {(() => {
                                    const now = new Date();
                                    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                                    const daysRemaining = Math.ceil((lastDayOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                                    return daysRemaining > 0 ? `${daysRemaining} días restantes` : 'Últimas horas';
                                })()}
                            </span>
                        </span>
                    </div>
                </Container>
            </div>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-32 md:pt-40 pb-16 md:pb-20">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
                <Container className="relative z-10 text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
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
                        <div className="bg-[#1e2235] p-1 rounded-full flex items-center shadow-xl border border-white/5">
                            <button
                                onClick={() => setBillingCycle("monthly")}
                                className={cn(
                                    "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300",
                                    billingCycle === "monthly"
                                        ? "bg-white text-black shadow-lg"
                                        : "text-gray-400 hover:text-white"
                                )}
                            >
                                Mensual
                            </button>
                            <button
                                onClick={() => setBillingCycle("annual")}
                                className={cn(
                                    "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2",
                                    billingCycle === "annual"
                                        ? "bg-white text-black shadow-lg"
                                        : "text-gray-400 hover:text-white"
                                )}
                            >
                                Anual
                                <span className={cn(
                                    "text-[9px] md:text-[10px] font-black px-2 py-1 rounded-md whitespace-nowrap",
                                    billingCycle === "annual"
                                        ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg"
                                        : "bg-white/10 text-gray-400"
                                )}>
                                    12 meses + 3 GRATIS
                                </span>
                            </button>
                        </div>
                    </div>
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
                                        benefitBadge = "¡OFERTA LANZAMIENTO: 12 meses + 3 GRATIS!";
                                        savingsBadge = undefined;

                                        // Installments logic: 4 cuotas sin interés
                                        const installmentAmount = finalPrice / 4;
                                        const formattedInstallment = new Intl.NumberFormat("es-AR", {
                                            style: "currency",
                                            currency: "ARS",
                                            maximumFractionDigits: 0
                                        }).format(installmentAmount);

                                        installmentsText = `4 cuotas sin interés de ${formattedInstallment}`;
                                    }

                                    // Feature Construction - Use 100% dynamic logic from DB for all plans
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
                                            benefitBadge={benefitBadge}
                                            savingsBadge={savingsBadge}
                                            installments={installmentsText}
                                            isAnnual={billingCycle === "annual"}
                                            totalPrice={billingCycle === "annual" ? formattedTotal : undefined}
                                            savings={billingCycle === "annual" ? formattedSavings : undefined}
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
                                    finalPrice = basePrice * 10;
                                    periodicity = "año";
                                    benefitBadge = "¡OFERTA LANZAMIENTO: 12 meses + 3 GRATIS!";
                                    savingsBadge = undefined;

                                    const installmentAmount = finalPrice / 4;
                                    const formattedInstallment = new Intl.NumberFormat("es-AR", {
                                        style: "currency",
                                        currency: "ARS",
                                        maximumFractionDigits: 0
                                    }).format(installmentAmount);

                                    installmentsText = `4 cuotas sin interés de ${formattedInstallment}`;
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
                                        benefitBadge={benefitBadge}
                                        savingsBadge={savingsBadge}
                                        installments={installmentsText}
                                        isAnnual={billingCycle === "annual"}
                                        totalPrice={billingCycle === "annual" ? formattedTotal : undefined}
                                        savings={billingCycle === "annual" ? formattedSavings : undefined}
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

                    {/* Lead Magnet Section - Moved to Bottom as Safety Net */}
                    <LeadMagnet />
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
