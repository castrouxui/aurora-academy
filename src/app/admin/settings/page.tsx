"use client";

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
        </div>
    );
}
