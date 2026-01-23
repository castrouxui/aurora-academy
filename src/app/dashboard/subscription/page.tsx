"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";

export default function SubscriptionPage() {
    const [subscription, setSubscription] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchSubscription();
    }, []);

    const fetchSubscription = async () => {
        try {
            const res = await fetch("/api/subscription");
            if (res.ok) {
                const data = await res.json();
                if (data.active) {
                    setSubscription(data);
                } else {
                    setSubscription(null);
                }
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

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#5D5CDE]" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-white">Mi Membresía</h1>
                <p className="text-gray-400 mt-2">Gestioná tu suscripción y métodos de pago.</p>
            </div>

            {!subscription ? (
                <Card className="bg-[#1F2937] border-gray-700 text-center py-12">
                    <CardContent>
                        <div className="bg-gray-800 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <CreditCard className="text-gray-400 h-8 w-8" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">No tenés suscripciones activas</h2>
                        <p className="text-gray-400 mb-6 max-w-md mx-auto">
                            Accedé a todo el contenido premium con nuestros planes mensuales.
                        </p>
                        <Button className="bg-[#5D5CDE] hover:bg-[#4b4ac6]" onClick={() => window.location.href = '/pricing'}>
                            Ver Planes
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {subscription.subscription.status === 'authorized' ? (
                        <Card className="bg-gradient-to-br from-[#1F2937] to-[#111827] border-[#5D5CDE]/30 shadow-lg shadow-[#5D5CDE]/10">
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
                                            className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                                        >
                                            {actionLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <XCircle className="mr-2 h-4 w-4" />}
                                            Cancelar Suscripción
                                        </Button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-4 flex items-center gap-2">
                                        <AlertTriangle size={12} />
                                        Si cancelás, mantendrás el acceso hasta el final del ciclo de facturación actual.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="bg-[#1F2937] border-gray-700 opacity-75">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    {subscription.bundleTitle}
                                    <span className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded-full border border-red-500/20">
                                        Cancelada / Pausada
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-400 mb-4">Esta suscripción ya no se renueva automáticamente.</p>
                                <Button variant="outline" onClick={() => window.location.href = '/pricing'}>
                                    Volver a Suscribirse
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}
