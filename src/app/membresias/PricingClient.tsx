"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { MembershipTable } from "@/components/membresias/MembershipTable";
import { LeadMagnet } from "@/components/membresias/LeadMagnet";
import { Testimonials } from "@/components/membresias/Testimonials";
import { FAQ } from "@/components/membresias/FAQ";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/layout/Container";
import { PaymentModal } from "@/components/checkout/PaymentModal";
import { CardsIcons } from "@/components/ui/CardsIcons";
import { useSession } from "next-auth/react";
import { LoginModal } from "@/components/auth/LoginModal";
import { StickyPricingCTA } from "@/components/membresias/StickyPricingCTA";
import { cn } from "@/lib/utils";
import { getRegisteredUserCount } from "@/actions/user";

interface PricingClientProps {
    initialBundles: any[];
    footer: React.ReactNode;
}

export function PricingClient({ initialBundles, footer }: PricingClientProps) {
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
    const [bundles] = useState<any[]>(initialBundles);
    const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
    const [userCount, setUserCount] = useState<number | null>(null);
    const plansRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getRegisteredUserCount().then(count => setUserCount(count));
    }, []);

    // Ahorro concreto en pesos para el plan más económico (usado en el toggle anual)
    const annualSavingsText = useMemo(() => {
        const source = initialBundles.length > 0 ? initialBundles : [];
        if (source.length === 0) return "25%";
        const cheapest = Math.min(...source.map((b: any) => parseFloat(b.price)));
        const savings = cheapest * 3; // 12 meses - 9 meses = 3 meses de ahorro
        return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(savings) + "/año";
    }, [initialBundles]);

    // Countdown timer — session-based, 20 minutes
    const TIMER_KEY = "aurora_pricing_timer_end";
    const TIMER_DURATION = 20 * 60; // 20 min in seconds
    const [timeLeft, setTimeLeft] = useState<number>(TIMER_DURATION);

    useEffect(() => {
        const stored = localStorage.getItem(TIMER_KEY);
        const now = Math.floor(Date.now() / 1000);
        let endTime: number;

        if (stored) {
            endTime = parseInt(stored);
            if (endTime <= now) {
                // Expired — reset
                endTime = now + TIMER_DURATION;
                localStorage.setItem(TIMER_KEY, String(endTime));
            }
        } else {
            endTime = now + TIMER_DURATION;
            localStorage.setItem(TIMER_KEY, String(endTime));
        }

        const tick = () => {
            const remaining = endTime - Math.floor(Date.now() / 1000);
            setTimeLeft(Math.max(0, remaining));
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, "0");
        const s = (secs % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const scrollToPlans = useCallback(() => {
        plansRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
                <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(93,92,222,0.12) 0%, transparent 70%)" }} />
                <Container className="relative z-10 text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 font-display tracking-tight">
                        Invertí mejor, por menos de un café al día.
                    </h1>
                    <p className="text-base md:text-lg leading-relaxed text-gray-400 max-w-2xl mx-auto mb-4">
                        Cursos, comunidad y actualizaciones semanales. Cancelás cuando quieras.
                    </p>
                    {/* Social Proof */}
                    <p className="text-sm text-gray-500 mb-6">
                        Sumate a los más de {userCount !== null ? userCount : '...'} alumnos activos que ya están aprendiendo
                    </p>

                    {/* Countdown urgency */}
                    {timeLeft > 0 && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
                            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Precio especial disponible por</span>
                            <span className="text-amber-300 text-sm font-black tabular-nums">{formatTime(timeLeft)}</span>
                        </div>
                    )}

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
                                    Ahorrá {annualSavingsText}
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
                    {/* Pricing Table Component */}
                    <div id="precios" ref={plansRef} className="mb-20 scroll-mt-32">
                        <MembershipTable
                            bundles={bundles}
                            billingCycle={billingCycle}
                            onPurchase={handlePurchase}
                        />
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
            {footer}

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

            {/* Sticky mobile CTA */}
            <StickyPricingCTA onScrollToPlans={scrollToPlans} />
        </div >
    );
}
