"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Logo } from "@/components/layout/Logo";
import { signIn } from "next-auth/react";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    redirectUrl?: string; // Optional URL to redirect after login
    view?: 'default' | 'purchase'; // Customize text context
}

export function LoginModal({ isOpen, onClose, redirectUrl, view = 'default' }: LoginModalProps) {
    if (!isOpen) return null;

    const isPurchase = view === 'purchase';
    const titleText = isPurchase ? "Para comprar, primero debes registrarte" : "Ingresar o crear cuenta con:";
    const googleText = isPurchase ? "Registrarse con Google" : "Continuar con Google";
    const appleText = isPurchase ? "Registrarse con Apple" : "Continuar con Apple";
    const facebookText = isPurchase ? "Registrarse con Facebook" : "Continuar con Facebook";
    const submitText = isPurchase ? "Registrarse" : "Iniciar Sesión";

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
            <div className="relative w-full max-w-md rounded-2xl border border-gray-800 bg-[#121620] p-8 shadow-2xl animate-in zoom-in-95 duration-200">

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
                </div>

                {/* Social Buttons */}
                <div className="flex flex-col space-y-3">
                    <Button
                        onClick={() => signIn("google", { callbackUrl: redirectUrl || "/dashboard/courses" })}
                        variant="outline"
                        className="h-12 w-full justify-start gap-3 border-gray-700 bg-[#2d323e] text-white hover:bg-[#3d4250] hover:text-white font-normal"
                    >
                        <GoogleIcon />
                        {googleText}
                    </Button>

                    <Button
                        variant="outline"
                        className="h-12 w-full justify-start gap-3 border-gray-700 bg-[#2d323e] text-white hover:bg-[#3d4250] hover:text-white font-normal"
                    >
                        <AppleIcon />
                        {appleText}
                    </Button>

                    <Button
                        variant="outline"
                        className="h-12 w-full justify-start gap-3 border-gray-700 bg-[#2d323e] text-white hover:bg-[#3d4250] hover:text-white font-normal"
                    >
                        <FacebookIcon />
                        {facebookText}
                    </Button>
                </div>

                {/* Divider */}
                <div className="my-6 flex items-center gap-4">
                    <div className="h-[1px] flex-1 bg-gray-800"></div>
                    <span className="text-sm text-gray-500">o</span>
                    <div className="h-[1px] flex-1 bg-gray-800"></div>
                </div>

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

                <div className="mt-4 text-center">
                    {/* Test credentials removed for production */}
                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                    Al crear una cuenta en Aurora Academy, aceptas los <span className="text-white cursor-pointer hover:underline">Términos de Servicio</span> y <span className="text-white cursor-pointer hover:underline">Políticas de privacidad</span>.
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

const AppleIcon = () => (
    <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" transform="scale(0.8) translate(3,3)" fill="none" />
        {/* Using a simpler path for Apple logo approx or generic SVG */}
        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.03-.48-3.24.02-1.04.41-2.06.4-3.33-.85-4.5-4.63-3.75-11.23.95-13.13 1.25-.54 2.54-.1 3.28.16.89.33 1.63.26 2.45-.11.96-.44 2.52-.89 4.25-.09 1.83.83 2.84 2.07 2.89 2.14-.02.04-1.73 1.04-1.67 3.03.04 2.42 2.15 3.23 2.2 3.26-.04.09-.32 1.09-1.07 2.17-.67.97-1.57 2.16-2.58 2.18-.55 0-1.12-.18-1.78-.46l.24.4zm-3.38-16c.49-2.08 2.33-3.75 4.38-4.14.34 2.55-2.05 4.79-4.38 4.14z" />
    </svg>
)

const FacebookIcon = () => (
    <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
)
