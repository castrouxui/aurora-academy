"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Shield, Trash2, AlertTriangle, Info } from "lucide-react";
import { signOut } from "next-auth/react";
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
import { TelegramVerification } from "@/components/dashboard/TelegramVerification";
import { NotificationPreferences } from "@/components/dashboard/NotificationPreferences";

export default function SettingsPage() {
    const { data: session } = useSession();

    return (
        <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8 page-fade-in">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Configuración</h1>
                    <p className="text-gray-400">Gestiona tu perfil y preferencias de la cuenta.</p>
                </div>

                <div className="grid gap-6">
                    {/* Profile Information */}
                    <Card className="bg-[#1F2937] border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <User className="text-primary" />
                                Información Personal
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                Tus datos básicos de identificación.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Nombre Completo</Label>
                                    <div className="flex items-center gap-3 bg-[#121620] border border-gray-700 rounded-md px-4 py-2.5 text-white">
                                        <User className="h-4 w-4 text-gray-500 shrink-0" />
                                        <span className="text-sm">{session?.user?.name || "—"}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Correo Electrónico</Label>
                                    <div className="flex items-center gap-3 bg-[#121620] border border-gray-700 rounded-md px-4 py-2.5 text-white">
                                        <Mail className="h-4 w-4 text-gray-500 shrink-0" />
                                        <span className="text-sm">{session?.user?.email || "—"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <Info size={15} className="text-blue-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-300 leading-relaxed">
                                    Estos datos provienen de tu cuenta de Google y no se pueden editar aquí.{" "}
                                    <a
                                        href="https://myaccount.google.com/personal-info"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline font-medium hover:text-blue-200 transition-colors"
                                    >
                                        Editá tu perfil en Google
                                    </a>{" "}
                                    o{" "}
                                    <a
                                        href="mailto:soporte@auroraacademy.com"
                                        className="underline font-medium hover:text-blue-200 transition-colors"
                                    >
                                        contactá a soporte
                                    </a>.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security (Placeholder) */}
                    <Card className="bg-[#1F2937] border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Shield className="text-primary" />
                                Seguridad y Rol
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-[#121620] rounded-lg border border-gray-700">
                                <div>
                                    <p className="text-sm font-medium text-white">Rol Actual</p>
                                    <p className="text-xs text-gray-400">Tu nivel de acceso en la plataforma</p>
                                </div>
                                <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full border border-primary/20">
                                    {session?.user?.role || "ESTUDIANTE"}
                                </span>
                            </div>

                            <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
                                <p className="text-sm text-blue-300">
                                    Tu cuenta usa autenticación de Google. No se necesita contraseña local.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {session?.user?.role !== 'ADMIN' && (
                        <Card className="bg-[#1F2937] border-red-900/30 border-l-4 border-l-red-600">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Trash2 className="text-red-500" />
                                    Zona de Peligro
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white">Eliminar Cuenta</p>
                                    <p className="text-xs text-gray-400">Esta acción es permanente y no se puede deshacer.</p>
                                </div>
                                <DeleteAccountButton />
                            </CardContent>
                        </Card>
                    )}

                    {/* Notification Preferences */}
                    <NotificationPreferences
                        initialPrefs={session?.user?.notificationPrefs as any}
                    />

                    {session?.user?.role === 'ADMIN' && (
                        <Card className="bg-[#1F2937] border-gray-700 border-l-4 border-l-blue-500">
                            <CardHeader>
                                <CardTitle className="text-white">Panel de Administración</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white">Sincronización de Ventas</p>
                                    <p className="text-xs text-gray-400">Recuperar ventas perdidas de MercadoPago</p>
                                </div>
                                <AdminRecoveryButton />
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

function AdminRecoveryButton() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleRecover = async () => {
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch('/api/admin/recover', { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                setMessage(data.recovered > 0 ? `Se recuperaron ${data.recovered} ventas.` : "Todo está actualizado.");
            } else {
                setMessage("Error al sincronizar.");
            }
        } catch (e) {
            setMessage("Error de conexión.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            {message && <span className="text-xs text-blue-400">{message}</span>}
            <Button onClick={handleRecover} disabled={loading} size="sm" className="bg-blue-600 hover:bg-blue-700">
                {loading ? "..." : "Sincronizar"}
            </Button>
        </div>
    );
}

function DeleteAccountButton() {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/user/delete', { method: 'DELETE' });
            if (res.ok) {
                signOut({ callbackUrl: '/' });
            } else {
                alert("Error al eliminar la cuenta. Intente nuevamente.");
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
            setLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700 gap-2">
                    <Trash2 size={14} />
                    Eliminar
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#1F2937] border-gray-700 text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-red-500">
                        <AlertTriangle />
                        ¿Estás absolutamente seguro?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                        Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta y eliminará tus datos de nuestros servidores. Perderás acceso a todos tus cursos comprados.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-transparent border-gray-600 text-white hover:bg-gray-700">Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white border-0"
                    >
                        {loading ? "Eliminando..." : "Sí, eliminar mi cuenta"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
