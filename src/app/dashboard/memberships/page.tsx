"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Package, CheckCircle, CreditCard, AlertTriangle, Loader2, XCircle, Check } from "lucide-react";
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

export default function MyMembershipsPage() {
    const searchParams = useSearchParams();
    const isDemo = searchParams.get("mode") === "demo";

    // State for Subscription Management
    const [subscription, setSubscription] = useState<any>(null);
    const [loadingSub, setLoadingSub] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // State for Catalog
    const [bundles, setBundles] = useState<any[]>([]);
    const [loadingCatalog, setLoadingCatalog] = useState(true);

    useEffect(() => {
        if (isDemo) {
            // MOCK DATA FOR DEMO
            // 1. Set Active Sub
            const demoSub = {
                active: true,
                bundleTitle: "Membresía Premium (Demo)",
                price: 15000,
                subscription: {
                    id: "demo-sub",
                    status: 'authorized',
                    createdAt: new Date().toISOString()
                }
            };
            setSubscription(demoSub);

            // 2. Set Mock Bundles for Upgrade/Downgrade
            setBundles([
                {
                    id: "plan-básico",
                    title: "Plan Básico",
                    description: "Acceso a cursos introductorios y comunidad.",
                    price: 10000,
                    courses: [1, 2, 3]
                },
                {
                    id: "plan-pro",
                    title: "Plan Pro Total",
                    description: "Acceso ilimitado a todos los cursos, mentorías y certificaciones.",
                    price: 25000,
                    courses: [1, 2, 3, 4, 5, 6]
                }
            ]);

            setLoadingSub(false);
            setLoadingCatalog(false);
        } else {
            fetchData();
        }
    }, [isDemo]);

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

            // 2. Always fetch Catalog (to show upgrades)
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
            <div className="min-h-screen pt-4 pb-12 bg-background">
                <Container>
                    <Skeleton className="h-8 w-48 bg-muted mb-8" />
                    <Skeleton className="h-64 w-full bg-muted rounded-xl" />
                </Container>
            </div>
        );
    }

    // VIEW 1: ACTIVE SUBSCRIPTION (Management)
    if (subscription) {
        return (
            <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 to-background">
                <Container className="py-12 md:py-20">
                    <div className="max-w-4xl mx-auto space-y-12">
                        {/* HEADER (Aligned with content) */}
                        <div className="space-y-2 text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Mi Membresía</h1>
                            <p className="text-muted-foreground text-lg">Gestioná tu suscripción y métodos de pago.</p>
                        </div>

                        <div className="space-y-16">
                            {/* ACTIVE PLAN CARD */}
                            {subscription.subscription.status === 'authorized' || subscription.subscription.status === 'pending' ? (
                                <Card className="bg-gradient-to-br from-card to-muted border-primary/30 shadow-lg shadow-primary/10">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-2xl text-card-foreground flex items-center gap-2">
                                                    {subscription.bundleTitle}
                                                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                                                        <CheckCircle size={12} /> Activa
                                                    </span>
                                                </CardTitle>
                                                <CardDescription className="text-muted-foreground mt-1">
                                                    Plan Mensual - Renovación automática
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                                                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Estado</p>
                                                <p className="font-medium text-foreground flex items-center gap-2">
                                                    Al día
                                                    <CheckCircle size={14} className="text-emerald-500" />
                                                </p>
                                            </div>
                                            <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                                                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Próximo Cobro</p>
                                                {(() => {
                                                    // Calculate next date based on createdAt (Monthly)
                                                    const createdAt = new Date(subscription.subscription.createdAt);
                                                    const today = new Date();

                                                    // Logic: Find next monthly anniversary
                                                    let nextDate = new Date(createdAt);
                                                    while (nextDate < today) {
                                                        nextDate.setMonth(nextDate.getMonth() + 1);
                                                    }

                                                    const diffTime = Math.abs(nextDate.getTime() - today.getTime());
                                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                    const isSoon = diffDays <= 3;

                                                    return (
                                                        <div className="flex flex-col">
                                                            <p className={`font-medium ${isSoon ? 'text-amber-400' : 'text-foreground'}`}>
                                                                {nextDate.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}
                                                            </p>
                                                            {isSoon && (
                                                                <span className="text-[10px] text-amber-500/80 font-medium">
                                                                    ¡Se renueva en {diffDays} días!
                                                                </span>
                                                            )}
                                                            {!isSoon && (
                                                                <span className="text-[10px] text-muted-foreground">
                                                                    Automático vía Mercado Pago
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>

                                        <div className="border-t border-white/5 pt-6">
                                            <h3 className="text-lg font-semibold text-foreground mb-4">Acciones</h3>
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <Button
                                                    variant="destructive"
                                                    onClick={handleCancelClick}
                                                    disabled={actionLoading}
                                                    className="bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20"
                                                >
                                                    {actionLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <XCircle className="mr-2 h-4 w-4" />}
                                                    Cancelar Suscripción
                                                </Button>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-4 flex items-center gap-2">
                                                <AlertTriangle size={12} />
                                                Si cancelás, mantendrás el acceso hasta el final del ciclo de facturación actual.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="bg-gradient-to-br from-red-500/5 to-muted border-red-500/20 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-2xl text-card-foreground flex items-center gap-2">
                                            {subscription.bundleTitle}
                                            <span className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded-full border border-red-500/20 flex items-center gap-1">
                                                <XCircle size={12} /> Cancelada
                                            </span>
                                        </CardTitle>
                                        <CardDescription className="text-muted-foreground mt-1">
                                            Esta suscripción no se renovará automáticamente.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                                                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Estado</p>
                                                <p className="font-medium text-red-400 flex items-center gap-2">
                                                    Cancelada
                                                    <XCircle size={14} />
                                                </p>
                                            </div>
                                            <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                                                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Acceso Disponible Hasta</p>
                                                {(() => {
                                                    // Calculate expiration date (same logic as renewal)
                                                    const createdAt = new Date(subscription.subscription.createdAt);
                                                    const today = new Date();
                                                    let nextDate = new Date(createdAt);
                                                    while (nextDate < today) {
                                                        nextDate.setMonth(nextDate.getMonth() + 1);
                                                    }
                                                    return (
                                                        <p className="font-medium text-foreground">
                                                            {nextDate.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}
                                                        </p>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                        <div className="pt-2">
                                            <Button
                                                variant="outline"
                                                className="w-full sm:w-auto border-red-500/20 hover:bg-red-500/10 text-red-400 hover:text-red-300"
                                                onClick={() => window.location.href = `/checkout?bundleId=${subscription.subscription.bundleId}`}
                                            >
                                                Reactiva tu suscripción
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* UPGRADE / DOWNGRADE SECTION */}
                            <div className="pt-8 border-t border-white/5">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-foreground mb-2">Otros Planes Disponibles</h2>
                                    <p className="text-muted-foreground">Mejorá tu plan o cambiá a uno que se adapte mejor a tus necesidades.</p>
                                </div>

                                {loadingCatalog ? (
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <Skeleton className="h-64 w-full bg-muted rounded-xl" />
                                        <Skeleton className="h-64 w-full bg-muted rounded-xl" />
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {bundles
                                            .filter(b => b.title !== subscription.bundleTitle)
                                            .map((bundle) => {
                                                const currentPrice = Number(subscription.price || 0);
                                                const bundlePrice = Number(bundle.price);
                                                // If prices are equal, order by title or ID? 
                                                // Assuming Upgrade if bundlePrice > currentPrice
                                                // If bundlePrice < currentPrice, it's a Downgrade
                                                const isUpgrade = bundlePrice >= currentPrice;

                                                return (
                                                    <Card key={bundle.id} className="bg-card/80 border-border flex flex-col hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 group relative overflow-hidden">
                                                        {/* Label */}
                                                        {isUpgrade && (
                                                            <div className="absolute top-0 right-0 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-bl-lg bg-emerald-500/20 text-emerald-400">
                                                                Mejorar Plan
                                                            </div>
                                                        )}
                                                        {!isUpgrade && (
                                                            <div className="absolute top-0 right-0 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-bl-lg bg-gray-700/50 text-gray-400">
                                                                Plan Alternativo
                                                            </div>
                                                        )}

                                                        <CardHeader>
                                                            <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">{bundle.title}</CardTitle>
                                                            <CardDescription className="text-muted-foreground line-clamp-2">{bundle.description}</CardDescription>
                                                        </CardHeader>
                                                        <CardContent className="flex-1 mt-2">
                                                            <div className="mb-6">
                                                                <span className="text-3xl font-bold text-foreground">${Number(bundle.price).toLocaleString('es-AR')}</span>
                                                                <span className="text-muted-foreground text-sm">/mes</span>
                                                                {isUpgrade && (
                                                                    <p className="text-xs text-emerald-400 mt-1">
                                                                        + Acceso a más contenido
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="space-y-2">
                                                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                                    <Check size={14} className="text-emerald-500" />
                                                                    Acceso a {bundle.courses?.length || 'todos los'} cursos
                                                                </p>
                                                            </div>
                                                        </CardContent>
                                                        <CardFooter>
                                                            <Button
                                                                variant={isUpgrade ? "default" : "outline"}
                                                                className={`w-full transition-all ${isUpgrade
                                                                    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                                                                    : "border-border text-muted-foreground hover:text-foreground hover:bg-white/5"
                                                                    }`}
                                                                onClick={() => window.location.href = `/checkout?bundleId=${bundle.id}`}
                                                            >
                                                                {isUpgrade ? "Hacer Upgrade" : "Cambiar a este Plan"}
                                                            </Button>
                                                        </CardFooter>
                                                    </Card>
                                                );
                                            })}
                                        {bundles.filter(b => b.title !== subscription.bundleTitle).length === 0 && (
                                            <div className="col-span-full text-center py-8 bg-white/5 rounded-xl border border-white/5 border-dashed">
                                                <p className="text-muted-foreground">No hay otros planes disponibles por el momento.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Container>
                <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                    <AlertDialogContent className="bg-[#1e2330] border-white/10 text-white sm:max-w-[425px]">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-bold flex items-center gap-2 text-white">
                                <AlertTriangle className="text-amber-500" size={20} />
                                ¿Cancelar suscripción?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400 text-base mt-2">
                                Estás a punto de cancelar tu suscripción. Perderás el acceso a todos los cursos y beneficios al finalizar el período actual.
                                <br /><br />
                                <span className="font-semibold text-white/90">¿Estás seguro de que querés continuar?</span>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-6 gap-3 sm:gap-0">
                            <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-white rounded-lg">
                                Mantener mi plan
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmCancel}
                                className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-lg font-bold"
                            >
                                Sí, cancelar suscripción
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        );
    }

    // VIEW 2: CATALOG (No Subscription)
    return (
        <div className="min-h-screen pt-4 pb-12 bg-background">
            <Container>
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Elegí tu Plan</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Accedé a contenido exclusivo y llevá tu aprendizaje al siguiente nivel con nuestras membresías premium.
                    </p>
                </div>

                {loadingCatalog ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-96 w-full bg-muted rounded-xl" />
                        ))}
                    </div>
                ) : bundles.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-xl border border-border">
                        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">No hay membresías disponibles</h3>
                        <p className="text-muted-foreground">Vuelve pronto para ver nuevos planes.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bundles.map((bundle) => (
                            <Card key={bundle.id} className="bg-card border-border flex flex-col hover:border-primary/50 transition-colors">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-foreground">{bundle.title}</CardTitle>
                                    <CardDescription className="text-muted-foreground line-clamp-2">{bundle.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold text-foreground">${Number(bundle.price).toLocaleString('es-AR')}</span>
                                        <span className="text-muted-foreground">/mes</span>
                                    </div>
                                    <ul className="space-y-3">
                                        <li className="flex items-center text-muted-foreground text-sm">
                                            <Check className="h-4 w-4 text-emerald-400 mr-2" />
                                            Acceso a {bundle.courses?.length || 0} cursos
                                        </li>
                                        <li className="flex items-center text-muted-foreground text-sm">
                                            <Check className="h-4 w-4 text-emerald-400 mr-2" />
                                            Certificados incluidos
                                        </li>
                                        <li className="flex items-center text-muted-foreground text-sm">
                                            <Check className="h-4 w-4 text-emerald-400 mr-2" />
                                            Soporte prioritario
                                        </li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
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
