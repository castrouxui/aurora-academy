"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

import { Logo } from "@/components/layout/Logo";
import { signIn, getProviders, LiteralUnion, ClientSafeProvider } from "next-auth/react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useEffect } from "react";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    redirectUrl?: string; // Optional URL to redirect after login
    view?: 'default' | 'purchase'; // Customize text context
}

export function LoginModal({ isOpen, onClose, redirectUrl, view = 'default' }: LoginModalProps) {
    useBodyScrollLock(isOpen);
    const [mode, setMode] = useState<'login' | 'register'>(view === 'purchase' ? 'register' : 'login');
    const [providers, setProviders] = useState<Record<LiteralUnion<string>, ClientSafeProvider> | null>(null);

    useEffect(() => {
        getProviders().then(setProviders);
    }, []);

    if (!isOpen) return null;

    const isRegister = mode === 'register';
    const titleText = isRegister ? "Crea tu cuenta para continuar" : "Bienvenido de nuevo";
    const googleText = isRegister ? "Registrarse con Google" : "Continuar con Google";
    const submitText = isRegister ? "Registrarse" : "Iniciar Sesión";

    const toggleMode = () => setMode(prev => prev === 'login' ? 'register' : 'login');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
        const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;

        // Determine callback URL
        let callback = redirectUrl;
        if (!callback) {
            callback = email.includes("admin") ? "/admin" : "/dashboard/courses";
        }

        await signIn("credentials", {
            email,
            password,
            callbackUrl: callback
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-md rounded-2xl border border-gray-800 bg-[#121620] p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="mb-6 scale-110">
                        <Logo />
                    </div>
                    <h2 className="text-xl font-semibold text-white px-4">
                        {titleText}
                    </h2>
                    {view === 'purchase' && isRegister && (
                        <p className="text-sm text-gray-400 mt-2">Para comprar, primero debes registrarte</p>
                    )}
                </div>

                {/* Social Buttons */}
                {providers?.google && (
                    <div className="flex flex-col space-y-3">
                        <Button
                            onClick={() => signIn("google", { callbackUrl: redirectUrl || "/dashboard/courses" })}
                            variant="outline"
                            className="h-12 w-full justify-start gap-3 border-gray-700 bg-[#2d323e] text-white hover:bg-[#3d4250] hover:text-white font-normal"
                        >
                            <GoogleIcon />
                            {googleText}
                        </Button>

                        {/* Divider only if google is present */}
                        <div className="my-6 flex items-center gap-4">
                            <div className="h-[1px] flex-1 bg-gray-800"></div>
                            <span className="text-sm text-gray-500">o</span>
                            <div className="h-[1px] flex-1 bg-gray-800"></div>
                        </div>
                    </div>
                )}

                {/* Fallback msg for dev if no providers */}
                {!providers?.google && process.env.NODE_ENV === 'development' && (
                    <p className="text-xs text-yellow-500 text-center mb-4">
                        Google Login disabled (Missing Env Vars)
                    </p>
                )}

                {/* Email/Password Form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400">Correo Electrónico</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="nombre@ejemplo.com"
                            required
                            className="w-full bg-[#1e2330] border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400">Contraseña</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            className="w-full bg-[#1e2330] border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium mt-2"
                    >
                        {submitText}
                    </Button>
                </form>

                {/* Toggle Mode */}
                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-400">
                        {isRegister ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}
                    </span>
                    <button
                        onClick={toggleMode}
                        className="ml-2 text-primary hover:underline font-medium focus:outline-none"
                    >
                        {isRegister ? "Inicia Sesión" : "Regístrate"}
                    </button>
                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                    Al {isRegister ? "crear una cuenta" : "ingresar"} en Aurora Academy, aceptas los <span className="text-white cursor-pointer hover:underline">Términos de Servicio</span> y <span className="text-white cursor-pointer hover:underline">Políticas de privacidad</span>.
                </p>
            </div>
        </div>
    );
}

// Simple Icons Components for this file
const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
        </g>
    </svg>
)
