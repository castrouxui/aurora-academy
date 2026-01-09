"use client";

import { QRCodeSVG as QRCode } from 'qrcode.react';
import { useRouter } from 'next/navigation';

export function PaymentModal({ isOpen, onClose, courseTitle, coursePrice, courseId, userId }: PaymentModalProps) {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-[#1F2937] border border-gray-700 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
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
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Desktop: QR Code option */}
                            <div className="hidden md:flex flex-col items-center justify-center w-1/3 pt-2">
                                <div className="bg-white p-2 rounded-lg shadow-md mb-3">
                                    <QRCode value={initPoint || ""} size={120} />
                                </div>
                                <p className="text-xs text-center text-gray-400 max-w-[140px]">
                                    Escanea para pagar desde tu celular
                                </p>
                                <p className="text-[10px] text-gray-500 mt-1 animate-pulse">
                                    Esperando confirmación...
                                </p>
                            </div>

                            {/* Wallet Wrapper */}
                            <div className="flex-1 w-full relative">
                                {/* Vertical Separator for desktop */}
                                <div className="hidden md:block absolute -left-4 top-0 bottom-0 w-[1px] bg-gray-700"></div>

                                <Wallet
                                    initialization={{ preferenceId: preferenceId }}
                                    onError={(error) => {
                                        console.error("Wallet Error:", error);
                                        setInitError("Error cargando botón de pago (Wallet Brick).");
                                    }}
                                    // @ts-ignore
                                    customization={{ visual: { theme: 'dark', valuePropColor: 'white' } }}
                                />
                            </div>
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
