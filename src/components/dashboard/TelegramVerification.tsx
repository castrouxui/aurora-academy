"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle2, AlertCircle, Loader2, SendHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export function TelegramVerification({ initialHandle, isVerified }: { initialHandle?: string | null, isVerified: boolean }) {
    const { update } = useSession();
    const [step, setStep] = useState<"enter-handle" | "enter-otp">(initialHandle && !isVerified ? "enter-otp" : "enter-handle");
    const [handle, setHandle] = useState(initialHandle || "");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(isVerified);

    const handleSendOTP = async () => {
        if (!handle) return toast.error("Ingresa tu usuario de Telegram");
        setLoading(true);
        try {
            const res = await fetch("/api/user/telegram/send-otp", {
                method: "POST",
                body: JSON.stringify({ telegramHandle: handle })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || "Código enviado a Telegram");
                setStep("enter-otp");
            } else {
                toast.error(data.error || "Error al enviar código");
            }
        } catch (e) {
            toast.error("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp) return toast.error("Ingresa el código");
        setLoading(true);
        try {
            const res = await fetch("/api/user/telegram/verify-otp", {
                method: "POST",
                body: JSON.stringify({ otp, telegramHandle: handle })
            });
            if (res.ok) {
                toast.success("¡Telegram verificado correctamente!");
                setVerified(true);
                setStep("enter-handle");
                await update(); // Update session
            } else {
                const data = await res.json();
                toast.error(data.error || "Código incorrecto");
            }
        } catch (e) {
            toast.error("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    if (verified) {
        return (
            <div className="flex items-center justify-between p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <CheckCircle2 className="text-emerald-500" size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Vínculo con Telegram Activo</p>
                        <p className="text-xs text-emerald-500/80">@{handle}</p>
                    </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full">Verificado</span>
            </div>
        );
    }

    return (
        <div className="space-y-4 p-5 bg-[#121620] rounded-xl border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
                <Send size={18} className="text-[#0088cc]" />
                <h4 className="text-sm font-bold text-white">Vincular con Telegram</h4>
            </div>

            {step === "enter-handle" ? (
                <div className="space-y-3">
                    <p className="text-xs text-gray-400">
                        Ingresa tu nombre de usuario para recibir un código de seguridad.
                        Asegúrate de haber iniciado una conversación con nuestro bot <a href="https://t.me/AuroraAcademyBot" target="_blank" className="text-primary hover:underline">@AuroraAcademyBot</a>.
                    </p>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-2.5 text-gray-500 text-sm font-bold">@</span>
                            <Input
                                placeholder="usuario_telegram"
                                value={handle}
                                onChange={(e) => setHandle(e.target.value)}
                                className="bg-black/20 border-gray-600 pl-7 text-white"
                            />
                        </div>
                        <Button
                            onClick={handleSendOTP}
                            disabled={loading || !handle}
                            className="bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold"
                        >
                            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Enviar Código"}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <p className="text-xs text-gray-400 italic">
                        Hemos enviado un código a <b>@{handle}</b>. Ingresalo debajo:
                    </p>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Ej: 123456"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="bg-black/20 border-gray-600 text-center text-lg tracking-[0.3em] font-bold text-white"
                            maxLength={6}
                        />
                        <Button
                            onClick={handleVerifyOTP}
                            disabled={loading || otp.length < 6}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6"
                        >
                            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Verificar"}
                        </Button>
                    </div>
                    <button
                        onClick={() => setStep("enter-handle")}
                        className="text-[10px] text-gray-500 hover:text-white uppercase font-bold tracking-wider"
                    >
                        Cambiar Usuario
                    </button>
                </div>
            )}
        </div>
    );
}
