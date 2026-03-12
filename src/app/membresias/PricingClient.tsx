"use client";

import { useState } from "react";
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
import { cn } from "@/lib/utils";

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
    const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

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
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            {/* Announcement Bar - Controlled by TopBanner for consistency, but if needed here, we'll make it cleaner */}
            {/* Removing the local announcement bar to avoid duplication once TopBanner is updated */}

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-32 md:pt-40 pb-12 md:pb-14">
                {/* Background glowing effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[300px] bg-primary/20 blur-[100px] rounded-full pointer-events-none opacity-40 z-0" />

                <Container className="relative z-10 text-center">
                    <div className="inline-block text-[10px] font-black tracking-widest uppercase bg-primary/10 text-primary px-3 py-1.5 rounded-full mb-4">
                        Membresías VIP
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-[56px] font-black text-foreground mb-6 tracking-tight leading-[1.1]">
                        Evolucioná tu capital.
                    </h1>
                    <p className="text-base md:text-xl font-medium leading-relaxed text-muted-foreground max-w-2xl mx-auto mb-10">
                        Tu hoja de ruta y acompañamiento diario en los mercados institucionales.
                    </p>

                    {/* Saas Tab Switch for Pricing */}
                    <div className="flex justify-center items-center">
                        <div className="relative flex items-center p-1 bg-secondary/80 backdrop-blur-md rounded-full border border-border">
                            <button
                                onClick={() => setBillingCycle("monthly")}
                                className={cn(
                                    "relative w-32 py-2.5 text-sm font-bold rounded-full transition-all duration-300 z-10",
                                    billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Mensual
                            </button>
                            <button
                                onClick={() => setBillingCycle("annual")}
                                className={cn(
                                    "relative w-40 py-2.5 text-sm font-bold rounded-full transition-all duration-300 z-10 flex items-center justify-center gap-2",
                                    billingCycle === "annual" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Anual
                                <span className={cn(
                                    "text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm transition-colors",
                                    billingCycle === "annual" ? "bg-white/20 text-white" : "bg-primary/20 text-primary"
                                )}>-25%</span>
                            </button>

                            {/* Animated Background Pill */}
                            <div
                                className={cn(
                                    "absolute top-1 bottom-1 w-32 rounded-full bg-primary shadow-lg transition-transform duration-300 ease-out z-0",
                                    billingCycle === "annual" ? "translate-x-32 w-40" : "translate-x-0"
                                )}
                            />
                        </div>
                    </div>
                </Container>
            </section>

            {/* Trading Path Section */}
            <section className="relative z-10 pb-16">
                <Container>
                    {/* Dynamic Bundle Grid */}
                    {/* Pricing Table Component */}
                    <div id="precios" className="mb-20 scroll-mt-32">
                        <MembershipTable
                            bundles={bundles}
                            billingCycle={billingCycle}
                            onPurchase={handlePurchase}
                        />
                    </div>

                    {/* Pricing Footer Info Centered matches Platzi */}
                    <div className="mx-auto max-w-6xl mt-8 md:mt-12 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 px-4 md:px-6 py-6 text-sm text-muted-foreground border-t border-border pt-8 text-center">
                        <div className="flex items-center gap-2 md:gap-3 opacity-80">
                            <span className="text-lg">🇦🇷</span>
                            <span className="font-normal text-foreground/80 whitespace-nowrap">Precios en pesos argentinos.</span>
                        </div>

                        <div className="h-[24px] w-[1px] bg-border hidden md:block" />

                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">PAGA CON:</span>
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
        </div >
    );
}
