"use client";

import { useEffect, useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { X, Wallet as WalletIcon } from 'lucide-react';
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

    useEffect(() => {
        // Initialize once
        const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
        if (publicKey) {
            try {
                initMercadoPago(publicKey, { locale: 'es-AR' });
            } catch (err) {
                console.error("MP Init Error:", err);
                setInitError("Error inicializando pagos.");
            }
        } else {
            console.error("Missing NEXT_PUBLIC_MP_PUBLIC_KEY");
            setInitError("Falta configuración de clave pública (Render Env Var).");
        }
    }, []);

    // Polling for Payment Status
    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (preferenceId && isOpen) {
            intervalId = setInterval(async () => {
                try {
                    const res = await fetch(`/api/payment/status?preferenceId=${preferenceId}`);
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
    }, [isOpen, courseTitle, coursePrice, preferenceId]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-[#121620] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-[#1a1f2e]">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/20 p-2 rounded-lg">
                            <WalletIcon className="w-6 h-6 text-primary" />
                            {/* Note: Wallet icon from lucide-react might collide with Wallet brick from MP. 
                                I will import CreditCard from lucide instead to avoid name clash or rename import. 
                                Checking imports... Wallet is from MP. I'll use a text header for now or simple SVG.
                             */}
                            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white">Finalizar Compra</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row">
                    {/* Left Col: Order Summary (on desktop) or Top (mobile) */}
                    <div className="w-full md:w-5/12 bg-[#1a1f2e]/50 p-6 border-b md:border-b-0 md:border-r border-gray-800 flex flex-col justify-center">
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Tu Pedido</p>

                        <div className="bg-[#1F2937] p-4 rounded-xl border border-gray-700 shadow-sm mb-6">
                            <h4 className="font-bold text-white text-lg leading-tight mb-2">{courseTitle}</h4>
                            <div className="flex items-baseline gap-1 mt-3">
                                <span className="text-2xl font-bold text-primary">{coursePrice}</span>
                                <span className="text-xs text-gray-500">final</span>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <span className="text-green-400">✓</span> Acceso inmediato
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-400">✓</span> Garantía de 48hs
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-400">✓</span> Pago seguro SSL
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Payment Actions */}
                    <div className="w-full md:w-7/12 p-6 md:p-8 bg-[#121620]">
                        {initError && (
                            <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-3 text-red-200 text-sm">
                                <X className="shrink-0 text-red-400" size={18} />
                                {initError}
                            </div>
                        )}

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                                <p className="text-gray-400 animate-pulse">Generando orden de pago...</p>
                            </div>
                        ) : preferenceId ? (
                            <div className="space-y-8">
                                {/* Option 1: Main Button */}
                                <div>
                                    <p className="text-sm text-white font-medium mb-3 flex items-center gap-2">
                                        <span className="bg-gray-700 text-xs w-5 h-5 rounded-full flex items-center justify-center">1</span>
                                        Pagar con Mercado Pago
                                    </p>
                                    <div className="wallet-container relative z-10">
                                        <Wallet
                                            initialization={{ preferenceId: preferenceId }}
                                            onError={(error) => {
                                                console.error("Wallet Error:", error);
                                                setInitError("Error cargando botón de pago.");
                                            }}
                                            // @ts-ignore
                                            customization={{ visual: { theme: 'dark', valuePropColor: 'white', buttonHeight: 48, borderRadius: 10 } }}
                                        />
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="relative flex items-center py-2">
                                    <div className="flex-grow border-t border-gray-800"></div>
                                    <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase">O escanea el QR</span>
                                    <div className="flex-grow border-t border-gray-800"></div>
                                </div>

                                {/* Option 2: QR */}
                                <div className="flex flex-col items-center bg-[#1a1f2e] p-4 rounded-xl border border-gray-800/50">
                                    <p className="text-xs text-gray-400 mb-3 text-center">Escanea con tu App de Mercado Pago</p>
                                    <div className="bg-white p-3 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
                                        <QRCode value={initPoint || ""} size={140} level="M" />
                                    </div>
                                    {/* Pulse Indicator */}
                                    <div className="mt-4 flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                        </span>
                                        <span className="text-[10px] font-medium text-blue-300 uppercase tracking-widest">Esperando pago</span>
                                    </div>
                                </div>
                            </div>
                        ) : !initError && (
                            <div className="text-center text-gray-500 py-12">
                                Iniciando transacción segura...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
