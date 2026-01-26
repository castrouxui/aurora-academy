"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function BusinessForm() {
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
