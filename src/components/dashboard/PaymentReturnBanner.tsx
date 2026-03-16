"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckCircle, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface PaymentReturnBannerProps {
    onConfirmed: () => void;
}

type BannerStatus = 'idle' | 'checking' | 'confirmed' | 'syncing' | 'failed';

function PaymentReturnBannerInner({ onConfirmed }: PaymentReturnBannerProps) {
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const [status, setStatus] = useState<BannerStatus>('idle');

    // One-time payment params
    const paymentStatus = searchParams.get('status');
    const collectionStatus = searchParams.get('collection_status');
    const preferenceId = searchParams.get('preference_id');
    const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id');

    // Subscription params (PreApproval back_url sends ?preapproval_id=...)
    const preapprovalId = searchParams.get('preapproval_id');

    const isOneTimeReturn =
        (paymentStatus === 'approved' || collectionStatus === 'approved') &&
        (paymentId || preferenceId);

    const isSubscriptionReturn = !!preapprovalId;
    const isReturnFromMP = isOneTimeReturn || isSubscriptionReturn;

    // --- Layer 3: Auto-sync fallback when polling times out ---
    const runAutoSync = async (): Promise<boolean> => {
        try {
            setStatus('syncing');
            const res = await fetch('/api/user/sync-payments', { method: 'POST' });
            if (!res.ok) return false;
            const data = await res.json();
            if (data.synced > 0) {
                setStatus('confirmed');
                toast.success('¡Pago confirmado! Ya tenés acceso a tu contenido.');
                onConfirmed();
                return true;
            }
        } catch (e) {
            console.error('[PaymentReturnBanner] auto-sync error', e);
        }
        return false;
    };

    useEffect(() => {
        if (!isReturnFromMP || !session?.user?.id || status !== 'idle') return;

        setStatus('checking');

        let attempts = 0;
        const maxAttempts = 20; // 20 × 3s = 60s
        let timeoutId: ReturnType<typeof setTimeout>;

        const poll = async () => {
            attempts++;
            try {
                const params = new URLSearchParams();
                params.set('userId', session.user.id);

                if (isSubscriptionReturn && preapprovalId) {
                    // Layer 2: Poll for subscription authorization
                    params.set('preapprovalId', preapprovalId);
                } else if (preferenceId) {
                    // Layer 2: Poll for one-time payment approval
                    params.set('preferenceId', preferenceId);
                }

                const res = await fetch(`/api/payment/status?${params}`);
                const data = await res.json();

                if (data.status === 'approved') {
                    setStatus('confirmed');
                    toast.success('¡Pago confirmado! Ya tenés acceso a tu contenido.');
                    onConfirmed();
                    return;
                }
            } catch (e) {
                console.error('[PaymentReturnBanner] poll error', e);
            }

            if (attempts < maxAttempts) {
                timeoutId = setTimeout(poll, 3000);
            } else {
                // Layer 3: Polling exhausted → try auto-sync directly against MP API
                const syncOk = await runAutoSync();
                if (!syncOk) {
                    setStatus('failed');
                }
            }
        };

        // Wait 2s before first check to give the webhook a head start
        timeoutId = setTimeout(poll, 2000);
        return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isReturnFromMP, session?.user?.id]);

    if (!isReturnFromMP) return null;

    if (status === 'confirmed') {
        return (
            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-emerald-400">
                <CheckCircle size={20} className="shrink-0" />
                <p className="font-semibold">¡Pago confirmado! Tu contenido ya está disponible abajo.</p>
            </div>
        );
    }

    if (status === 'syncing') {
        return (
            <div className="flex items-center gap-3 bg-[#5D5CDE]/10 border border-[#5D5CDE]/20 rounded-xl p-4 text-[#5D5CDE]">
                <RefreshCw size={20} className="animate-spin shrink-0" />
                <p className="font-semibold">Verificando tu pago con Mercado Pago…</p>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-amber-400">
                <AlertCircle size={20} className="shrink-0" />
                <div className="flex-1">
                    <p className="font-semibold text-sm">
                        El pago puede estar procesándose. Si ya acreditó, hacé click en el botón para verificarlo.
                    </p>
                </div>
                {/* Layer 4: Manual sync button */}
                <Button
                    size="sm"
                    variant="outline"
                    className="border-amber-500/40 text-amber-400 hover:bg-amber-500/10 shrink-0 font-bold"
                    onClick={async () => {
                        const ok = await runAutoSync();
                        if (!ok) toast.error('No encontramos un pago aprobado todavía. Si el problema persiste, contactanos.');
                    }}
                >
                    <RefreshCw size={14} className="mr-2" />
                    Verificar mi compra
                </Button>
            </div>
        );
    }

    // status === 'idle' | 'checking'
    return (
        <div className="flex items-center gap-3 bg-[#5D5CDE]/10 border border-[#5D5CDE]/20 rounded-xl p-4 text-[#5D5CDE]">
            <Loader2 size={20} className="animate-spin shrink-0" />
            <p className="font-semibold">
                {isSubscriptionReturn
                    ? 'Activando tu suscripción, aguardá un momento…'
                    : 'Confirmando tu pago, aguardá un momento…'}
            </p>
        </div>
    );
}

export function PaymentReturnBanner(props: PaymentReturnBannerProps) {
    return (
        <Suspense fallback={null}>
            <PaymentReturnBannerInner {...props} />
        </Suspense>
    );
}
