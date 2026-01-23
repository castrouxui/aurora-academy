"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Package, CheckCircle, CreditCard, AlertTriangle, Loader2, XCircle, Check } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function MyMembershipsPage() {
    // State for Subscription Management
    const [subscription, setSubscription] = useState<any>(null);
    const [loadingSub, setLoadingSub] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // State for Catalog
    const [bundles, setBundles] = useState<any[]>([]);
    const [loadingCatalog, setLoadingCatalog] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // 1. Check for Active Subscription
            const subRes = await fetch("/api/subscription");
            if (subRes.ok) {
                const subData = await subRes.json();
                if (subData.active) {
                    setSubscription(subData);
                    setLoadingSub(false);
                    return; // If active, we don't need the catalog right away (or maybe show it below?)
                }
            }
            setLoadingSub(false);

            // 2. If no active subscription, fetch Catalog
            const bundleRes = await fetch("/api/published-bundles");
            if (bundleRes.ok) {
                const bundleData = await bundleRes.json();
                setBundles(bundleData);
            }
        } catch (error) {
            console.error("Error fetching membership data", error);
        } finally {
            setLoadingSub(false);
            setLoadingCatalog(false);
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

    const handleSubscribe = async (bundleId: string, title: string, price: number) => {
        try {
            // Initiate flow
            window.location.href = `/checkout?bundleId=${bundleId}`;
        } catch (error) {
            console.error(error);
        }
    }


    if (loadingSub) {
        return (
            <div className="min-h-screen pt-4 pb-12 bg-[#0B0F19]">
                <Container>
                    <Skeleton className="h-8 w-48 bg-gray-800 mb-8" />
                    <Skeleton className="h-64 w-full bg-gray-800 rounded-xl" />
                </Container>
            </div>
        );
    }

    // VIEW 1: ACTIVE SUBSCRIPTION (Management)
    if (subscription) {
        return (
            <div className="min-h-screen pt-4 pb-12 bg-[#0B0F19]">
                <Container>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Mi Membresía</h1>
                            <p className="text-gray-400">Gestioná tu suscripción actual.</p>
                        </div>
                    </div>

                    <div className="max-w-3xl mx-auto">
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
                                    <Button variant="outline" onClick={() => window.location.href = '/checkout'}>
                                        Volver a Suscribirse
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </Container>
            </div>
        );
    }

    // VIEW 2: CATALOG (No Subscription)
    return (
        <div className="min-h-screen pt-4 pb-12 bg-[#0B0F19]">
            <Container>
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Elegí tu Plan</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Accedé a contenido exclusivo y llevá tu aprendizaje al siguiente nivel con nuestras membresías premium.
                    </p>
                </div>

                {loadingCatalog ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-96 w-full bg-gray-800 rounded-xl" />
                        ))}
                    </div>
                ) : bundles.length === 0 ? (
                    <div className="text-center py-20 bg-[#111827] rounded-xl border border-gray-800">
                        <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No hay membresías disponibles</h3>
                        <p className="text-gray-400">Vuelve pronto para ver nuevos planes.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bundles.map((bundle) => (
                            <Card key={bundle.id} className="bg-[#111827] border-gray-800 flex flex-col hover:border-[#5D5CDE]/50 transition-colors">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-white">{bundle.title}</CardTitle>
                                    <CardDescription className="text-gray-400 line-clamp-2">{bundle.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold text-white">${Number(bundle.price).toLocaleString('es-AR')}</span>
                                        <span className="text-gray-500">/mes</span>
                                    </div>
                                    <ul className="space-y-3">
                                        <li className="flex items-center text-gray-300 text-sm">
                                            <Check className="h-4 w-4 text-emerald-400 mr-2" />
                                            Acceso a {bundle.courses?.length || 0} cursos
                                        </li>
                                        <li className="flex items-center text-gray-300 text-sm">
                                            <Check className="h-4 w-4 text-emerald-400 mr-2" />
                                            Certificados incluidos
                                        </li>
                                        <li className="flex items-center text-gray-300 text-sm">
                                            <Check className="h-4 w-4 text-emerald-400 mr-2" />
                                            Soporte prioritario
                                        </li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full bg-[#5D5CDE] hover:bg-[#4b4ac6]"
                                        onClick={() => window.location.href = `/checkout?bundleId=${bundle.id}`}
                                    >
                                        Suscribirme Ahora
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}
