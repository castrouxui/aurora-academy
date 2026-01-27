"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Send, Users, MessageSquare, Loader2, CheckCircle2, History, Eye, Pencil, Eraser } from "lucide-react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function TelegramBroadcastPage() {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState<{ sent: number; total: number } | null>(null);
    const [verifiedCount, setVerifiedCount] = useState<number | null>(null);
    const [previewMode, setPreviewMode] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/admin/telegram/broadcast");
            if (res.ok) {
                const data = await res.json();
                setVerifiedCount(data.count);
            }
        } catch (error) {
            console.error("Failed to fetch stats", error);
        }
    };

    const handleSend = async () => {
        if (!message.trim()) {
            toast.error("Por favor escribí un mensaje");
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
                setPreviewMode(false);
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

    const insertTag = (tag: string) => {
        setMessage((prev) => prev + tag);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-20">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white">Telegram Broadcast</h1>
                <p className="text-gray-400">Envía mensajes directos a todos los usuarios que vincularon su cuenta.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Composer */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-[#1F2937]/50 border-gray-800 h-full flex flex-col">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-white flex items-center gap-2">
                                    <MessageSquare size={20} className="text-[#5D5CDE]" />
                                    <span>Nuevo Mensaje</span>
                                </CardTitle>
                                <div className="flex bg-[#0b0e14] p-1 rounded-lg border border-gray-800">
                                    <button
                                        onClick={() => setPreviewMode(false)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${!previewMode ? "bg-[#5D5CDE] text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                                    >
                                        <Pencil size={12} /> Editar
                                    </button>
                                    <button
                                        onClick={() => setPreviewMode(true)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${previewMode ? "bg-[#5D5CDE] text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
                                    >
                                        <Eye size={12} /> Vista Previa
                                    </button>
                                </div>
                            </div>
                            <CardDescription className="text-gray-400">
                                Escribe tu mensaje utilizando formato HTML básico.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col gap-4">
                            {previewMode ? (
                                <div className="flex-1 bg-[#0b0e14] border border-gray-700/50 rounded-xl p-6 min-h-[300px]">
                                    <div className="prose prose-invert prose-sm max-w-none">
                                        {message ? (
                                            <div dangerouslySetInnerHTML={{ __html: message.replace(/\n/g, "<br/>") }} />
                                        ) : (
                                            <p className="text-gray-600 italic">La vista previa aparecerá aquí...</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <Textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Hola traders! 👋 Los esperamos en la sesión en vivo..."
                                    className="flex-1 min-h-[300px] bg-[#0b0e14] border-gray-700 focus:border-[#5D5CDE] focus:ring-[#5D5CDE]/20 text-gray-300 rounded-xl p-4 leading-relaxed resize-none font-mono text-sm"
                                />
                            )}

                            <div className="flex items-center justify-between pt-2">
                                <div className="text-xs text-gray-500 font-mono">
                                    {message.length} caracteres
                                </div>
                                <div className="flex gap-3">
                                    {message.length > 0 && (
                                        <Button
                                            variant="ghost"
                                            onClick={() => setMessage("")}
                                            className="text-gray-400 hover:text-red-400 hover:bg-red-400/10"
                                        >
                                            <Eraser size={16} className="mr-2" />
                                            Borrar
                                        </Button>
                                    )}

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                disabled={isLoading || !message.trim()}
                                                className="bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white px-6 h-10 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-[#5D5CDE]/20 transition-all hover:translate-y-[-1px]"
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
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="bg-[#1F2937] border-gray-700 text-white">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                <AlertDialogDescription className="text-gray-400">
                                                    Estás a punto de enviar este mensaje a <b>{verifiedCount ?? "..."} usuarios</b>. Esta acción no se puede deshacer.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="bg-transparent border-gray-600 text-white hover:bg-gray-700">Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleSend} className="bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white border-0">
                                                    Sí, enviar mensaje
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {stats && (
                        <div className="p-1 bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 rounded-2xl border border-emerald-500/20">
                            <div className="bg-[#1F2937]/90 backdrop-blur-sm p-6 rounded-xl flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">¡Difusión Completada!</h3>
                                    <p className="text-gray-400">
                                        El mensaje ha sido entregado exitosamente a <strong className="text-emerald-400">{stats.sent}</strong> de <strong className="text-white">{stats.total}</strong> usuarios verificados.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar / Stats */}
                <div className="space-y-6">
                    {/* Audience Card */}
                    <Card className="bg-[#1F2937]/50 border-gray-800 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Users size={80} />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-gray-400 text-xs uppercase tracking-wider font-bold flex items-center gap-2">
                                <Users size={14} /> Resumen de Audiencia
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mt-2">
                                <span className="text-4xl font-black text-white tracking-tight">
                                    {verifiedCount !== null ? verifiedCount : <Skeleton className="h-10 w-20 inline-block bg-gray-700" />}
                                </span>
                                <p className="text-sm text-gray-500 mt-1">Usuarios verificados listos para recibir mensajes</p>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-800">
                                <div className="flex items-center gap-2 text-xs text-[#5D5CDE]">
                                    <div className="h-2 w-2 rounded-full bg-[#5D5CDE] animate-pulse"></div>
                                    Estado del servicio: <b>Operativo</b>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Formatting Card */}
                    <Card className="bg-[#1F2937]/50 border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                                <History size={16} />
                                Tips de Formato
                            </CardTitle>
                            <CardDescription className="text-gray-400 text-xs">
                                Hacé click para insertar
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-400 space-y-3">
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { label: "Negrita", tag: "<b></b>" },
                                    { label: "Itálica", tag: "<i></i>" },
                                    { label: "Link", tag: "<a href='URL'>Texto</a>" },
                                    { label: "Código", tag: "<code></code>" },
                                    { label: "Spoiler", tag: "<tg-spoiler></tg-spoiler>" },
                                    { label: "Nueva Línea", tag: "\n" },
                                ].map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={() => insertTag(item.tag)}
                                        className="flex items-center justify-between bg-[#0b0e14] p-3 rounded-lg border border-gray-800 hover:border-[#5D5CDE]/50 hover:bg-[#5D5CDE]/5 transition-all text-left group"
                                    >
                                        <span className="text-xs font-medium text-gray-300 group-hover:text-white">{item.label}</span>
                                        <code className="text-[10px] bg-black/50 px-1.5 py-0.5 rounded text-gray-500 font-mono group-hover:text-[#5D5CDE]">
                                            {item.tag}
                                        </code>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
