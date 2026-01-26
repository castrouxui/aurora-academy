"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Loader2, Building2, CheckCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Navbar } from "@/components/layout/Navbar";

export default function JoinPage({ params }: { params: { code: string } }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // We could fetch company name server-side ideally, but for now we trust the flow.
    // Actually, good UX would be to show "Te estás uniendo a [Empresa]".
    // Let's assume user confirms on this page.

    const handleJoin = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/company/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accessCode: params.code }),
            });

            if (res.ok) {
                toast.success("¡Bienvenido al equipo!");
                router.push("/dashboard");
                router.refresh();
            } else {
                const msg = await res.text();
                toast.error(msg || "Error al unirse");
            }
        } catch (error) {
            console.error(error);
            toast.error("Ocurrió un error");
        } finally {
            setIsLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#5D5CDE]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0F19] flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-[#1F2937]/50 border border-gray-800 p-8 rounded-2xl max-w-md w-full text-center space-y-6">
                    <div className="w-16 h-16 bg-[#5D5CDE]/20 rounded-full flex items-center justify-center mx-auto text-[#5D5CDE]">
                        <Building2 size={32} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">Unite a tu equipo</h1>
                        <p className="text-gray-400">
                            Has sido invitado a sumarte a la formación corporativa en Aurora Academy.
                        </p>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-xl flex items-center justify-center gap-2 text-sm font-mono text-gray-300">
                        Código: <span className="text-white font-bold">{params.code}</span>
                    </div>

                    {session ? (
                        <div className="space-y-4">
                            <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg flex items-center gap-3 text-left">
                                <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden shrink-0">
                                    {session.user.image && <img src={session.user.image} className="w-full h-full" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                                </div>
                                <CheckCircle size={16} className="text-green-500" />
                            </div>

                            <button
                                onClick={handleJoin}
                                disabled={isLoading}
                                className="w-full bg-[#5D5CDE] text-white font-bold py-3 rounded-xl hover:bg-[#4b4ac0] transition-colors flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : "Unirme Ahora"}
                            </button>
                            <p className="text-xs text-gray-500">
                                Al unirte, compartirás tu progreso con el administrador de tu empresa.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg flex items-start gap-3 text-left">
                                <AlertCircle size={20} className="text-yellow-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-yellow-200">
                                    Debes iniciar sesión con tu cuenta corporativa para continuar.
                                </p>
                            </div>
                            <button
                                onClick={() => signIn()}
                                className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Iniciar Sesión / Registrarse
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
