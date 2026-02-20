"use client";

import { useEffect, useState, useRef } from "react";
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                    {(bundles.length > 0 ? bundles : PLANS).map((item: any, index: number) => {
                        // Normalize Item (Bundle from DB or Plan from Static)
                        const isDynamic = !!item.id; // Only DB bundles have ID
                        const title = item.title;

                        // Metadata from PLANS (fallback for static info)
                        const staticPlan = PLANS[index] || PLANS.find(p => p.title === title);
                        const description = staticPlan?.description || item.description || "Todo lo que necesitás para empezar";
                        const isRecommended = staticPlan?.isRecommended || index === 1;
                        const tag = staticPlan?.tag || (index === 1 ? "EL MÁS BUSCADO" : undefined);
                        const excludedFeatures = staticPlan?.excludedFeatures || [];

                        // PRICE CALCULATION
                        const rawPriceString = item.price.toString().replace(/[^0-9]/g, '');
                        const basePrice = parseFloat(rawPriceString); // Monthly Price Numerical

                        let finalPrice = basePrice;
                        let periodicity = "mes";
                        let installmentsText = undefined;
                        let totalFormatted = undefined;
                        let savingsBadge = undefined;

                        if (isAnnual) {
                            finalPrice = basePrice * 9; // 12 months for price of 9 (25% off logic approx)
                            // OR use the logic: basePrice * 12 * 0.75
                            // Let's stick to the public page logic closely:
                            // Public page: if annual, finalPrice = basePrice * 9;

                            periodicity = "año";

                            // Installments logic: 12 cuotas sin interés
                            const installmentAmount = finalPrice / 12;
                            const formattedInstallment = new Intl.NumberFormat("es-AR", {
                                style: "currency",
                                currency: "ARS",
                                maximumFractionDigits: 0
                            }).format(installmentAmount);
                            installmentsText = `12 cuotas sin interés de ${formattedInstallment}`;

                            totalFormatted = new Intl.NumberFormat("es-AR", {
                                style: "currency",
                                currency: "ARS",
                                maximumFractionDigits: 0
                            }).format(finalPrice);

                            savingsBadge = "25% OFF";
                        }

                        // Determine Display Features
                        let displayFeatures: (string | React.ReactNode)[] = [];

                        if (isDynamic) {
                            // Dynamic Logic (Copied from Public Page)
                            if (index >= 1) {
                                displayFeatures.push(
                                    <span key={`benefit-15d-${item.id}`} className="inline-flex items-center gap-2 font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                                        <span>🔥</span> 1 curso nuevo cada 15 días
                                    </span>
                                );
                            }

                            // Courses
                            const currentCourseTitles = item.courses?.map((c: any) => c.title) || [];
                            if (index > 0 && bundles.length > 0) {
                                const prevBundle = bundles[index - 1]; // logic assumes sorted bundles
                                const prevCourseTitles = prevBundle?.courses?.map((c: any) => c.title) || [];
                                const hasAllPrevious = prevCourseTitles.length > 0 && prevCourseTitles.every((t: string) => currentCourseTitles.includes(t));

                                if (hasAllPrevious) {
                                    displayFeatures.push(`Todo lo del Plan ${prevBundle.title}`);
                                    const newCourses = currentCourseTitles.filter((t: string) => !prevCourseTitles.includes(t));
                                    displayFeatures.push(...newCourses);
                                } else {
                                    displayFeatures.push(...currentCourseTitles);
                                }
                            } else {
                                displayFeatures.push(...currentCourseTitles);
                            }

                            // Items
                            if (item.items && item.items.length > 0) {
                                const items = item.items.map((i: any) => {
                                    let name = i.name;
                                    if ((name.toLowerCase().includes("canal") || name.toLowerCase().includes("telegram")) && !name.toLowerCase().startsWith("acceso a")) {
                                        return `Acceso a ${name}`;
                                    }
                                    return name;
                                });
                                const existingStrings = displayFeatures.filter(f => typeof f === 'string') as string[];
                                const newItems = items.filter((str: string) => {
                                    if (existingStrings.includes(str)) return false;
                                    if (str.toLowerCase().includes("comunidad de inversores")) return false;
                                    return true;
                                });
                                displayFeatures.push(...newItems);
                            }
                        } else {
                            // Static Features
                            displayFeatures = staticPlan?.features || [];
                        }

                        // DASHBOARD LOGIC: Active / Upgrade / Downgrade
                        // Note: If user has monthly "Trader", and toggles Annual, it IS an upgrade/switch.
                        const isActive = subscription?.active && subscription.bundleTitle === title && !isAnnual;

                        // Determine if it's an upgrade
                        let isUpgrade = false;
                        let isDowngrade = false;

                        if (!isAnnual && subscription?.active && !isActive) {
                            const currentDict = PLANS.find(p => p.title === subscription.bundleTitle);
                            const currentPrice = Number(currentDict?.price.replace(/[^0-9]/g, '') || 0);
                            if (basePrice > currentPrice) isUpgrade = true;
                            if (basePrice < currentPrice) isDowngrade = true;
                        }

                        const handlePlanAction = async () => {
                            if (isActive) return;

                            const bundleId = isDynamic ? item.id : title.toLowerCase().replace(/ /g, '-');
                            // If Annual, we initiate purchase for Annual price.
                            // If user upgrades/downgrades monthly, we use special endpoints.

                            if (isAnnual) {
                                // Annual Purchase
                                // Pass the Calculated Annual Price (finalPrice)
                                const displayPriceStr = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(finalPrice);
                                handlePurchase(title + " (Anual)", displayPriceStr, bundleId);
                                return;
                            }

                            if (isUpgrade) {
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
                                } catch (e) {
                                    toast.error("Error de conexión");
                                } finally {
                                    setActionLoading(false);
                                }
                            } else if (isDowngrade) {
                                if (confirm(`¿Estás seguro de cambiar al plan ${title}? El cambio de precio se aplicará en tu próxima factura.`)) {
                                    setActionLoading(true);
                                    try {
                                        const res = await fetch("/api/subscription/downgrade", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ targetBundleId: bundleId, targetPrice: basePrice.toString() })
                                        });
                                        if (res.ok) {
                                            toast.success("Plan actualizado. Se reflejará en el próximo ciclo.");
                                            window.location.reload();
                                        } else toast.error("Error al cambiar plan");
                                    } catch (e) {
                                        toast.error("Error de conexión");
                                    } finally {
                                        setActionLoading(false);
                                    }
                                }
                            } else {
                                // New Subscription (Standard Monthly)
                                const displayPriceStr = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(basePrice);
                                handlePurchase(title, displayPriceStr, bundleId);
                            }
                        };

                        return (
                            <PricingCard
                                key={index}
                                title={title}
                                price={finalPrice.toString()}
                                periodicity={periodicity}
                                tag={tag}
                                isRecommended={isRecommended}
                                isAnnual={isAnnual}
                                totalPrice={totalFormatted}
                                savings={isAnnual ? "25%" : undefined}
                                description={
                                    <p className="text-gray-400 text-sm min-h-[40px] flex items-center justify-center italic">
                                        {description}
                                    </p>
                                }
                                features={displayFeatures}
                                excludedFeatures={excludedFeatures}
                                buttonText={isActive ? "Plan Actual" : isAnnual ? "Pasarme al Anual" : isUpgrade ? "Mejorar Plan" : isDowngrade ? "Cambiar Plan" : "Suscribirme Ahora"}
                                onAction={handlePlanAction}
                                installments={installmentsText}
                                originalMonthlyPrice={basePrice.toString()}
                                className={isActive ? "opacity-60 grayscale-[0.5] pointer-events-none border-emerald-500/20" : "h-full flex flex-col justify-between"}
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
