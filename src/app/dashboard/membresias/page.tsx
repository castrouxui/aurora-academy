"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
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
import { MembershipTable } from "@/components/membresias/MembershipTable";
import { PLANS } from "@/constants/pricing";
import { SyncPaymentsButton } from "@/components/dashboard/SyncPaymentsButton";
import { PaymentModal } from "@/components/checkout/PaymentModal";

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

    const [isAnnual, setIsAnnual] = useState(false);
    const [bundles, setBundles] = useState<any[]>([]);

    const plansRef = useRef<HTMLDivElement>(null);

    const scrollToPlans = () => {
        plansRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        fetchData();
        fetchBundles();
    }, []);

    // Poll every 5s while subscription is pending (waiting for MP webhook to fire)
    useEffect(() => {
        if (!subscription || subscription.subscription?.status !== 'pending') return;

        const interval = setInterval(async () => {
            const res = await fetch("/api/subscription");
            if (res.ok) {
                const data = await res.json();
                if (data.subscription?.status === 'authorized') {
                    setSubscription(data);
                    clearInterval(interval);
                    toast.success("¡Suscripción activada! Ya tenés acceso a todos los contenidos.");
                }
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [subscription]);

    const fetchBundles = async () => {
        try {
            const res = await fetch("/api/bundles");
            if (res.ok) {
                const data = await res.json();
                setBundles(data.sort((a: any, b: any) => parseFloat(a.price) - parseFloat(b.price)));
            }
        } catch (error) {
            console.error("Failed to fetch bundles:", error);
        }
    };

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

    // Handler unificado para MembershipTable — maneja nuevo, upgrade y downgrade
    const handleBundlePurchase = useCallback(async (title: string, priceStr: string, _courseId?: string, bundleId?: string, isAnnualPurchase?: boolean) => {
        if (!bundleId) return;
        const bundle = bundles.find((b: any) => b.id === bundleId);
        if (!bundle) return;
        const basePrice = parseFloat(bundle.price);

        if (isAnnualPurchase) {
            const finalPrice = basePrice * 9;
            const displayPrice = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(finalPrice);
            handlePurchase(title + " (Anual)", displayPrice, bundleId);
            return;
        }

        if (subscription?.active) {
            const currentPlan = PLANS.find((p: any) => p.title === subscription.bundleTitle);
            const currentPrice = Number(currentPlan?.price?.replace(/[^0-9]/g, '') || 0);

            if (basePrice > currentPrice) {
                setActionLoading(true);
                try {
                    const res = await fetch("/api/subscription/upgrade-calc", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ targetBundleId: bundleId, targetPrice: basePrice.toString() })
                    });
                    const data = await res.json();
                    if (res.ok) window.location.href = data.initPoint;
                    else toast.error(data.error || "Error calculando upgrade");
                } catch { toast.error("Error de conexión"); }
                finally { setActionLoading(false); }
                return;
            }

            if (basePrice < currentPrice) {
                if (confirm(`¿Estás seguro de cambiar al plan ${title}? El cambio se aplicará en tu próxima factura.`)) {
                    setActionLoading(true);
                    try {
                        const res = await fetch("/api/subscription/downgrade", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ targetBundleId: bundleId, targetPrice: basePrice.toString() })
                        });
                        if (res.ok) { toast.success("Plan actualizado."); window.location.reload(); }
                        else toast.error("Error al cambiar plan");
                    } catch { toast.error("Error de conexión"); }
                    finally { setActionLoading(false); }
                }
                return;
            }
        }

        const displayPrice = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(basePrice);
        handlePurchase(title, displayPrice, bundleId);
    }, [bundles, subscription, isAnnual]);

    // Labels y estado de los botones según suscripción activa
    const buttonOverrides = useMemo(() => {
        if (!bundles.length) return {};
        const overrides: Record<string, { label: string; disabled?: boolean }> = {};
        const sorted = [...bundles].sort((a: any, b: any) => parseFloat(a.price) - parseFloat(b.price));

        sorted.forEach((bundle: any) => {
            const basePrice = parseFloat(bundle.price);
            const isActive = subscription?.active && subscription.bundleTitle === bundle.title && !isAnnual;

            if (isActive) {
                overrides[bundle.id] = { label: "✓ Plan Actual", disabled: true };
                return;
            }
            if (!subscription?.active) return; // default label

            const currentPlan = PLANS.find((p: any) => p.title === subscription.bundleTitle);
            const currentPrice = Number(currentPlan?.price?.replace(/[^0-9]/g, '') || 0);

            if (basePrice > currentPrice) overrides[bundle.id] = { label: "Mejorar Plan" };
            else if (basePrice < currentPrice) overrides[bundle.id] = { label: "Cambiar Plan" };
        });
        return overrides;
    }, [bundles, subscription, isAnnual]);

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
        <div className="space-y-12 max-w-5xl mx-auto pb-20 page-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Mi Membresía</h1>
                <p className="text-gray-400 mt-2">Gestioná tu suscripción y planes premium.</p>
            </div>

            {/* Current Status Section */}
            {subscription?.subscription?.status === 'pending' && (() => {
                const createdAt = new Date(subscription.subscription.createdAt);
                const minutesAgo = (Date.now() - createdAt.getTime()) / 60_000;
                return minutesAgo <= 30; // solo mostrar si tiene menos de 30 min (evitar pendings abandonados)
            })() ? (
                <Card className="bg-[#111827] border-[#5D5CDE]/20 border-2 py-14 text-center shadow-2xl">
                    <CardContent>
                        <div className="bg-[#5D5CDE]/10 p-5 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 text-[#5D5CDE]">
                            <Loader2 className="h-10 w-10 animate-spin" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Activando tu suscripción…</h2>
                        <p className="text-gray-400 mb-2 max-w-md mx-auto text-base leading-relaxed">
                            Recibimos tu pago. Estamos esperando la confirmación de Mercado Pago — esto puede tardar
                            hasta 1 minuto.
                        </p>
                        <p className="text-gray-500 text-sm">Esta página se actualiza automáticamente.</p>
                    </CardContent>
                </Card>
            ) : subscription?.active && subscription.subscription ? (
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

                        {/* Plan Benefits / Links Section */}
                        {subscription.subscription.bundle?.items?.length > 0 && (
                            <div className="border-t border-white/5 pt-8">
                                <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                                    <span className="text-[#5D5CDE]">✨</span> Accesos y Beneficios Exclusivos
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {subscription.subscription.bundle.items.map((item: any) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#5D5CDE]/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 shrink-0 rounded-lg bg-[#5D5CDE]/20 flex items-center justify-center text-[#5D5CDE]">
                                                    <CheckCircle size={20} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-white text-sm truncate">{item.name}</p>
                                                    <p className="text-xs text-gray-500">Beneficio incluido</p>
                                                </div>
                                            </div>
                                            {item.content && (item.content.startsWith('http') || item.content.startsWith('www')) && (
                                                <a href={item.content} target="_blank" rel="noopener noreferrer">
                                                    <Button size="sm" className="bg-[#5D5CDE] hover:bg-[#4b4ac6] text-white font-bold h-9">
                                                        Entrar
                                                    </Button>
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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
                        onClick={scrollToPlans}
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
                                onClick={scrollToPlans}
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
            <div ref={plansRef} className="pt-16 border-t border-white/5">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Elegí tu Plan</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Accedé a contenido exclusivo y llevá tu aprendizaje al siguiente nivel con nuestras membresías premium.
                    </p>
                </div>

                {/* Toggle with Enhanced Badge */}
                <div className="flex justify-center mb-12">
                    <div className="bg-[#1e2235] p-1.5 rounded-2xl flex items-center shadow-2xl border border-white/5 relative">
                        <button
                            onClick={() => setIsAnnual(false)}
                            className={`relative z-10 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${!isAnnual ? 'text-black' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Mensual
                            {!isAnnual && (
                                <div className="absolute inset-0 bg-white rounded-xl -z-10 animate-in fade-in zoom-in-95 duration-200" />
                            )}
                        </button>
                        <button
                            onClick={() => setIsAnnual(true)}
                            className={`relative z-10 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-3 ${isAnnual ? 'text-black' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Anual
                            <span className={`text-[9px] md:text-[10px] font-black px-2 py-1 rounded-md whitespace-nowrap ${isAnnual ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/10 text-gray-400'
                                }`}>
                                Ahorrá 25%
                            </span>
                            {isAnnual && (
                                <div className="absolute inset-0 bg-white rounded-xl -z-10 animate-in fade-in zoom-in-95 duration-200" />
                            )}
                        </button>
                    </div>
                </div>

                <MembershipTable
                    bundles={bundles}
                    billingCycle={isAnnual ? "annual" : "monthly"}
                    onPurchase={handleBundlePurchase}
                    buttonOverrides={buttonOverrides}
                />
            </div>

            {/* Payment Modal */}
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                courseTitle={selectedPlan.title}
                coursePrice={selectedPlan.price}
                bundleId={selectedPlan.bundleId}
                isAnnual={isAnnual}
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
