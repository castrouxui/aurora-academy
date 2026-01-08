"use client";

import { useEffect, useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { X } from 'lucide-react';

// Initialize MP with Public Key
// Note: This needs NEXT_PUBLIC_MP_PUBLIC_KEY in .env.local
// We handle safe initialization inside the component or a global provider.
// For now, simpler to do it here, but ensuring we have the key.

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseTitle: string;
    coursePrice: string; // "$40.000"
}

export function PaymentModal({ isOpen, onClose, courseTitle, coursePrice }: PaymentModalProps) {
    const [initError, setInitError] = useState<string | null>(null);

    useEffect(() => {
        // Initialize once
        const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
        if (publicKey) {
            try {
                initMercadoPago(publicKey, { locale: 'es-AR' });
                console.log("MP Initialized with key:", publicKey.substring(0, 10) + "...");
            } catch (err) {
                console.error("MP Init Error:", err);
                setInitError("Error inicializando pagos.");
            }
        } else {
            console.error("Missing NEXT_PUBLIC_MP_PUBLIC_KEY");
            setInitError("Falta configuración de clave pública (Render Env Var).");
        }
    }, []);

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
                        }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        setPreferenceId(data.id);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-[#1F2937] border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h3 className="text-lg font-bold text-white">Finalizar Compra</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-sm text-gray-400 mb-1">Vas a comprar:</p>
                        <p className="font-bold text-white text-lg">{courseTitle}</p>
                        <p className="text-primary font-bold mt-1">{coursePrice}</p>
                    </div>

                    {initError && (
                        <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded text-red-200 text-sm">
                            ⚠️ {initError}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : preferenceId ? (
                        <div className="wallet-container min-h-[150px]">
                            <Wallet
                                initialization={{ preferenceId: preferenceId, redirectMode: 'modal' }}
                                onError={(error) => {
                                    console.error("Wallet Error:", error);
                                    setInitError("Error cargando botón de pago (Wallet Brick).");
                                }}
                                // @ts-ignore
                                customization={{ visual: { theme: 'dark', valuePropColor: 'white' } }}
                            />
                        </div>
                    ) : !initError && (
                        <div className="text-center text-gray-500 py-4">
                            Preparando pago...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
