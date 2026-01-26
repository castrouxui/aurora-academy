"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PaymentModal } from "@/components/checkout/PaymentModal";
import { PricingCard } from "@/components/membresias/PricingCard";
import { PLANS } from "@/constants/pricing";

export default function SubscriptionPage() {
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
        fetchSubscription();
    }, []);

    const fetchSubscription = async () => {
        try {
            const res = await fetch("/api/subscription");
            if (res.ok) {
                const data = await res.json();
                setSubscription(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm("¿Estás seguro de que querés cancelar tu suscripción? Perderás el acceso al finalizar el período actual.")) return;

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
                alert("Suscripción cancelada correctamente.");
                window.location.reload();
            } else {
                alert("Hubo un error al cancelar. Intentá nuevamente.");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión.");
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
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#5D5CDE]" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            <div>
                <h1 className="text-3xl font-bold text-white">Mi Membresía</h1>
                <p className="text-gray-400 mt-2">Gestioná tu suscripción y métodos de pago.</p>
            </div>

            {/* Current Active Subscription */}
            {subscription?.active && subscription.subscription ? (
                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-[#1F2937] to-[#111827] border-[#5D5CDE]/30 shadow-lg shadow-[#5D5CDE]/10 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#5D5CDE]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-700" />
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl text-white flex items-center gap-2">
                                        {subscription.bundleTitle}
                                        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                                            <CheckCircle size={12} /> Activa
                                        </span>
                                    </CardTitle>
                                    <CardDescription className="text-gray-400 mt-1">
                                        Plan Mensual - Renovación automática
                                    </CardDescription>
                                </div>
                                <Image src="/logo-white.png" alt="Logo" width={40} height={40} className="opacity-50" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Estado</p>
                                    <p className="font-medium text-white">Al día</p>
                                </div>
                                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Próximo Cobro</p>
                                    <p className="font-medium text-white">Gestionado por Mercado Pago</p>
                                </div>
                            </div>

                            <div className="border-t border-white/5 pt-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Acciones</h3>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button
                                        variant="destructive"
                                        onClick={handleCancel}
                                        disabled={actionLoading}
                                        className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 h-10 px-6 rounded-lg font-bold transition-all"
                                    >
                                        {actionLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <XCircle className="mr-2 h-4 w-4" />}
                                        Cancelar Suscripción
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-500 mt-4 flex items-center gap-2">
                                    <AlertTriangle size={12} className="text-amber-500" />
                                    Si cancelás, conservarás el acceso hasta el final del ciclo de facturación actual.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : subscription?.subscription?.status === 'cancelled' || subscription?.subscription?.status === 'paused' ? (
                <Card className="bg-[#1F2937] border-gray-700 opacity-90 border-dashed">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            {subscription.bundleTitle}
                            <span className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded-full border border-red-500/20">
                                Cancelada / Pausada
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-400 mb-6">Esta suscripción ya no está activa y no se renovará automáticamente.</p>
                        <Link href="/membresias">
                            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 font-bold">
                                Volver a Suscribirse
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <Card className="bg-[#1F2937] border-gray-700 text-center py-12">
                    <CardContent>
                        <div className="bg-gray-800 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <CreditCard className="text-gray-400 h-8 w-8" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">No tenés suscripciones activas</h2>
                        <p className="text-gray-400 mb-6 max-w-md mx-auto">
                            Accedé a todo el contenido premium con nuestros planes mensuales.
                        </p>
                        <Link href="/membresias">
                            <Button className="bg-[#5D5CDE] hover:bg-[#4b4ac6] font-bold h-11 px-8 rounded-xl shadow-lg shadow-[#5D5CDE]/20">
                                Ver Planes
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {/* Other Plans Section */}
            <div className="pt-12 border-t border-white/5">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4">Elegí tu Plan</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Accedé a contenido exclusivo y llevá tu aprendizaje al siguiente nivel con nuestras membresías premium.
                    </p>
                </div>

                {subscription?.otherBundles && subscription.otherBundles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        {subscription.otherBundles.map((bundle: any) => {
                            // Find matching plan details from constants
                            const planDetails = PLANS.find(p => p.title.toLowerCase() === bundle.title.toLowerCase()) || {
                                title: bundle.title,
                                price: `$${new Intl.NumberFormat("es-AR").format(bundle.price)}`,
                                description: bundle.description || "Potencia tus habilidades con lo mejor de Aurora Academy.",
                                features: ["Contenido premium", "Acceso ilimitado"],
                                excludedFeatures: [],
                                tag: null,
                                isRecommended: false
                            };

                            return (
                                <PricingCard
                                    key={bundle.id}
                                    title={planDetails.title}
                                    price={planDetails.price}
                                    periodicity="mes"
                                    tag={planDetails.tag || undefined}
                                    isRecommended={planDetails.isRecommended}
                                    specialFeature={planDetails.specialFeature}
                                    description={
                                        <p className="text-gray-400 text-sm min-h-[40px] flex items-center justify-center">
                                            {planDetails.description}
                                        </p>
                                    }
                                    features={planDetails.features}
                                    excludedFeatures={planDetails.excludedFeatures}
                                    buttonText="Suscribirme Ahora"
                                    onAction={() => handlePurchase(bundle.title, String(bundle.price), bundle.id)}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <Card className="bg-white/5 border-white/5 border-dashed py-12">
                        <CardContent className="flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-600">
                                <CreditCard size={24} />
                            </div>
                            <p className="text-gray-500 font-medium">No hay otros planes publicados por el momento.</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Payment Modal */}
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                courseTitle={selectedPlan.title}
                coursePrice={selectedPlan.price}
                bundleId={selectedPlan.bundleId}
            />
        </div>
    );
}
