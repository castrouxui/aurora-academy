"use client";

import { useEffect, useState } from 'react';
import { X, ArrowRight, ShieldCheck, Lock, Zap, CheckCircle2, Loader2 } from 'lucide-react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { TESTIMONIALS } from "@/constants/testimonials";
import { getRegisteredUserCount, getReviewAvatars } from "@/actions/user";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseTitle: string;
    coursePrice: string; // "$40.000"
    courseId?: string;
    bundleId?: string;
    userId?: string;
    isAnnual?: boolean; // Flag for annual subscriptions to enable installments
}

export function PaymentModal({ isOpen, onClose, courseTitle, coursePrice, courseId, bundleId, userId, isAnnual = false }: PaymentModalProps) {
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

    // UI State
    const [randomAvatars, setRandomAvatars] = useState<string[]>([]);
    const [userCount, setUserCount] = useState(1000);

    useEffect(() => {
        const initSocialProof = async () => {
            // 1. Get total users count
            getRegisteredUserCount().then(setUserCount);

            // 2. Try to get real avatars from DB
            const dbAvatars = await getReviewAvatars();

            let finalAvatars: string[] = [];

            if (dbAvatars && dbAvatars.length >= 3) {
                // If we have enough real DB avatars, use them (random shuffle)
                finalAvatars = dbAvatars.sort(() => 0.5 - Math.random()).slice(0, 3);
            } else {
                // Fallback: Mix DB avatars with Testimonials
                const testimonialAvatars = TESTIMONIALS.map(t => t.image);
                const combined = [...dbAvatars, ...testimonialAvatars];
                // Shuffle and pick 3
                finalAvatars = combined.sort(() => 0.5 - Math.random()).slice(0, 3);
            }

            setRandomAvatars(finalAvatars);
        };

        initSocialProof();
    }, []);

    const handleApplyCoupon = async () => {
        setCouponError("");
        setIsValidatingCoupon(true);
        // Check if it's a bundle purchase
        if (!bundleId) {
            setCouponError("Los cupones solo son válidos para membresías.");
            setIsValidatingCoupon(false);
            return;
        }

        try {
            const res = await fetch("/api/coupons/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: couponCode, bundleId }), // Send bundleId context
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
                    // Use create-subscription for Monthly Bundles (Recurring auto-debit)
                    // Use create-preference for Annual Bundles (Single payment with Installments) or Single Courses
                    const endpoint = (bundleId && !isAnnual)
                        ? '/api/payment/create-subscription'
                        : '/api/payment/create-preference';

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
                            couponCode: appliedCoupon?.code, // Send coupon code if applied
                            isAnnual: isAnnual // Flag for installments configuration
                        }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        setPreferenceId(data.id);
                        setInitPoint(data.init_point);
                    } else {
                        console.error('Error fetching preference:', data);
                        setInitError(data.details || data.error || "Error creando orden de pago. Verifica tu email.");
                    }
                } catch (error) {
                    console.error('Error:', error);
                    setInitError("Error de conexión con el servidor.");
                } finally {
                    setIsLoading(false);
                }
            };

            createPreference();
        }
    }, [isOpen, courseTitle, coursePrice, preferenceId, courseId, effectiveUserId, appliedCoupon, bundleId, mpEmail]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            {/* 
                Main Container
                - Mobile: Full width/height adaptation, scrollable body
                - Desktop: Centered, fixed max-height, internal scrolling
            */}
            <div className="bg-[#13151A] w-full max-w-5xl h-[100dvh] md:h-auto md:max-h-[85vh] rounded-none md:rounded-2xl shadow-2xl flex flex-col md:flex-row relative overflow-hidden border-none md:border border-white/20 ring-1 ring-white/5">

                {/* Close Button - Fixed on mobile to ensure visibility */}
                <button
                    onClick={onClose}
                    className="fixed top-4 right-4 md:absolute z-50 text-gray-400 hover:text-white bg-black/40 hover:bg-black/60 p-2 rounded-full transition-all backdrop-blur-md"
                >
                    <X size={20} />
                </button>

                {/* LEFT COLUMN: Order Summary (Visual & Trust) */}
                <div className="w-full md:w-5/12 bg-[#0D0F13] p-6 md:p-8 flex flex-col border-b md:border-b-0 md:border-r border-white/10 relative shrink-0 overflow-y-auto custom-scrollbar">

                    {/* Background blob */}
                    <div className="absolute top-0 left-0 w-full h-40 bg-indigo-500/5 blur-3xl pointer-events-none"></div>

                    <div className="relative z-10">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                            Tu Resumen
                        </h3>

                        {/* Title & Price */}
                        <div className="mb-8">
                            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
                                {courseTitle}
                            </h2>

                            <div className="flex flex-col">
                                {appliedCoupon ? (
                                    <>
                                        <div className="flex items-center gap-2 text-gray-500 line-through text-sm">
                                            <span>
                                                {new Intl.NumberFormat("es-AR", {
                                                    style: "currency",
                                                    currency: "ARS",
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0
                                                }).format(Number(coursePrice.replace(/[^0-9]/g, '')))}
                                            </span>
                                        </div>
                                        <div className="flex items-end gap-2 text-emerald-400">
                                            {(() => {
                                                const numericParams = Number(coursePrice.replace(/[^0-9]/g, ''));
                                                let final = numericParams;
                                                if (appliedCoupon.type === 'PERCENTAGE') {
                                                    final = final - (final * (appliedCoupon.discount / 100));
                                                } else {
                                                    final = final - appliedCoupon.discount;
                                                }
                                                return (
                                                    <span className="text-4xl font-bold tracking-tight">
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
                                    <span className="text-4xl font-bold text-white tracking-tight">
                                        {new Intl.NumberFormat("es-AR", {
                                            style: "currency",
                                            currency: "ARS",
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        }).format(Number(coursePrice.replace(/[^0-9]/g, '')))}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Features List */}
                        <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                <div className="bg-emerald-500/10 p-1.5 rounded-full mt-0.5 shrink-0">
                                    <Zap size={14} className="text-emerald-400" />
                                </div>
                                <span className="text-sm text-gray-300">Acceso inmediato y completo al contenido.</span>
                            </div>
                            <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                <div className="bg-emerald-500/10 p-1.5 rounded-full mt-0.5 shrink-0">
                                    <ShieldCheck size={14} className="text-emerald-400" />
                                </div>
                                <span className="text-sm text-gray-300">Garantía de satisfacción de 7 días.</span>
                            </div>
                            <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                <div className="bg-emerald-500/10 p-1.5 rounded-full mt-0.5 shrink-0">
                                    <Lock size={14} className="text-emerald-400" />
                                </div>
                                <span className="text-sm text-gray-300">Pago encriptado y 100% seguro.</span>
                            </div>
                        </div>

                        {/* Social Proof */}
                        <div className="pt-6 border-t border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-3">
                                    {randomAvatars.length > 0 ? randomAvatars.map((img, i) => (
                                        <img key={i} className="w-9 h-9 rounded-full border-2 border-[#0D0F13] object-cover" src={img} alt="Student" />
                                    )) : (
                                        <>
                                            <img className="w-9 h-9 rounded-full border-2 border-[#0D0F13] object-cover" src={TESTIMONIALS[0].image} alt="Student" />
                                            <img className="w-9 h-9 rounded-full border-2 border-[#0D0F13] object-cover" src={TESTIMONIALS[1].image} alt="Student" />
                                        </>
                                    )}
                                    <div className="w-9 h-9 rounded-full border-2 border-[#0D0F13] bg-[#1e2235] flex items-center justify-center text-[10px] font-bold text-white">
                                        {userCount > 1000 ? `+${Math.floor(userCount / 1000)}k` : userCount}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1 mb-0.5">
                                        <span className="text-[10px] text-yellow-400">★★★★★</span>
                                    </div>
                                    <p className="text-xs text-gray-400 leading-snug">
                                        Elegido por <span className="text-white font-bold">{userCount} Estudiantes Activos</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Action Form */}
                <div className="w-full md:w-7/12 bg-[#13151A] relative flex flex-col h-full overflow-hidden">

                    {/* Scrollable Form Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            Finalizar Compra
                        </h3>

                        {initError && (
                            <div className="mb-6 p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                                <X className="shrink-0 mt-0.5" size={16} />
                                <span className="break-words">{initError}</span>
                            </div>
                        )}

                        {paymentStatus === 'approved' ? (
                            <div className="flex flex-col items-center justify-center h-full py-10 animate-in zoom-in duration-300">
                                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                    <CheckCircle2 size={40} className="text-emerald-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">¡Pago Confirmado!</h3>
                                <p className="text-gray-400 text-center max-w-xs mb-8">
                                    Te estamos redirigiendo a tu curso...
                                </p>
                                <div className="w-40 h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 animate-[progress_3s_ease-in-out_forwards]"></div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">

                                {/* Email Input */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        Email de tu cuenta Mercado Pago
                                    </label>
                                    <input
                                        type="email"
                                        value={mpEmail}
                                        onChange={(e) => {
                                            setMpEmail(e.target.value);
                                            setPreferenceId(null);
                                        }}
                                        placeholder="tu@email.com"
                                        className="w-full bg-[#1A1D26] border border-white/5 text-white text-sm rounded-xl px-4 py-3 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-gray-600"
                                    />
                                    <p className="text-[10px] text-gray-500">
                                        Importante: Usá el mismo email que tenés registrado en Mercado Pago para evitar problemas.
                                    </p>
                                </div>

                                {/* Coupon Input */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                                        <span>Cupón de Descuento</span>
                                        {isAnnual && (
                                            <span className="text-[10px] text-emerald-400 normal-case flex items-center gap-1">
                                                <Zap size={10} /> Ya estás ahorrando 3 meses
                                            </span>
                                        )}
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            placeholder={isAnnual ? "Plan anual ya tiene descuento" : "CÓDIGO"}
                                            disabled={!!appliedCoupon || isAnnual}
                                            className="flex-1 bg-[#1A1D26] border border-white/5 text-white text-sm rounded-xl px-4 py-3 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        {appliedCoupon ? (
                                            <button
                                                onClick={() => {
                                                    setAppliedCoupon(null);
                                                    setCouponCode("");
                                                    setPreferenceId(null);
                                                }}
                                                className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 rounded-xl hover:bg-red-500/20 transition-colors"
                                            >
                                                <X size={18} />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={!couponCode || isValidatingCoupon || isAnnual}
                                                className="bg-white/5 text-white border border-white/10 px-6 rounded-xl font-medium hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                                            >
                                                {isValidatingCoupon ? <Loader2 size={16} className="animate-spin" /> : "Aplicar"}
                                            </button>
                                        )}
                                    </div>
                                    {!isAnnual && couponError && <p className="text-red-400 text-xs">{couponError}</p>}
                                    {appliedCoupon && (
                                        <p className="text-emerald-400 text-xs flex items-center gap-1.5">
                                            <CheckCircle2 size={12} />
                                            Cupón {appliedCoupon.code} aplicado
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FIXED ACTION AREA: Button & Footer */}
                    {paymentStatus !== 'approved' && (
                        <div className="bg-[#13151A] border-t border-white/5 p-6 md:p-8 space-y-4 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                            {/* Main Action Button Block */}
                            <div>
                                {isLoading ? (
                                    <div className="w-full h-14 bg-white/5 rounded-xl flex items-center justify-center gap-3 text-gray-400 animate-pulse border border-white/5">
                                        <Loader2 size={20} className="animate-spin" />
                                        <span className="text-sm font-medium">Preparando pago...</span>
                                    </div>
                                ) : preferenceId ? (
                                    <a
                                        href={preferenceId ? initPoint! : "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative w-full h-14 bg-[#009EE3] hover:bg-[#008CC9] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#009EE3]/20 hover:shadow-[#009EE3]/40 flex items-center justify-between px-6 overflow-hidden"
                                    >
                                        <div className="flex items-center gap-3 z-10">
                                            <div className="bg-white/20 p-1.5 rounded-lg flex items-center justify-center">
                                                <img src="/mercadopago.png" alt="MP" className="h-5 w-auto object-contain brightness-0 invert" />
                                            </div>
                                            <span className="text-base tracking-wide">Pagar con Mercado Pago</span>
                                        </div>
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform z-10" />
                                        {/* Shine effect */}
                                        <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-[shimmer_2.5s_infinite]"></div>
                                    </a>
                                ) : (
                                    <button
                                        disabled={true}
                                        className="w-full h-14 bg-white/5 text-gray-500 font-bold rounded-xl border border-white/5 flex items-center justify-center cursor-not-allowed"
                                    >
                                        <span>Completa los datos para continuar</span>
                                    </button>
                                )}

                                {/* Helper Text */}
                                <p className="text-center text-[10px] text-gray-400 mt-4 leading-relaxed font-light">
                                    Al continuar, aceptas iniciar una suscripción recurrente (si corresponde) y nuestros términos y condiciones.
                                </p>
                            </div>

                            {/* Footer - Part of the fixed area now */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">🇦🇷</span>
                                    <span className="text-xs text-gray-500 font-medium">Precios en Pesos.</span>
                                </div>
                                <div className="flex items-center gap-2 grayscale opacity-50">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest hidden sm:block">Procesado por</span>
                                    <img src="/mercadopago.png" alt="Mercado Pago" className="h-4 w-auto object-contain" />
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

        </div>
    );
}
