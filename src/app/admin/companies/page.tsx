"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Building2, Globe, Users, Copy, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function CompaniesPage() {
    const [companies, setCompanies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form
    const [name, setName] = useState("");
    const [domain, setDomain] = useState("");
    const [maxSeats, setMaxSeats] = useState("");

    const fetchCompanies = async () => {
        try {
            const res = await fetch("/api/companies");
            const data = await res.json();
            setCompanies(data);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar empresas");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/companies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, domain, maxSeats }),
            });

            if (!res.ok) throw new Error("Failed to create");

            toast.success("Empresa creada");
            setIsCreating(false);
            setName("");
            setDomain("");
            setMaxSeats("");
            fetchCompanies();
        } catch (error) {
            console.error(error);
            toast.error("Error al crear empresa");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Seguro de eliminar esta empresa? Se desvincularán los usuarios.")) return;
        try {
            const res = await fetch(`/api/companies?id=${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            toast.success("Empresa eliminada");
            fetchCompanies();
        } catch (error) {
            console.error(error);
            toast.error("Error al eliminar");
        }
    }

    const copyInviteLink = (code: string) => {
        const link = `${window.location.origin}/join/${code}`;
        navigator.clipboard.writeText(link);
        toast.success("Link de invitación copiado");
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Empresas</h1>
                    <p className="text-gray-400">Gestiona accesos y cupos B2B</p>
                </div>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="flex items-center gap-2 bg-[#5D5CDE] text-white px-4 py-2 rounded-xl hover:bg-[#4b4ac0] transition-colors font-medium"
                >
                    {isCreating ? "Cancelar" : <><Plus size={20} /> Nueva Empresa</>}
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleSubmit} className="bg-[#1F2937]/50 border border-gray-800 p-6 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-bold text-white mb-4">Alta de Empresa</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Nombre Razón Social</label>
                            <input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-[#0b0e14] border border-gray-700 rounded-lg p-2.5 text-white focus:border-[#5D5CDE]"
                                placeholder="Tech Corp"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Dominio (Opcional)</label>
                            <input
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                className="w-full bg-[#0b0e14] border border-gray-700 rounded-lg p-2.5 text-white focus:border-[#5D5CDE]"
                                placeholder="techcorp.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Cupos / Licencias</label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={maxSeats}
                                onChange={(e) => setMaxSeats(e.target.value)}
                                className="w-full bg-[#0b0e14] border border-gray-700 rounded-lg p-2.5 text-white focus:border-[#5D5CDE]"
                                placeholder="10"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-[#5D5CDE] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#4b4ac0]">
                            Guardar Empresa
                        </button>
                    </div>
                </form>
            )}

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="animate-spin text-[#5D5CDE]" size={32} />
                </div>
            ) : (
                <div className="grid gap-4">
                    {companies.length === 0 && (
                        <div className="text-center py-12 text-gray-500">No hay empresas registradas.</div>
                    )}
                    {companies.map((company) => (
                        <div key={company.id} className="bg-[#1F2937]/30 border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-[#5D5CDE]/10 p-3 rounded-xl text-[#5D5CDE]">
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">{company.name}</h3>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Globe size={14} />
                                            {company.domain || "Sin dominio"}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users size={14} />
                                            Used: {company._count?.users || 0} / {company.maxSeats}
                                        </div>
                                    </div>
                                    <div className="mt-2 inline-flex items-center gap-2 bg-gray-800/50 px-2 py-1 rounded text-xs font-mono text-gray-300">
                                        Code: <span className="text-white font-bold">{company.accessCode}</span>
                                        <button onClick={() => copyInviteLink(company.accessCode)} className="text-gray-500 hover:text-white" title="Copiar link">
                                            <Copy size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleDelete(company.id)}
                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Eliminar"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
