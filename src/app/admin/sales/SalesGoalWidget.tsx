"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flag, Loader2, Calendar as CalendarIcon, Target, TrendingUp, Pencil } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface SalesGoal {
    id: string;
    targetAmount: number;
    currentAmount: number; // Returned by API
    deadline: string;
    startDate: string;
}

export function SalesGoalWidget() {
    const [goal, setGoal] = useState<SalesGoal | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form state
    const [targetAmount, setTargetAmount] = useState<string>("");
    const [deadline, setDeadline] = useState<string>("");
    const [saving, setSaving] = useState(false);

    const fetchGoal = async () => {
        try {
            const res = await fetch("/api/admin/sales-goal");
            if (res.ok) {
                const data = await res.json();
                setGoal({
                    ...data,
                    targetAmount: Number(data.targetAmount),
                    currentAmount: Number(data.currentAmount)
                });
                // Init form
                setTargetAmount(data.targetAmount);
                setDeadline(new Date(data.deadline).toISOString().split('T')[0]);
            }
        } catch (error) {
            console.error("Failed to fetch goal", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/sales-goal", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    targetAmount: Number(targetAmount),
                    deadline: new Date(deadline).toISOString()
                })
            });

            if (res.ok) {
                toast.success("Objetivo actualizado");
                setIsDialogOpen(false);
                fetchGoal();
            } else {
                toast.error("Error al actualizar");
            }
        } catch (error) {
            toast.error("Error de conexión");
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        fetchGoal();
        const interval = setInterval(fetchGoal, 60000); // Auto-update every minute
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="h-40 bg-[#1F2937] rounded-xl animate-pulse" />;
    if (!goal) return null;

    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
    const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
    const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(val);

    return (
        <Card className="bg-gradient-to-br from-[#1F2937] to-[#111827] border-gray-700 overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Target size={120} />
            </div>

            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                    <Flag className="text-[#5D5CDE] h-5 w-5" />
                    Objetivo de Facturación
                </CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10">
                            <Pencil size={14} className="mr-1" /> Editar
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1F2937] border-gray-700 text-white">
                        <DialogHeader>
                            <DialogTitle>Editar Objetivo</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Monto Objetivo</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-400">$</span>
                                    <Input
                                        type="number"
                                        value={targetAmount}
                                        onChange={e => setTargetAmount(e.target.value)}
                                        className="pl-7 bg-black/30 border-gray-600"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Fecha Límite</Label>
                                <Input
                                    type="date"
                                    value={deadline}
                                    onChange={e => setDeadline(e.target.value)}
                                    className="bg-black/30 border-gray-600"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            <Button onClick={handleSave} disabled={saving} className="bg-[#5D5CDE] text-white hover:bg-[#4b4ac0]">
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Guardar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <span className="text-3xl font-bold text-white block">
                                    {formatCurrency(goal.currentAmount)}
                                </span>
                                <span className="text-xs text-gray-400">
                                    de {formatCurrency(goal.targetAmount)}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className={`text-xl font-bold ${progress >= 100 ? 'text-emerald-400' : 'text-[#5D5CDE]'}`}>
                                    {progress.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                        <Progress value={progress} className="h-3 bg-gray-800" indicatorClassName={progress >= 100 ? "bg-emerald-500" : "bg-[#5D5CDE]"} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="bg-gray-800 p-2 rounded-lg">
                                <TrendingUp size={16} className="text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Falta</p>
                                <p className="text-sm font-medium text-gray-300">{formatCurrency(remaining)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-gray-800 p-2 rounded-lg">
                                <CalendarIcon size={16} className="text-orange-400" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Cierre</p>
                                <p className="text-sm font-medium text-gray-300">
                                    {format(new Date(goal.deadline), "dd 'de' MMM, yyyy", { locale: es })}
                                    <span className="text-xs text-gray-500 ml-1">
                                        ({daysLeft > 0 ? `${daysLeft} días` : 'Vencido'})
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
