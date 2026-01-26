"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2, Tag, Calendar, Percent, Hash } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";

interface Coupon {
    id: string;
    code: string;
    discount: number;
    type: string;
    active: boolean;
    expiresAt: string | null;
    limit: number | null;
    used: number;
    createdAt: string;
}

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [code, setCode] = useState("");
    const [discount, setDiscount] = useState("");
    const [limit, setLimit] = useState("");
    const [expiresAt, setExpiresAt] = useState("");

    const fetchCoupons = async () => {
        try {
            const res = await fetch("/api/coupons");
            const data = await res.json();
            setCoupons(data);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar cupones");
        } finally {
            setIsLoading(false);
        }
    };


    // Usage Modal State
    const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
    const [usageLoading, setUsageLoading] = useState(false);
    const [usageStats, setUsageStats] = useState<any[]>([]);
    const [selectedCouponCode, setSelectedCouponCode] = useState("");

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este cupón? Esta acción no se puede deshacer.")) return;

        try {
            const res = await fetch(`/api/coupons?id=${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            toast.success("Cupón eliminado");
            fetchCoupons();
        } catch (error) {
            console.error(error);
            toast.error("Error al eliminar (quizás ya tiene usos)");
        }
    };

    const handleViewUsage = async (coupon: Coupon) => {
        setSelectedCouponCode(coupon.code);
        setIsUsageModalOpen(true);
        setUsageLoading(true);
        try {
            const res = await fetch(`/api/coupons/${coupon.id}/usage`);
            if (res.ok) {
                const data = await res.json();
                setUsageStats(data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar usos");
        } finally {
            setUsageLoading(false);
        }
    };

    const handleEdit = (coupon: Coupon) => {
        setEditingId(coupon.id);
        setCode(coupon.code);
        setDiscount(coupon.discount.toString());
        setLimit(coupon.limit ? coupon.limit.toString() : "");
        setExpiresAt(coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : "");
        setIsCreating(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setIsCreating(false);
        setEditingId(null);
        setCode("");
        setDiscount("");
        setLimit("");
        setExpiresAt("");
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const endpoint = editingId ? "/api/coupons" : "/api/coupons";
            const method = editingId ? "PATCH" : "POST";
            const body: any = {
                code,
                discount,
                limit: limit || null,
                expiresAt: expiresAt || null
            };

            if (editingId) {
                body.id = editingId;
            }

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error("Failed to save");

            toast.success(editingId ? "Cupón actualizado" : "Cupón creado");
            handleCancel(); // Resets state
            fetchCoupons();
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar cupón");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Cupones de Descuento</h1>
                    <p className="text-gray-400">Gestiona los códigos promocionales</p>
                </div>
                <button
                    onClick={() => {
                        if (isCreating) {
                            handleCancel();
                        } else {
                            setIsCreating(true);
                        }
                    }}
                    className="flex items-center gap-2 bg-[#5D5CDE] text-white px-4 py-2 rounded-xl hover:bg-[#4b4ac0] transition-colors font-medium"
                >
                    {isCreating ? "Cancelar" : <><Plus size={20} /> Nuevo Cupón</>}
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleSubmit} className="bg-[#1F2937]/50 border border-gray-800 p-6 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-bold text-white mb-4">
                        {editingId ? "Editar Cupón" : "Crear Nuevo Cupón"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Código</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-3 text-gray-500" size={16} />
                                <input
                                    required
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    className="w-full bg-[#0b0e14] border border-gray-700 rounded-lg p-2.5 pl-10 text-white focus:border-[#5D5CDE]"
                                    placeholder="EJEMPLO20"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Descuento (%)</label>
                            <div className="relative">
                                <Percent className="absolute left-3 top-3 text-gray-500" size={16} />
                                <input
                                    required
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                    className="w-full bg-[#0b0e14] border border-gray-700 rounded-lg p-2.5 pl-10 text-white focus:border-[#5D5CDE]"
                                    placeholder="20"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Límite de usos (Opcional)</label>
                            <input
                                type="number"
                                min="1"
                                value={limit}
                                onChange={(e) => setLimit(e.target.value)}
                                className="w-full bg-[#0b0e14] border border-gray-700 rounded-lg p-2.5 text-white focus:border-[#5D5CDE]"
                                placeholder="Sin límite"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Expira el (Opcional)</label>
                            <input
                                type="date"
                                value={expiresAt}
                                onChange={(e) => setExpiresAt(e.target.value)}
                                className="w-full bg-[#0b0e14] border border-gray-700 rounded-lg p-2.5 text-white focus:border-[#5D5CDE]"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 gap-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-transparent border border-gray-700 text-gray-300 px-6 py-2 rounded-lg font-bold hover:bg-white/5"
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="bg-[#5D5CDE] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#4b4ac0]">
                            {editingId ? "Actualizar Cupón" : "Guardar Cupón"}
                        </button>
                    </div>
                </form>
            )}

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="animate-spin text-[#5D5CDE]" size={32} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {coupons.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No hay cupones creados aún.
                        </div>
                    )}
                    {coupons.map((coupon) => (
                        <div key={coupon.id} className={`relative bg-[#1F2937]/30 border ${coupon.active ? 'border-gray-800' : 'border-red-900/30'} p-5 rounded-xl space-y-4 hover:border-[#5D5CDE]/50 transition-colors group`}>
                            {/* Action Buttons */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleViewUsage(coupon)}
                                    className="p-2 bg-gray-800/50 rounded-lg text-gray-400 hover:text-white hover:bg-[#5D5CDE] transition-all"
                                    title="Ver Usos"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleEdit(coupon)}
                                    className="p-2 bg-gray-800/50 rounded-lg text-gray-400 hover:text-white hover:bg-[#5D5CDE] transition-all"
                                    title="Editar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                        <path d="m15 5 4 4" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDelete(coupon.id)}
                                    className="p-2 bg-gray-800/50 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                    title="Eliminar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18" />
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="inline-flex items-center gap-2 bg-[#5D5CDE]/10 text-[#5D5CDE] px-3 py-1 rounded-lg font-mono font-bold text-lg border border-[#5D5CDE]/20">
                                        <Tag size={16} />
                                        {coupon.code}
                                    </div>
                                    <p className="text-sm text-gray-400 mt-2">
                                        {coupon.type === 'PERCENTAGE' ? `${coupon.discount}% de descuento` : `$${coupon.discount} de descuento`}
                                    </p>
                                </div>
                                <div className={`h-3 w-3 rounded-full mt-2 ${coupon.active ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 border-t border-gray-800 pt-4">
                                <div className="flex flex-col gap-1">
                                    <span className="uppercase tracking-wider font-semibold text-gray-600">Usos</span>
                                    <span className="text-gray-300 font-mono">
                                        {coupon.used} / {coupon.limit || '∞'}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1 text-right">
                                    <span className="uppercase tracking-wider font-semibold text-gray-600">Expira</span>
                                    <span className="text-gray-300">
                                        {coupon.expiresAt ? format(new Date(coupon.expiresAt), 'dd/MM/yyyy') : 'Nunca'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Usage Modal */}
            {isUsageModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#111827] border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">
                                Usos del cupón <span className="text-[#5D5CDE]">{selectedCouponCode}</span>
                            </h3>
                            <button
                                onClick={() => setIsUsageModalOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {usageLoading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="animate-spin text-[#5D5CDE]" size={32} />
                                </div>
                            ) : usageStats.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    Este cupón no ha sido utilizado aún.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {usageStats.map((usage: any, i) => (
                                        <div key={i} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-[#5D5CDE]/20 p-2 rounded-full text-[#5D5CDE]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">{usage.user.name || "Usuario sin nombre"}</p>
                                                    <p className="text-xs text-gray-400">{usage.user.email}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-300 font-mono">
                                                    {format(new Date(usage.createdAt), "dd MMM yyyy, HH:mm")}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-800 bg-gray-900/50 rounded-b-2xl">
                            <div className="text-xs text-gray-500 text-center">
                                Total de usos: {usageStats.length}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
