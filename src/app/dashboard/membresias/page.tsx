"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, AlertTriangle, Loader2, XCircle, CreditCard } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PricingCard } from "@/components/membresias/PricingCard";
import { PLANS } from "@/constants/pricing";
import { PaymentModal } from "@/components/checkout/PaymentModal";
import { SyncPaymentsButton } from "@/components/dashboard/SyncPaymentsButton";

export default function MyMembershipsPage() {
    const searchParams = useSearchParams();

    // State for Subscription Management
    const [subscription, setSubscription] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState({
        title: "",
        price: "",
        bundleId: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const subRes = await fetch("/api/subscription");
            if (subRes.ok) {
                const subData = await subRes.json();
                setSubscription(subData);
            }
        } catch (error) {
            console.error("Error fetching membership data", error);
        } finally {
            setLoading(false);
        }
    };

    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

    const handleCancelClick = () => {
        setIsCancelDialogOpen(true);
    };

    const confirmCancel = async () => {
        setIsCancelDialogOpen(false);
        setActionLoading(true);
        try {
            const res = await fetch("/api/subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "cancel",
                    subscriptionId: subscription.subscription.id
                })
            });

            if (res.ok) {
                toast.success("Suscripción cancelada correctamente.");
                window.location.reload();
            } else {
                toast.error("Hubo un error al cancelar.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error de conexión.");
        } finally {
            setActionLoading(false);
        }
    };

    const handlePurchase = (title: string, price: string, bundleId: string) => {
        setSelectedPlan({ title, price, bundleId });
        setIsPaymentModalOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-4 pb-12">
                <Container>
                    <Skeleton className="h-10 w-64 mb-8 bg-white/5" />
                    <Skeleton className="h-64 w-full rounded-2xl bg-white/5" />
                </Container>
            </div>
        );
    }

    return (
        <div className="space-y-12 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Mi Membresía</h1>
                <p className="text-gray-400 mt-2">Gestioná tu suscripción y planes premium.</p>
            </div>

            {/* Current Status Section */}
            {subscription?.active && subscription.subscription ? (
                <Card className="bg-gradient-to-br from-[#1F2937] to-[#111827] border-[#5D5CDE]/30 shadow-xl shadow-[#5D5CDE]/5 overflow-hidden relative group border-2">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#5D5CDE]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-700" />
                    <CardHeader className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl text-white flex items-center gap-3">
                                    {subscription.bundleTitle}
                                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1 font-bold">
                                        <CheckCircle size={14} /> Membresía Activa
                                    </span>
                                </CardTitle>
                                <CardDescription className="text-gray-400 mt-2 text-base">
                                    Plan Mensual con renovación automática.
                                </CardDescription>
                            </div>
                            <Image src="/logo-white.png" alt="Logo" width={44} height={44} className="opacity-40" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-8 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-black/40 p-5 rounded-xl border border-white/5 backdrop-blur-sm">
                                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1.5 font-bold">Estado de Cuenta</p>
                                <p className="font-semibold text-white text-lg flex items-center gap-2">
                                    Activo y al día
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                </p>
                            </div>
                            <div className="bg-black/40 p-5 rounded-xl border border-white/5 backdrop-blur-sm">
                                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1.5 font-bold">Ciclo de Facturación</p>
                                <p className="font-semibold text-white text-lg">Gestionado por Mercado Pago</p>
                            </div>
                        </div>

                        <div className="border-t border-white/5 pt-8">
                            <h3 className="text-lg font-bold text-white mb-5">Gestión de Cuenta</h3>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    variant="destructive"
                                    onClick={handleCancelClick}
                                    disabled={actionLoading}
                                    className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 px-8 h-12 rounded-xl font-bold transition-all shadow-lg shadow-red-500/5 group"
                                >
                                    {actionLoading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <XCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />}
                                    Cancelar Suscripción
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-5 flex items-start gap-2.5 max-w-xl bg-amber-500/5 p-3 rounded-lg border border-amber-500/10">
                                <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                <span><b>Nota importante:</b> Si cancelás, mantendrás acceso completo a todo el contenido y beneficios hasta que termine tu período actual de 30 días.</span>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : subscription?.subscription?.status === 'cancelled' ? (
                <Card className="bg-[#111827] border-white/5 border-dashed border-2 py-10 px-8 text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400">
                        <XCircle size={32} />
                    </div>
                    <CardTitle className="text-2xl text-white mb-2">{subscription.bundleTitle} (Cancelada)</CardTitle>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        Tu suscripción ha sido cancelada y no recibirá más cargos automáticos.
                        Podes reactivarla eligiendo un plan a continuación.
                    </p>
                    <Button
                        onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                        variant="outline"
                        className="bg-white/5 border-white/10 text-white hover:bg-white hover:text-black font-bold h-12 px-10 rounded-xl"
                    >
                        Ver Planes para Reactivar
                    </Button>
                </Card>
            ) : (
                <Card className="bg-[#111827] border-white/5 border-2 py-16 text-center shadow-2xl">
                    <CardContent>
                        <div className="bg-[#5D5CDE]/10 p-5 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 text-[#5D5CDE] shadow-inner">
                            <CreditCard className="h-10 w-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Potenciá tu Aprendizaje</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg leading-relaxed">
                            No tenés suscripciones activas. Accedé a contenido exclusivo, mentorías y comunidad con nuestros planes.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                                className="bg-[#5D5CDE] hover:bg-[#4b4ac6] font-bold h-14 px-12 rounded-2xl shadow-xl shadow-[#5D5CDE]/20 text-lg transition-all hover:scale-105 active:scale-95"
                            >
                                Explorar Membresías
                            </Button>
                            <SyncPaymentsButton
                                className="h-14 px-8 rounded-2xl border-white/10 hover:bg-white/5 text-gray-400 font-bold"
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Catalog Section - Design Parity with Main Site */}
            <div className="pt-16 border-t border-white/5">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Elegí tu Plan</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Accedé a contenido exclusivo y llevá tu aprendizaje al siguiente nivel con nuestras membresías premium.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                    {PLANS.map((plan, index) => {
                        // Check if this plan is the one currently active
                        const isActive = subscription?.active && subscription.bundleTitle === plan.title;
                        const otherBundles = subscription?.otherBundles || [];
                        const bundleFromDb = otherBundles.find((b: any) => b.title.toLowerCase() === plan.title.toLowerCase());

                        // If it's the active plan, we might show "Plan Actual" or hide it.
                        // Based on the user request, they want parity, so we show them all.

                        return (
                            <PricingCard
                                key={index}
                                title={plan.title}
                                price={plan.price}
                                periodicity="mes"
                                tag={plan.tag || undefined}
                                isRecommended={plan.isRecommended}
                                description={
                                    <p className="text-gray-400 text-sm min-h-[40px] flex items-center justify-center italic">
                                        {plan.description}
                                    </p>
                                }
                                features={plan.features}
                                excludedFeatures={plan.excludedFeatures}
                                buttonText={isActive ? "Plan Actual" : "Suscribirme Ahora"}
                                onAction={() => {
                                    if (isActive) return;
                                    // If we have a DB bundle, use its ID for checkout
                                    const bundleId = bundleFromDb?.id || plan.title.toLowerCase().replace(/ /g, '-');
                                    handlePurchase(plan.title, plan.price.replace(".", "").replace("$", "").trim(), bundleId);
                                }}
                                className={isActive ? "opacity-60 grayscale-[0.5] pointer-events-none border-emerald-500/20" : ""}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Payment Modal */}
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                courseTitle={selectedPlan.title}
                coursePrice={selectedPlan.price}
                bundleId={selectedPlan.bundleId}
            />

            {/* Cancellation Dialog */}
            <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                <AlertDialogContent className="bg-[#111827] border-white/10 text-white sm:max-w-[440px] rounded-2xl shadow-2xl border-2">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold flex items-center gap-3 text-white">
                            <AlertTriangle className="text-red-500" size={28} />
                            ¿Cancelar suscripción?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400 text-lg mt-4 leading-relaxed">
                            Al cancelar, perderás el acceso a todos los cursos premium, mentorías y la comunidad exclusiva al finalizar tu período actual.
                            <br /><br />
                            <span className="font-bold text-white/90">¿Estás seguro/a de que querés continuar?</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-10 gap-4 sm:gap-2">
                        <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-white rounded-xl h-12 px-6 font-semibold">
                            No, mantener mi plan
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmCancel}
                            className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-xl font-bold h-12 px-6 shadow-lg shadow-red-500/10"
                        >
                            Sí, cancelar suscripción
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
