"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Configuración del Sistema</h1>

            <Card className="bg-[#1F2937] border-gray-700">
                <CardHeader>
                    <CardTitle className="text-white">Información de la Plataforma</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="siteName" className="text-gray-300">Nombre del Sitio</Label>
                        <Input id="siteName" defaultValue="Aurora Academy" className="bg-[#111827] border-gray-600 text-white" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="supportEmail" className="text-gray-300">Email de Soporte</Label>
                        <Input id="supportEmail" defaultValue="soporte@aurora.com" className="bg-[#111827] border-gray-600 text-white" />
                    </div>
                    <Button className="bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white">
                        Guardar Cambios
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-[#1F2937] border-gray-700">
                <CardHeader>
                    <CardTitle className="text-white">Configuración de Pagos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="mpKey" className="text-gray-300">Mercado Pago Public Key</Label>
                        <Input id="mpKey" type="password" value="************************" disabled className="bg-[#111827] border-gray-600 text-gray-500" />
                        <p className="text-xs text-gray-500">Gestionado vía variables de entorno (env).</p>
                    </div>
                </CardContent>
            </Card>

            <AdminRecoveryCard />
        </div>
    );
}

function AdminRecoveryCard() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<null | { recovered: number, message: string }>(null);

    const handleRecover = async () => {
        setLoading(true);
        setResult(null);
        try {
            const res = await fetch('/api/admin/recover', { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                setResult({
                    recovered: data.recovered,
                    message: data.recovered > 0
                        ? `¡Éxito! Se recuperaron ${data.recovered} ventas.`
                        : "No se encontraron nuevas ventas para recuperar."
                });
            } else {
                setResult({ recovered: 0, message: `Error: ${data.error || 'Desconocido'}` });
            }
        } catch (error) {
            setResult({ recovered: 0, message: "Error de conexión." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-[#1F2937] border-gray-700 border-l-4 border-l-blue-500">
            <CardHeader>
                <CardTitle className="text-white">Recuperación de Datos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-gray-400">
                    Si ves inconsistencias en las ventas (ej: en MercadoPago están aprobadas pero no aquí),
                    ejecuta esta herramienta para sincronizar la base de datos.
                </p>
                <div className="flex items-center gap-4">
                    <Button
                        onClick={handleRecover}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {loading ? "Sincronizando..." : "Sincronizar Ventas con MercadoPago"}
                    </Button>
                    {result && (
                        <span className={`text-sm font-medium ${result.message.includes("Error") ? "text-red-400" : "text-green-400"}`}>
                            {result.message}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
