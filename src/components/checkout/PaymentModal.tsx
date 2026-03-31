"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowRight, ShieldCheck, Lock, Zap, CheckCircle2, Loader2, ChevronLeft } from 'lucide-react';
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
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

type CheckoutStep = 'auth-email' | 'auth-verify' | 'auth-password' | 'payment';

export function PaymentModal({ isOpen, onClose, courseTitle, coursePrice, courseId, bundleId, userId, isAnnual = false }: PaymentModalProps) {
    useBodyScrollLock(isOpen);
    const { data: session, update: updateSession, status: sessionStatus } = useSession();
    const router = useRouter();
    const effectiveUserId = userId || session?.user?.id;

    // Checkout step — empieza en 'payment' si ya tiene sesión, o espera si todavía está cargando
    const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>(
        session?.user ? 'payment' : 'auth-email'
    );
    const isSessionLoading = sessionStatus === 'loading';

    // Estado del auth inline
    const [authEmail, setAuthEmail] = useState("");
    const [authPassword, setAuthPassword] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [isNewUser, setIsNewUser] = useState(false);
    const [isGoogleUser, setIsGoogleUser] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    // Si ya tiene sesión al abrir el modal, ir directo al pago (también cubre el caso de carga tardía)
    useEffect(() => {
        if (sessionStatus === 'loading') return;
        if (session?.user && checkoutStep !== 'payment') {
            setCheckoutStep('payment');
            if (session.user.email) setMpEmail(session.user.email);
        }
    }, [session, sessionStatus]);

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
            getRegisteredUserCount().then(setUserCount);
            const dbAvatars = await getReviewAvatars();
            let finalAvatars: string[] = [];
            if (dbAvatars && dbAvatars.length >= 3) {
                finalAvatars = dbAvatars.sort(() => 0.5 - Math.random()).slice(0, 3);
            } else {
                const testimonialAvatars = TESTIMONIALS.map(t => t.image);
                const combined = [...dbAvatars, ...testimonialAvatars];
                finalAvatars = combined.sort(() => 0.5 - Math.random()).slice(0, 3);
            }
            setRandomAvatars(finalAvatars);
        };
        initSocialProof();
    }, []);

    const handleApplyCoupon = async () => {
        setCouponError("");
        setIsValidatingCoupon(true);
        if (!bundleId) {
            setCouponError("Los cupones solo son válidos para membresías.");
            setIsValidatingCoupon(false);
            return;
        }
        try {
            const res = await fetch("/api/coupons/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: couponCode, bundleId }),
            });
            const data = await res.json();
            if (!res.ok) {
                setCouponError(data || "Cupón inválido");
                setAppliedCoupon(null);
            } else {
                setAppliedCoupon(data);
                setPreferenceId(null);
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
                            setTimeout(() => {
                                router.push('/dashboard/cursos');
                                onClose();
                            }, 3000);
                        }
                    }
                } catch (error) {
                    console.error("Polling error:", error);
                }
            }, 3000);
        }
        return () => { if (intervalId) clearInterval(intervalId); };
    }, [preferenceId, isOpen, router, onClose, effectiveUserId, courseId, paymentStatus]);

    // Crear preferencia de pago — solo cuando estamos en el paso de pago y el usuario está identificado
    useEffect(() => {
        if (isOpen && !preferenceId && mpEmail && checkoutStep === 'payment' && effectiveUserId) {
            const createPreference = async () => {
                setIsLoading(true);
                setInitError(null);
                try {
                    const endpoint = (bundleId && !isAnnual)
                        ? '/api/payment/create-subscription'
                        : '/api/payment/create-preference';

                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            title: courseTitle,
                            price: coursePrice,
                            quantity: 1,
                            courseId,
                            bundleId,
                            userId: effectiveUserId,
                            email: mpEmail,
                            couponCode: appliedCoupon?.code,
                            isAnnual,
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
    }, [isOpen, courseTitle, coursePrice, preferenceId, courseId, effectiveUserId, appliedCoupon, bundleId, mpEmail, checkoutStep]);

    // ── Handlers de autenticación ────────────────────────────────────────────

    const sendOtp = async (email: string) => {
        await fetch("/api/auth/send-verification", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        // Cooldown de 60s para el botón "Reenviar"
        setResendCooldown(60);
        const interval = setInterval(() => {
            setResendCooldown(prev => {
                if (prev <= 1) { clearInterval(interval); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const email = authEmail.trim().toLowerCase();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setAuthError("Ingresá un email válido.");
            return;
        }
        setAuthError(null);
        setIsAuthLoading(true);
        try {
            const res = await fetch("/api/auth/check-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (!res.ok) {
                setAuthError(res.status === 429
                    ? "Demasiados intentos. Esperá un momento y volvé a intentar."
                    : "Error al verificar el email. Intentá de nuevo."
                );
                return;
            }
            const data = await res.json();
            const googleUser = data.exists && !data.hasPassword;
            const newUser = !data.exists;

            setIsGoogleUser(googleUser);
            setIsNewUser(googleUser || newUser);
            setMpEmail(email);

            if (googleUser) {
                // Usuario de Google: enviar OTP para verificar identidad antes de crear contraseña
                await sendOtp(email);
                setCheckoutStep('auth-verify');
            } else {
                setCheckoutStep('auth-password');
            }
        } catch {
            setAuthError("Error al verificar el email. Intentá de nuevo.");
        } finally {
            setIsAuthLoading(false);
        }
    };

    const handleVerifySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otpCode || otpCode.length !== 6) {
            setAuthError("Ingresá el código de 6 dígitos.");
            return;
        }
        setAuthError(null);
        setIsAuthLoading(true);
        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: authEmail.trim().toLowerCase(), code: otpCode }),
            });
            const data = await res.json();
            if (!res.ok || !data.valid) {
                setAuthError(data.error || "Código inválido. Intentá de nuevo.");
                return;
            }
            setCheckoutStep('auth-password');
        } catch {
            setAuthError("Error de conexión. Intentá de nuevo.");
        } finally {
            setIsAuthLoading(false);
        }
    };

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authPassword) {
            setAuthError("Ingresá tu contraseña.");
            return;
        }
        setAuthError(null);
        setIsAuthLoading(true);
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: authEmail.trim().toLowerCase(),
                password: authPassword,
                isRegister: isNewUser ? "true" : "false",
            });

            if (result?.error) {
                setAuthError(
                    result.error === "El usuario ya existe"
                        ? "Este email ya tiene una cuenta. Volvé al paso anterior y elegí iniciar sesión."
                        : result.error === "Contraseña incorrecta"
                        ? "Contraseña incorrecta. Intentá de nuevo."
                        : "Error al autenticar. Verificá tus datos."
                );
                return;
            }

            // Refresh session without reload
            await updateSession();
            // mpEmail is already set from handleEmailSubmit
            setCheckoutStep('payment');
        } catch {
            setAuthError("Error de conexión. Intentá de nuevo.");
        } finally {
            setIsAuthLoading(false);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    if (!isOpen || !isMounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#13151A] w-full max-w-5xl h-[100dvh] md:h-auto md:max-h-[85vh] rounded-none md:rounded-2xl shadow-2xl flex flex-col md:flex-row relative overflow-hidden border-none md:border border-white/20 ring-1 ring-white/5">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 md:top-4 md:right-4 z-50 text-gray-400 hover:text-white bg-black/40 hover:bg-black/60 p-1.5 rounded-full transition-all backdrop-blur-md"
                >
                    <X size={18} />
                </button>

                {/* Mobile-only compact summary header */}
                <div className="md:hidden flex items-center gap-3 px-5 py-3.5 border-b border-white/8 bg-[#0D0F13] shrink-0 pr-12">
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none mb-0.5">Comprando</p>
                        <p className="text-sm font-bold text-white truncate">{courseTitle}</p>
                    </div>
                    <div className="text-right shrink-0">
                        {appliedCoupon ? (
                            <p className="text-base font-bold text-emerald-400">
                                {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(
                                    Math.max(0, Number(coursePrice.replace(/[^0-9]/g, '')) * (appliedCoupon.type === 'PERCENTAGE' ? (1 - appliedCoupon.discount / 100) : 1) - (appliedCoupon.type !== 'PERCENTAGE' ? appliedCoupon.discount : 0))
                                )}
                            </p>
                        ) : (
                            <p className="text-base font-bold text-white">
                                {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(coursePrice.replace(/[^0-9]/g, '')))}
                            </p>
                        )}
                        {isAnnual && <p className="text-[10px] text-emerald-400 leading-none mt-0.5">Plan Anual</p>}
                    </div>
                </div>

                {/* LEFT COLUMN: Order Summary — desktop only */}
                <div className="hidden md:flex w-full md:w-5/12 bg-[#0D0F13] p-6 md:p-8 flex-col border-b md:border-b-0 md:border-r border-white/10 relative shrink-0 overflow-y-auto custom-scrollbar">
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
                                                {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(coursePrice.replace(/[^0-9]/g, '')))}
                                            </span>
                                        </div>
                                        <div className="flex items-end gap-2 text-emerald-400">
                                            {(() => {
                                                const base = Number(coursePrice.replace(/[^0-9]/g, ''));
                                                let final = base;
                                                if (appliedCoupon.type === 'PERCENTAGE') {
                                                    final = final - (final * (appliedCoupon.discount / 100));
                                                } else {
                                                    final = final - appliedCoupon.discount;
                                                }
                                                return (
                                                    <span className="text-4xl font-bold tracking-tight">
                                                        {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.max(0, final))}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    </>
                                ) : (
                                    <span className="text-4xl font-bold text-white tracking-tight">
                                        {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(coursePrice.replace(/[^0-9]/g, '')))}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Features */}
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

                    {/* ── PASO: email ──────────────────────────────────────── */}
                    {checkoutStep === 'auth-email' && (
                        <>
                            <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar">
                                <h3 className="text-base md:text-xl font-bold text-white mb-1">Continuar con tu compra</h3>
                                <p className="text-xs md:text-sm text-gray-400 mb-4 md:mb-6">Ingresá tu email para continuar</p>

                                {authError && (
                                    <div className="mb-4 p-3 bg-red-500/5 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                                        <X className="shrink-0 mt-0.5" size={16} />
                                        <span>{authError}</span>
                                    </div>
                                )}

                                <form onSubmit={handleEmailSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={authEmail}
                                            onChange={(e) => setAuthEmail(e.target.value)}
                                            placeholder="tu@email.com"
                                            autoFocus
                                            required
                                            className="w-full bg-[#1A1D26] border border-white/5 text-white text-sm rounded-xl px-4 py-3 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-gray-600"
                                        />
                                        <p className="text-[10px] text-gray-500">
                                            Tip: Usá el mismo email que tenés en Mercado Pago para evitar problemas.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isAuthLoading || !authEmail}
                                        className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                                    >
                                        {isAuthLoading ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <>Continuar <ArrowRight size={16} /></>
                                        )}
                                    </button>
                                </form>
                            </div>

                            <div className="bg-[#13151A] border-t border-white/5 p-4 md:p-6 shrink-0">
                                <div className="flex items-center justify-center gap-2 grayscale opacity-40">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">Procesado por</span>
                                    <img src="/mercadopago.png" alt="Mercado Pago" className="h-4 w-auto object-contain" />
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── PASO: verificación OTP (solo usuarios de Google) ─── */}
                    {checkoutStep === 'auth-verify' && (
                        <>
                            <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar">
                                <button
                                    type="button"
                                    onClick={() => { setCheckoutStep('auth-email'); setAuthError(null); setOtpCode(""); }}
                                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white mb-6 transition-colors"
                                >
                                    <ChevronLeft size={14} /> Cambiar email
                                </button>

                                <h3 className="text-xl font-bold text-white mb-1">Revisá tu email</h3>
                                <p className="text-sm text-gray-400 mb-1">
                                    Te enviamos un código de 6 dígitos a:
                                </p>
                                <p className="text-sm text-white font-medium mb-6">{authEmail}</p>

                                {authError && (
                                    <div className="mb-4 p-3 bg-red-500/5 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                                        <X className="shrink-0 mt-0.5" size={16} />
                                        <span>{authError}</span>
                                    </div>
                                )}

                                <form onSubmit={handleVerifySubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            Código de verificación
                                        </label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            maxLength={6}
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            placeholder="000000"
                                            autoFocus
                                            required
                                            className="w-full bg-[#1A1D26] border border-white/5 text-white text-2xl font-mono text-center tracking-[0.5em] rounded-xl px-4 py-3 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-gray-700 placeholder:tracking-[0.5em]"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isAuthLoading || otpCode.length !== 6}
                                        className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                                    >
                                        {isAuthLoading ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <>Verificar <ArrowRight size={16} /></>
                                        )}
                                    </button>

                                    <div className="text-center">
                                        <span className="text-xs text-gray-500">¿No te llegó? </span>
                                        {resendCooldown > 0 ? (
                                            <span className="text-xs text-gray-500">Reenviar en {resendCooldown}s</span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => { setAuthError(null); sendOtp(authEmail.trim().toLowerCase()); }}
                                                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                                            >
                                                Reenviar código
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            <div className="bg-[#13151A] border-t border-white/5 p-4 md:p-6 shrink-0">
                                <div className="flex items-center justify-center gap-2 grayscale opacity-40">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">Procesado por</span>
                                    <img src="/mercadopago.png" alt="Mercado Pago" className="h-4 w-auto object-contain" />
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── PASO: contraseña ─────────────────────────────────── */}
                    {checkoutStep === 'auth-password' && (
                        <>
                            <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar">
                                <button
                                    type="button"
                                    onClick={() => { setCheckoutStep('auth-email'); setAuthError(null); setAuthPassword(""); }}
                                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white mb-6 transition-colors"
                                >
                                    <ChevronLeft size={14} /> Cambiar email
                                </button>

                                <h3 className="text-xl font-bold text-white mb-1">
                                    {isNewUser ? "Creá tu contraseña" : "Ingresá tu contraseña"}
                                </h3>
                                <p className="text-sm text-gray-400 mb-6">
                                    {isNewUser ? "Tu cuenta se creará automáticamente al continuar." : "Iniciá sesión para continuar con tu compra."}
                                </p>

                                {authError && (
                                    <div className="mb-4 p-3 bg-red-500/5 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                                        <X className="shrink-0 mt-0.5" size={16} />
                                        <span>{authError}</span>
                                    </div>
                                )}

                                <form onSubmit={handleAuthSubmit} className="space-y-4">
                                    {/* Email readonly */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</label>
                                        <div className="w-full bg-[#1A1D26]/50 border border-white/5 text-gray-400 text-sm rounded-xl px-4 py-3">
                                            {authEmail}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            {isNewUser ? "Contraseña nueva" : "Contraseña"}
                                        </label>
                                        <input
                                            type="password"
                                            value={authPassword}
                                            onChange={(e) => setAuthPassword(e.target.value)}
                                            placeholder={isNewUser ? "Mínimo 6 caracteres" : "Tu contraseña"}
                                            autoFocus
                                            required
                                            minLength={isNewUser ? 6 : undefined}
                                            className="w-full bg-[#1A1D26] border border-white/5 text-white text-sm rounded-xl px-4 py-3 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-gray-600"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isAuthLoading || !authPassword}
                                        className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                                    >
                                        {isAuthLoading ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <>Continuar al pago <ArrowRight size={16} /></>
                                        )}
                                    </button>
                                </form>
                            </div>

                            <div className="bg-[#13151A] border-t border-white/5 p-4 md:p-6 shrink-0">
                                <div className="flex items-center justify-center gap-2 grayscale opacity-40">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">Procesado por</span>
                                    <img src="/mercadopago.png" alt="Mercado Pago" className="h-4 w-auto object-contain" />
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── PASO: pago ───────────────────────────────────────── */}
                    {checkoutStep === 'payment' && (
                        <>
                            <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar">
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
                                        {bundleId && (
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
                                                            onClick={() => { setAppliedCoupon(null); setCouponCode(""); setPreferenceId(null); }}
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
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* ÁREA DE ACCIÓN FIJA */}
                            {paymentStatus !== 'approved' && (
                                <div className="bg-[#13151A] border-t border-white/5 p-6 md:p-8 space-y-4 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                                    <div>
                                        {isLoading ? (
                                            <div className="w-full h-14 bg-white/5 rounded-xl flex items-center justify-center gap-3 text-gray-400 animate-pulse border border-white/5">
                                                <Loader2 size={20} className="animate-spin" />
                                                <span className="text-sm font-medium">Preparando pago...</span>
                                            </div>
                                        ) : preferenceId ? (
                                            <a
                                                href={initPoint!}
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
                                        <p className="text-center text-[10px] text-gray-400 mt-4 leading-relaxed font-light">
                                            Al continuar, aceptas iniciar una suscripción recurrente (si corresponde) y nuestros términos y condiciones.
                                        </p>
                                    </div>
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
                        </>
                    )}

                </div>
            </div>
        </div>,
        document.body
    );
}
