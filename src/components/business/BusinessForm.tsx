"use client";

import { useState } from "react";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { FloatingInput, FloatingSelect } from "@/components/ui/FloatingInput";
import toast from "react-hot-toast";

export default function BusinessForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "José Castro",
        companyName: "Axe Capital",
        email: "castrouxui@gmail.com",
        phone: "+5492614729836",
        employees: "11-50"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Simulate minimal network delay for UX if everything is instant
            const minDelay = new Promise(resolve => setTimeout(resolve, 800));

            const req = fetch("/api/business/lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const [res] = await Promise.all([req, minDelay]);

            if (!res.ok) throw new Error("Error submitting form");

            setSuccess(true);
            toast.success("¡Recibido! Nos pondremos en contacto pronto.");
        } catch (error) {
            console.error(error);
            toast.error("Ocurrió un error. Por favor intentá nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                    <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">¡Solicitud Enviada!</h3>
                <p className="text-gray-400 max-w-sm">
                    Hemos recibido tus datos correctamente. Un especialista de Aurora Academy te contactará en las próximas 24 horas.
                </p>
                <div className="mt-8 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 text-sm text-gray-400">
                    📧 Te enviamos un correo de confirmación a <br />
                    <span className="text-white font-medium">{formData.email}</span>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FloatingInput
                    label="Nombre Completo"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                />
                <FloatingInput
                    label="Empresa"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                />
            </div>

            <FloatingInput
                label="Email Corporativo"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FloatingInput
                    label="Teléfono"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                />
                <FloatingSelect
                    label="Empleados"
                    name="employees"
                    required
                    value={formData.employees}
                    onChange={handleChange}
                    options={[
                        { value: "", label: "Seleccionar cantidad" },
                        { value: "1-10", label: "1-10 empleados" },
                        { value: "11-50", label: "11-50 empleados" },
                        { value: "51-200", label: "51-200 empleados" },
                        { value: "+200", label: "+200 empleados" },
                    ]}
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full relative overflow-hidden group bg-[#5D5CDE] text-white font-bold py-4 rounded-xl hover:bg-[#4b4ac0] transition-all transform active:scale-[0.98] shadow-lg shadow-[#5D5CDE]/20 hover:shadow-[#5D5CDE]/40"
            >
                <div className="flex items-center justify-center gap-2 relative z-10">
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Enviando...</span>
                        </>
                    ) : (
                        <>
                            <span>Solicitar Propuesta</span>
                            <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </div>
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />
            </button>

            <p className="text-xs text-center text-gray-500 mt-6 flex items-center justify-center gap-1.5 opacity-80">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Tus datos están encriptados y seguros.
            </p>
        </form>
    );
}

// Add shimmer animation to tailwind config if not present, but for now we rely on standard hover

const [isLoading, setIsLoading] = useState(false);
const [success, setSuccess] = useState(false);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
        const res = await fetch("/api/business/lead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Error submitting form");

        setSuccess(true);
        toast.success("¡Recibido! Nos pondremos en contacto pronto.");
    } catch (error) {
        console.error(error);
        toast.error("Ocurrió un error. Por favor intentá nuevamente.");
    } finally {
        setIsLoading(false);
    }
};

if (success) {
    return (
        <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">¡Mensaje Enviado!</h3>
            <p className="text-gray-400">
                Gracias por tu interés. Nuestro equipo comercial analizará tu solicitud y te contactará a la brevedad.
            </p>
        </div>
    );
}

return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium">Nombre Completo</label>
                <input
                    required
                    name="name"
                    type="text"
                    className="w-full bg-[#1F2937]/50 border border-gray-700 rounded-lg p-3 text-white focus:border-[#5D5CDE] outline-none transition-colors"
                    placeholder="Juan Pérez"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium">Empresa</label>
                <input
                    required
                    name="companyName"
                    type="text"
                    className="w-full bg-[#1F2937]/50 border border-gray-700 rounded-lg p-3 text-white focus:border-[#5D5CDE] outline-none transition-colors"
                    placeholder="Tech Solutions S.A."
                />
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-sm text-gray-400 font-medium">Email Corporativo</label>
            <input
                required
                name="email"
                type="email"
                className="w-full bg-[#1F2937]/50 border border-gray-700 rounded-lg p-3 text-white focus:border-[#5D5CDE] outline-none transition-colors"
                placeholder="juan@empresa.com"
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium">Teléfono</label>
                <input
                    name="phone"
                    type="tel"
                    className="w-full bg-[#1F2937]/50 border border-gray-700 rounded-lg p-3 text-white focus:border-[#5D5CDE] outline-none transition-colors"
                    placeholder="+54 9 11..."
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium">Empleados</label>
                <select
                    required
                    name="employees"
                    className="w-full bg-[#1F2937]/50 border border-gray-700 rounded-lg p-3 text-white focus:border-[#5D5CDE] outline-none transition-colors"
                >
                    <option value="">Seleccionar</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="+200">+200</option>
                </select>
            </div>
        </div>

        <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#5D5CDE] text-white font-bold py-4 rounded-xl hover:bg-[#4b4ac0] transition-colors flex items-center justify-center gap-2 mt-4"
        >
            {isLoading ? <Loader2 className="animate-spin" /> : "Solicitar Propuesta"}
        </button>

        <p className="text-xs text-center text-gray-500 mt-4">
            Nos tomamos la privacidad en serio. Tus datos están seguros.
        </p>
    </form>
);
}
