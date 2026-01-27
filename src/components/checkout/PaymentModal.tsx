"use client";

import { useEffect, useState } from 'react';
import { X, ArrowRight, ShieldCheck, Lock, Zap, CheckCircle2, Loader2 } from 'lucide-react';
import { useSession } from "next-auth/react";
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { useRouter } from 'next/navigation';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseTitle: string;
    coursePrice: string; // "$40.000"
    courseId?: string;
    bundleId?: string;
    userId?: string;
}

export function PaymentModal({ isOpen, onClose, courseTitle, coursePrice, courseId, bundleId, userId }: PaymentModalProps) {
    useBodyScrollLock(isOpen);
    const { data: session } = useSession();
    const router = useRouter();
    const effectiveUserId = userId || session?.user?.id;

    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [initPoint, setInitPoint] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [initError, setInitError] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'approved' | 'rejected'>('idle');

    // Coupon State
    const [couponCode, setCouponCode] = useState("");
    const [couponError, setCouponError] = useState("");
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string, discount: number, type: string } | null>(null);

    const handleApplyCoupon = async () => {
        setCouponError("");
        setIsValidatingCoupon(true);
        try {
            const res = await fetch("/api/coupons/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: couponCode }),
            });
            const data = await res.json();

            if (!res.ok) {
                setCouponError(data || "Cupón inválido");
                setAppliedCoupon(null);
            } else {
                setAppliedCoupon(data);
                setPreferenceId(null); // Force re-init with new price
            }
        } catch (error) {
            console.error(error);
            setCouponError("Error al validar cupón");
        } finally {
            setIsValidatingCoupon(false);
        }
    };

    const [mpEmail, setMpEmail] = useState(session?.user?.email || "");

    // Update mpEmail when session loads
    useEffect(() => {
        if (session?.user?.email) {
            setMpEmail(session.user.email);
        }
    }, [session]);

    // Polling for Payment Status
    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (preferenceId && isOpen && paymentStatus !== 'approved') {
            intervalId = setInterval(async () => {
                try {
                    const res = await fetch(`/api/payment/status?preferenceId=${preferenceId}&userId=${effectiveUserId}&courseId=${courseId || ''}&bundleId=${bundleId || ''}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.status === 'approved') {
                            setPaymentStatus('approved');
                            clearInterval(intervalId);
                            // Show success message for 3 seconds then redirect
                            setTimeout(() => {
                                router.push('/dashboard/cursos'); // Redirect to success
                                onClose();
                            }, 3000);
                        }
                    }
                } catch (error) {
                    console.error("Polling error:", error);
                }
            }, 3000); // Check every 3 seconds
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [preferenceId, isOpen, router, onClose, effectiveUserId, courseId, paymentStatus]);

    // Create Preference Effect
    useEffect(() => {
        if (isOpen && !preferenceId && mpEmail) {
            // Create preference when modal opens or coupon/email changes (clearing prefId)
            const createPreference = async () => {
                setIsLoading(true);
                setInitError(null); // Reset error
                try {
                    // Determine endpoint based on bundleId presence
                    const endpoint = bundleId ? '/api/payment/create-subscription' : '/api/payment/create-preference';

                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            title: courseTitle,
                            price: coursePrice,
                            quantity: 1,
                            courseId: courseId,
                            bundleId: bundleId,
                            userId: effectiveUserId,
                            email: mpEmail, // Send editable MP Email
                            couponCode: appliedCoupon?.code // Send coupon code if applied
                        }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        setPreferenceId(data.id);
                        setInitPoint(data.init_point);
                    } else {
                        console.error('Error fetching preference:', data);
                        setInitError("Error creando orden de pago. Verifica tu email.");
                    }
                } catch (error) {
                    console.error('Error:', error);
                    setInitError("Error de conexión con el servidor.");
                } finally {
                    setIsLoading(false);
                }
            };

            const timer = setTimeout(() => {
                createPreference();
            }, 800); // Debounce input

            return () => clearTimeout(timer);
        }
    }, [isOpen, courseTitle, coursePrice, preferenceId, courseId, effectiveUserId, appliedCoupon, bundleId, mpEmail]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            {/* 
                Mobile: h-[100dvh] but scrollable content if it overflows.
                Desktop: Max height with internal scrolling.
            */}
            <div className="bg-card w-full h-[100dvh] md:h-auto md:max-h-[85vh] md:max-w-2xl rounded-none md:rounded-2xl shadow-2xl overflow-y-auto md:overflow-visible border-0 md:border border-border flex flex-col md:flex-row relative">

                {/* Close Button (Absolute) - Fixed position on mobile to be always visible */}
                <button
                    onClick={onClose}
                    className="fixed md:absolute top-4 right-4 z-50 text-muted-foreground hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition-all backdrop-blur-md"
                >
                    <X size={20} />
                </button>

                {/* LEFT COLUMN: Order Summary (Darker/Card style) */}
                <div className="w-full md:w-5/12 bg-muted/30 p-6 md:p-8 flex flex-col border-r border-border relative overflow-hidden shrink-0">

                    {/* Background blob for visual interest */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-primary/5 blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 flex-1">
                        <h3 className="text-muted-foreground text-sm font-bold uppercase tracking-widest mb-4 md:mb-6 flex items-center gap-2">
                            Tu Resumen
                        </h3>

                        <div className="mb-6 md:mb-8">
                            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2 leading-tight pr-8">
                                {courseTitle}
                            </h2>
                            <div className="flex flex-col mt-3 md:mt-4">
                                {appliedCoupon ? (
                                    <>
                                        <div className="flex items-center gap-2 text-muted-foreground line-through text-xs font-medium">
                                            <span>
                                                {new Intl.NumberFormat("es-AR", {
                                                    style: "currency",
                                                    currency: "ARS",
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0
                                                }).format(Number(coursePrice.replace(/[^0-9]/g, '')))}
                                            </span>
                                        </div>
                                        <div className="flex items-end gap-2 text-green-400">
                                            {(() => {
                                                const numericParams = Number(coursePrice.replace(/[^0-9]/g, ''));
                                                let final = numericParams;
                                                if (appliedCoupon.type === 'PERCENTAGE') {
                                                    final = final - (final * (appliedCoupon.discount / 100));
                                                } else {
                                                    final = final - appliedCoupon.discount;
                                                }
                                                return (
                                                    <span className="text-3xl md:text-4xl font-black tracking-tight">
                                                        {new Intl.NumberFormat("es-AR", {
                                                            style: "currency",
                                                            currency: "ARS",
                                                            minimumFractionDigits: 0,
                                                            maximumFractionDigits: 0
                                                        }).format(Math.max(0, final))}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-end gap-2">
                                        <span className="text-3xl md:text-4xl font-black text-white tracking-tight">
                                            {new Intl.NumberFormat("es-AR", {
                                                style: "currency",
                                                currency: "ARS",
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            }).format(Number(coursePrice.replace(/[^0-9]/g, '')))}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Features List */}
                        <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                            <div className="flex items-start gap-3 text-gray-300">
                                <div className="bg-green-500/10 p-1 rounded-full mt-0.5">
                                    <Zap size={16} className="text-green-400" />
                                </div>
                                <span className="text-sm">Acceso inmediato y vitalicio al contenido.</span>
                            </div>
                            <div className="flex items-start gap-3 text-gray-300">
                                <div className="bg-green-500/10 p-1 rounded-full mt-0.5">
                                    <ShieldCheck size={16} className="text-green-400" />
                                </div>
                                <span className="text-sm">Garantía de satisfacción de 7 días.</span>
                            </div>
                            <div className="flex items-start gap-3 text-gray-300">
                                <div className="bg-green-500/10 p-1 rounded-full mt-0.5">
                                    <Lock size={16} className="text-green-400" />
                                </div>
                                <span className="text-sm">Pago encriptado y 100% seguro.</span>
                            </div>
                        </div>

                        {/* Subscriber Email Input */}
                        <div className="mb-6">
                            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                                Email de tu Cuenta Mercado Pago
                            </label>
                            <input
                                type="email"
                                value={mpEmail}
                                onChange={(e) => {
                                    setMpEmail(e.target.value);
                                    setPreferenceId(null); // Re-trigger preference creation on change
                                }}
                                placeholder="tu@email.com"
                                className="bg-background border border-border text-foreground text-sm rounded-lg px-3 py-2 w-full focus:border-primary outline-none h-10"
                            />
                            <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
                                * Debe coincidir con el email de tu cuenta de Mercado Pago para evitar errores.
                            </p>
                        </div>

                        {/* Coupon Input */}
                        <div className="mb-6 md:mb-8">
                            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                                Código de Descuento
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    placeholder="CÓDIGO"
                                    disabled={!!appliedCoupon}
                                    className="bg-background border border-border text-foreground text-sm rounded-lg px-3 py-2 w-full focus:border-primary outline-none disabled:opacity-50 h-10"
                                />
                                {appliedCoupon ? (
                                    <button
                                        onClick={() => {
                                            setAppliedCoupon(null);
                                            setCouponCode("");
                                            setPreferenceId(null); // Force re-init avoiding infinite loop
                                        }}
                                        className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={!couponCode || isValidatingCoupon}
                                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isValidatingCoupon ? <Loader2 size={16} className="animate-spin" /> : "Aplicar"}
                                    </button>
                                )}
                            </div>
                            {couponError && <p className="text-red-400 text-sm mt-2">{couponError}</p>}
                            {appliedCoupon && (
                                <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                                    <CheckCircle2 size={14} /> Cupón {appliedCoupon.code} aplicado (-{appliedCoupon.type === 'PERCENTAGE' ? `${appliedCoupon.discount}%` : `$${appliedCoupon.discount}`})
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Trust Footer in Left Col */}
                    <div className="relative z-10 mt-auto pt-6 border-t border-border/50">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>🛡️</span>
                            <span>Compra protegida por Mercado Pago</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Payment Actions */}
                <div className="w-full md:w-7/12 bg-card relative flex flex-col">

                    {/* Mobile: Padded, Desktop: Internal Scroll */}
                    <div className="p-6 md:p-8 flex-1 md:overflow-y-auto md:max-h-[calc(90vh-80px)]">
                        <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                            Finalizar Compra
                        </h3>

                        {initError && (
                            <div className="mb-6 p-4 bg-red-900/10 border border-red-900/30 rounded-lg flex items-center gap-3 text-red-300 text-sm">
                                <X className="shrink-0 text-red-400" size={18} />
                                {initError}
                            </div>
                        )}

                        {paymentStatus === 'approved' ? (
                            <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in duration-300">
                                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                    <CheckCircle2 size={48} className="text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">¡Pago Confirmado!</h3>
                                <p className="text-muted-foreground text-center max-w-xs mb-8">
                                    Gracias por tu compra. Te estamos redirigiendo a tu curso...
                                </p>
                                <div className="w-full max-w-[200px] h-1 bg-border rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 animate-[progress_3s_ease-in-out_forwards]"></div>
                                </div>
                            </div>
                        ) : isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-4"></div>
                                <p className="text-muted-foreground animate-pulse text-sm">Conectando con Mercado Pago...</p>
                            </div>
                        ) : preferenceId ? (
                            <div className="space-y-6">

                                {/* Step 1 Button */}
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30">1</div>
                                        <h4 className="text-sm font-medium text-foreground">Ir a pagar</h4>
                                    </div>

                                    <a
                                        href={preferenceId ? initPoint! : "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`group relative w-full bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-indigo-900/20 hover:shadow-indigo-900/40 flex items-center justify-between overflow-hidden ${!preferenceId ? 'pointer-events-none opacity-50' : ''}`}
                                    >
                                        <div className="flex items-center gap-3 z-10">
                                            <div className="bg-white/10 p-2 rounded-lg">
                                                <img
                                                    src="/mercadopago.png"
                                                    alt="Mercado Pago"
                                                    className="h-5 w-auto brightness-0 invert object-contain"
                                                />
                                            </div>
                                            <span className="text-lg">Pagar ahora</span>
                                        </div>
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform z-10" />

                                        {/* Shine effect */}
                                        <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-[shimmer_2.5s_infinite]"></div>
                                    </a>
                                </div>

                                {/* Step 2 QR */}
                                <div className="hidden md:block">
                                    <div className="flex items-center gap-3 mb-3 mt-8">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-bold border border-border">2</div>
                                        <h4 className="text-sm font-medium text-gray-300">O escanea el código QR</h4>
                                    </div>

                                    <div className="bg-muted/50 rounded-xl p-4 border border-border flex items-start gap-6">
                                        <div className="bg-white p-2 rounded-lg shrink-0">
                                            <QRCode value={initPoint || ""} size={100} level="M" />
                                        </div>
                                        <div className="py-1">
                                            <p className="text-sm text-gray-300 mb-2 font-medium">Desde tu celular</p>
                                            <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
                                                Abre la App de Mercado Pago y escanea este código para pagar al instante.
                                            </p>
                                            <div className="mt-3 flex items-center gap-2">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                </span>
                                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Esperando pago</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* Right Column Footer (Requested Image info) */}
                    <div className="bg-muted/50 py-4 px-8 border-t border-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🇦🇷</span>
                            <span className="text-xs text-muted-foreground font-medium">Precios en pesos argentinos.</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Pagá con</span>
                            <img
                                src="/mercadopago.png"
                                alt="Mercado Pago"
                                className="h-4 w-auto"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
