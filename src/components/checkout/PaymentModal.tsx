"use client";

import { useEffect, useState } from 'react';
import { X, ArrowRight, ShieldCheck, Lock, Zap } from 'lucide-react';
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
    userId?: string;
}

export function PaymentModal({ isOpen, onClose, courseTitle, coursePrice, courseId, userId }: PaymentModalProps) {
    useBodyScrollLock(isOpen);
    const { data: session } = useSession();
    const router = useRouter();
    const effectiveUserId = userId || session?.user?.id;

    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [initPoint, setInitPoint] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [initError, setInitError] = useState<string | null>(null);



    // Polling for Payment Status
    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (preferenceId && isOpen) {
            intervalId = setInterval(async () => {
                try {
                    const res = await fetch(`/api/payment/status?preferenceId=${preferenceId}&userId=${effectiveUserId}&courseId=${courseId}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.status === 'approved') {
                            clearInterval(intervalId);
                            router.push('/dashboard/courses'); // Redirect to success
                            onClose();
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
    }, [preferenceId, isOpen, router, onClose]);

    useEffect(() => {
        if (isOpen && !preferenceId) {
            // Create preference when modal opens
            const createPreference = async () => {
                setIsLoading(true);
                setInitError(null); // Reset error
                try {
                    const response = await fetch('/api/payment/create-preference', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            title: courseTitle,
                            price: coursePrice,
                            quantity: 1,
                            courseId: courseId,
                            userId: effectiveUserId
                        }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        setPreferenceId(data.id);
                        setInitPoint(data.init_point);
                    } else {
                        console.error('Error fetching preference:', data);
                        setInitError("Error creando orden de pago.");
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
    }, [isOpen, courseTitle, coursePrice, preferenceId, courseId, effectiveUserId]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#121620] w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-gray-800 flex flex-col md:flex-row relative">

                {/* Close Button (Absolute) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 text-gray-400 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition-all"
                >
                    <X size={20} />
                </button>

                {/* LEFT COLUMN: Order Summary (Darker/Card style) */}
                <div className="w-full md:w-5/12 bg-[#0d1017] p-8 flex flex-col border-r border-gray-800 relative overflow-hidden">

                    {/* Background blob for visual interest */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-primary/5 blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 flex-1">
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                            Tu Resumen
                        </h3>

                        <div className="mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                                {courseTitle}
                            </h2>
                            <div className="flex items-end gap-2 mt-4">
                                <span className="text-4xl font-bold text-white tracking-tight">{coursePrice}</span>
                                <span className="text-gray-500 font-medium mb-1.5">ARS</span>
                            </div>
                        </div>

                        {/* Features List */}
                        <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-3 text-gray-300">
                                <div className="bg-green-500/10 p-1 rounded-full mt-0.5">
                                    <Zap size={14} className="text-green-400" />
                                </div>
                                <span className="text-sm">Acceso inmediato y vitalicio al contenido.</span>
                            </div>
                            <div className="flex items-start gap-3 text-gray-300">
                                <div className="bg-green-500/10 p-1 rounded-full mt-0.5">
                                    <ShieldCheck size={14} className="text-green-400" />
                                </div>
                                <span className="text-sm">Garantía de satisfacción de 7 días.</span>
                            </div>
                            <div className="flex items-start gap-3 text-gray-300">
                                <div className="bg-green-500/10 p-1 rounded-full mt-0.5">
                                    <Lock size={14} className="text-green-400" />
                                </div>
                                <span className="text-sm">Pago encriptado y 100% seguro.</span>
                            </div>
                        </div>
                    </div>

                    {/* Trust Footer in Left Col */}
                    <div className="relative z-10 mt-auto pt-6 border-t border-gray-800/50">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>🛡️</span>
                            <span>Compra protegida por Mercado Pago</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Payment Actions */}
                <div className="w-full md:w-7/12 bg-[#121620] relative flex flex-col">

                    <div className="p-8 flex-1 overflow-y-auto max-h-[80vh] md:max-h-full">
                        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            Finalizar Compra
                        </h3>

                        {initError && (
                            <div className="mb-6 p-4 bg-red-900/10 border border-red-900/30 rounded-lg flex items-center gap-3 text-red-300 text-sm">
                                <X className="shrink-0 text-red-400" size={18} />
                                {initError}
                            </div>
                        )}

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-4"></div>
                                <p className="text-gray-400 animate-pulse text-sm">Conectando con Mercado Pago...</p>
                            </div>
                        ) : preferenceId ? (
                            <div className="space-y-6">

                                {/* Step 1 Button */}
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30">1</div>
                                        <h4 className="text-sm font-medium text-white">Ir a pagar</h4>
                                    </div>

                                    <a
                                        href={preferenceId ? initPoint! : "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`group relative w-full bg-[#009EE3] hover:bg-[#008ED6] text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 flex items-center justify-between overflow-hidden ${!preferenceId ? 'pointer-events-none opacity-50' : ''}`}
                                    >
                                        <div className="flex items-center gap-3 z-10">
                                            <div className="bg-black/10 p-2 rounded-lg">
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
                                        <div className="absolute top-0 -left-full w-1/2 h-full bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-[shimmer_2.5s_infinite]"></div>
                                    </a>
                                </div>

                                {/* Step 2 QR */}
                                <div className="hidden md:block">
                                    <div className="flex items-center gap-3 mb-3 mt-8">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 text-gray-400 text-xs font-bold border border-gray-700">2</div>
                                        <h4 className="text-sm font-medium text-gray-300">O escanea el código QR</h4>
                                    </div>

                                    <div className="bg-[#1a1f2e] rounded-xl p-4 border border-gray-800 flex items-start gap-6">
                                        <div className="bg-white p-2 rounded-lg shrink-0">
                                            <QRCode value={initPoint || ""} size={100} level="M" />
                                        </div>
                                        <div className="py-1">
                                            <p className="text-sm text-gray-300 mb-2 font-medium">Desde tu celular</p>
                                            <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
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
                    <div className="bg-[#0b0e14] py-4 px-8 border-t border-gray-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🇦🇷</span>
                            <span className="text-xs text-gray-500 font-medium">Precios en pesos argentinos.</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">Pagá con</span>
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
