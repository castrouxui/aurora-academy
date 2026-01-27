"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface NotificationPrefs {
    telegram: boolean;
    inApp: boolean;
}

export function NotificationPreferences({ initialPrefs }: { initialPrefs?: NotificationPrefs }) {
    const { update } = useSession();
    const [prefs, setPrefs] = useState<NotificationPrefs>(initialPrefs || { telegram: true, inApp: true });
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/notifications/prefs", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(prefs),
            });

            if (res.ok) {
                toast.success("Preferencias guardadas");
                await update({ notificationPrefs: prefs });
            } else {
                toast.error("Error al guardar preferencias");
            }
        } catch (error) {
            toast.error("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-[#1F2937] border-gray-700">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Bell className="text-primary" />
                    Preferencias de Notificación
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Elegí cómo querés recibir las novedades de Aurora Academy.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#121620] rounded-xl border border-gray-700 hover:border-primary/50 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#0088cc]/10 rounded-lg text-[#0088cc]">
                                <Send size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">Notificaciones por Telegram</p>
                                <p className="text-xs text-gray-500">Recibí avisos directos en tu chat de Telegram.</p>
                            </div>
                        </div>
                        <Checkbox
                            checked={prefs.telegram}
                            onChange={(e: any) => setPrefs({ ...prefs, telegram: e.target.checked })}
                            className="border-gray-600 data-[state=checked]:bg-primary"
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#121620] rounded-xl border border-gray-700 hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Bell size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">Notificaciones en la Web</p>
                                <p className="text-xs text-gray-500">Mirá los avisos en la campanita de la plataforma.</p>
                            </div>
                        </div>
                        <Checkbox
                            checked={prefs.inApp}
                            onChange={(e: any) => setPrefs({ ...prefs, inApp: e.target.checked })}
                            className="border-gray-600 data-[state=checked]:bg-primary"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 text-white font-bold px-8 rounded-xl h-11"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : "Guardar Cambios"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
