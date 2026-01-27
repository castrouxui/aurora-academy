"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Send, Users, MessageSquare, Loader2, CheckCircle2, History } from "lucide-react";
import { toast } from "sonner";

export default function TelegramBroadcastPage() {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState<{ sent: number; total: number } | null>(null);

    const handleSend = async () => {
        if (!message.trim()) {
            toast.error("Por favor escribí un mensaje");
            return;
        }

        if (!confirm("¿Estás seguro de que querés enviar este mensaje a todos los usuarios verificados?")) {
            return;
        }

        setIsLoading(true);
        setStats(null);
        try {
            const res = await fetch("/api/admin/telegram/broadcast", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: message.trim() }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Mensaje enviado correctamente");
                setStats({ sent: data.sent, total: data.total });
                setMessage("");
            } else {
                toast.error(data.error || "Error al enviar el mensaje");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error de conexión");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Telegram Broadcast</h1>
                <p className="text-gray-400">Envía mensajes directos a todos los usuarios que vincularon su cuenta.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Composer */}
                <div className="lg:col-span-2">
                    <Card className="bg-[#1F2937]/50 border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <MessageSquare size={20} className="text-primary" />
                                Nuevo Mensaje
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                Los mensajes soportan formato HTML básico según las reglas de Telegram.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Hola traders! 👋 Los esperamos en la sesión en vivo..."
                                className="min-h-[200px] bg-[#0b0e14] border-gray-700 focus:border-primary text-gray-300 rounded-xl p-4 leading-relaxed resize-none"
                            />

                            <div className="flex justify-end">
                                <Button
                                    onClick={handleSend}
                                    disabled={isLoading || !message.trim()}
                                    className="bg-primary hover:bg-primary/90 text-white px-8 h-12 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            Enviar Difusión
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {stats && (
                        <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-in slide-in-from-top duration-300">
                            <div className="flex items-center gap-3 text-emerald-500">
                                <CheckCircle2 size={24} />
                                <div>
                                    <p className="font-bold">¡Difusión exitosa!</p>
                                    <p className="text-sm opacity-80">El mensaje se envió a {stats.sent} de {stats.total} usuarios verificados.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar / Stats */}
                <div className="space-y-6">
                    <Card className="bg-[#1F2937]/50 border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-white text-sm uppercase tracking-wider font-bold">Resumen de Audiencia</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                        <Users size={20} />
                                    </div>
                                    <span className="text-gray-400 font-medium">Usuarios Vinculados</span>
                                </div>
                                <span className="text-xl font-black text-white">Auditoría Requerida...</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#1F2937]/50 border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <History size={18} />
                                Tips de Formato
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-400 space-y-3">
                            <p>Podés usar los siguientes tags:</p>
                            <ul className="space-y-2 font-mono text-xs">
                                <li className="bg-black/30 p-2 rounded">{"<b>Negrita</b>"}</li>
                                <li className="bg-black/30 p-2 rounded">{"<i>Itálica</i>"}</li>
                                <li className="bg-black/30 p-2 rounded">{'<a href="URL">Link</a>'}</li>
                                <li className="bg-black/30 p-2 rounded">{"<code>Código</code>"}</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
