"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Removed Import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Plus, Save, X } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Expense {
    id: string;
    label: string;
    amount: number;
    date: string;
}

interface ExpenseTableProps {
    startDate: Date;
    endDate: Date;
    onUpdate: () => void;
}

export function ExpenseTable({ startDate, endDate, onUpdate }: ExpenseTableProps) {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // New Expense State
    const [newExpenseLabel, setNewExpenseLabel] = useState("");
    const [newExpenseAmount, setNewExpenseAmount] = useState("");
    const [newExpenseDate, setNewExpenseDate] = useState(""); // Add separate date input logic if needed, or default to today?

    // Edit State
    const [editLabel, setEditLabel] = useState("");
    const [editAmount, setEditAmount] = useState("");

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            });

            const res = await fetch(`/api/financial/expenses?${params.toString()}`);
            if (!res.ok) throw new Error("Failed");
            const data = await res.json();
            setExpenses(data);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar gastos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [startDate.toISOString(), endDate.toISOString()]);

    const handleAdd = async () => {
        if (!newExpenseLabel || !newExpenseAmount) return;
        try {
            // Default date: If today is within range, use today. 
            // If range is in past, use end of range. 
            // If range is in future... use start?
            // Simplification: Use today if within range, otherwise use startDate.
            const now = new Date();
            let dateToUse = now;
            if (now < startDate || now > endDate) {
                dateToUse = startDate;
            }
            // Better UX: Allow user to pick date, but for now let's stick to simple adding.
            // Or maybe just use the state variable if I added a date picker.
            // Let's use `dateToUse` for now.

            const res = await fetch("/api/financial/expenses", {
                method: "POST",
                body: JSON.stringify({
                    label: newExpenseLabel,
                    amount: newExpenseAmount,
                    date: dateToUse.toISOString(),
                }),
            });
            if (!res.ok) throw new Error("Failed");
            setNewExpenseLabel("");
            setNewExpenseAmount("");
            fetchExpenses();
            onUpdate();
            toast.success("Gasto agregado");
        } catch (e) {
            toast.error("Error al crear gasto");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Seguro que deseas eliminar este gasto?")) return;
        try {
            const res = await fetch(`/api/financial/expenses/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed");
            fetchExpenses();
            onUpdate();
            toast.success("Gasto eliminado");
        } catch (e) {
            toast.error("Error al eliminar");
        }
    };

    const startEdit = (expense: Expense) => {
        setEditingId(expense.id);
        setEditLabel(expense.label);
        setEditAmount(expense.amount.toString());
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const saveEdit = async (id: string) => {
        try {
            const res = await fetch(`/api/financial/expenses/${id}`, {
                method: "PUT",
                body: JSON.stringify({
                    label: editLabel,
                    amount: editAmount,
                }),
            });
            if (!res.ok) throw new Error("Failed");
            setEditingId(null);
            fetchExpenses();
            onUpdate();
            toast.success("Gasto actualizado");
        } catch (e) {
            toast.error("Error al actualizar");
        }
    };

    return (
        <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Gestión de Gastos</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Add New Expense Form */}
                <div className="flex gap-2 mb-4 items-end">
                    <div className="grid gap-1 flex-1">
                        <label className="text-xs text-muted-foreground">Concepto</label>
                        <Input
                            placeholder="Ej. Hosting, Publicidad..."
                            value={newExpenseLabel}
                            onChange={(e) => setNewExpenseLabel(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-1 w-32">
                        <label className="text-xs text-muted-foreground">Monto</label>
                        <Input
                            type="number"
                            placeholder="0.00"
                            value={newExpenseAmount}
                            onChange={(e) => setNewExpenseAmount(e.target.value)}
                        />
                    </div>
                    {/* Optional: Date Picker could go here */}
                    <Button onClick={handleAdd} disabled={!newExpenseLabel || !newExpenseAmount}>
                        <Plus className="h-4 w-4 mr-2" /> Agregar
                    </Button>
                </div>

                {/* Table */}
                <div className="rounded-md border">
                    {/* Standard HTML Table */}
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium">
                            <tr>
                                <th className="p-3">Concepto</th>
                                <th className="p-3">Fecha</th>
                                <th className="p-3 text-right">Monto</th>
                                <th className="p-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {expenses.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-muted-foreground">
                                        No hay gastos registrados en este periodo.
                                    </td>
                                </tr>
                            ) : (
                                expenses.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-muted/10">
                                        <td className="p-3">
                                            {editingId === expense.id ? (
                                                <Input
                                                    value={editLabel}
                                                    onChange={(e) => setEditLabel(e.target.value)}
                                                    className="h-8"
                                                />
                                            ) : (
                                                expense.label
                                            )}
                                        </td>
                                        <td className="p-3 text-muted-foreground text-xs">
                                            {new Date(expense.date).toLocaleDateString()}
                                        </td>
                                        <td className="p-3 text-right font-medium">
                                            {editingId === expense.id ? (
                                                <Input
                                                    type="number"
                                                    value={editAmount}
                                                    onChange={(e) => setEditAmount(e.target.value)}
                                                    className="h-8 w-24 ml-auto"
                                                />
                                            ) : (
                                                new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(expense.amount)
                                            )}
                                        </td>
                                        <td className="p-3 text-right flex justify-end gap-2">
                                            {editingId === expense.id ? (
                                                <>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={() => saveEdit(expense.id)}>
                                                        <Save className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={cancelEdit}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => startEdit(expense)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(expense.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
