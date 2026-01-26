"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Shield, Trash2, AlertTriangle } from "lucide-react";
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

export default function SettingsPage() {
    const { data: session } = useSession();

    return (
        <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8">
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
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                        <Input
                                            defaultValue={session?.user?.name || ""}
                                            className="bg-[#121620] border-gray-600 pl-10 text-white"
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Correo Electrónico</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                        <Input
                                            defaultValue={session?.user?.email || ""}
                                            className="bg-[#121620] border-gray-600 pl-10 text-white"
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-2">
                                <p className="text-xs text-yellow-500/80">
                                    * Para cambiar estos datos, contacta a soporte o edítalos en tu proveedor de identidad (Google).
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

                            <div className="flex items-center justify-between p-4 bg-[#121620] rounded-lg border border-gray-700 opacity-50 cursor-not-allowed">
                                <div>
                                    <p className="text-sm font-medium text-white">Cambiar Contraseña</p>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Próximamente disponible</p>
                                </div>
                                <Button variant="outline" size="sm" disabled className="border-gray-600 text-gray-400">
                                    <Lock size={14} className="mr-2" />
                                    Actualizar
                                </Button>
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
