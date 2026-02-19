"use client";

import { X, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { FloatingInput } from "@/components/ui/FloatingInput";
import toast from "react-hot-toast";
import { Logo } from "@/components/layout/Logo";
import { signIn, getProviders, LiteralUnion, ClientSafeProvider } from "next-auth/react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface CourseGateModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseId: string;
    courseTitle: string;
}

import { createPortal } from "react-dom";

// ... existing imports

export function CourseGateModal({ isOpen, onClose, courseId, courseTitle }: CourseGateModalProps) {
    useBodyScrollLock(isOpen);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [providers, setProviders] = useState<Record<LiteralUnion<string>, ClientSafeProvider> | null>(null);
    const [mounted, setMounted] = useState(false);

    // Default to 'register' mode since this is a "complete profile" flow
    const [mode, setMode] = useState<'login' | 'register'>('register');

    useEffect(() => {
        setMounted(true);
        getProviders().then(setProviders);
        return () => setMounted(false);
    }, []);

    if (!isOpen || !mounted) return null;

    const isRegister = mode === 'register';

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await signIn("google", {
                callbackUrl: `/cursos/${courseId}?enroll=true`, // We can handle auto-enroll on the page or redirect to an API
            });
        } catch (error) {
            console.error("Google login error:", error);
            toast.error("Error al iniciar sesión con Google");
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
        const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;

        // Additional fields for "Complete Profile" feel if needed, but let's keep it simple for auth first
        // If we want name/phone, we'd need to add them to the form and pass them to the backend

        try {
            // Standard Credentials Login/Register
            const result = await signIn("credentials", {
                email,
                password,
                isRegister: isRegister ? "true" : "false",
                redirect: false,
            });

            if (result?.error) {
                toast.error(result.error || "Error de autenticación");
                setIsLoading(false);
                return;
            }

            if (result?.ok) {
                toast.success(isRegister ? "¡Cuenta creada!" : "¡Bienvenido!");
                // Instead of redirecting immediately, show success modal
                setIsSuccess(true);

                // Enroll user in the free course immediately (background)
                try {
                    await fetch("/api/enroll/free", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ courseId }),
                    });
                } catch (enrollError) {
                    console.error("Enrollment error after login", enrollError);
                }
            }

        } catch (error) {
            console.error("Auth error:", error);
            toast.error("Ocurrió un error inesperado");
            setIsLoading(false);
        }
    };

    const modalContent = isSuccess ? (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg bg-[#0E1219] border border-blue-500/30 rounded-3xl shadow-2xl p-8 text-center">
                {/* User Avatar / Success Icon */}
                <div className="relative mx-auto mb-6 w-24 h-24">
                    <div className="w-24 h-24 rounded-full bg-gray-500/20 overflow-hidden border-2 border-gray-700/50 flex items-center justify-center">
                        {/* Generic User Icon or Initials if we had them, placeholder for now */}
                        <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1.5 border-4 border-[#0E1219]">
                        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">¡Perfil actualizado con éxito!</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 px-4">
                    ¡Gracias por actualizar tu perfil! Ahora tendrás una experiencia mas personalizada para continuar tu aprendizaje
                </p>

                <Button
                    onClick={() => {
                        window.location.href = `/learn/${courseId}`;
                    }}
                    className="w-full h-12 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-all"
                >
                    Completar perfil
                </Button>
            </div>
        </div>
    ) : (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-[#5D5CDE]/20 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-[#5D5CDE]/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative w-full max-w-4xl bg-[#0B0F19] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-50 text-gray-400 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full p-2"
                >
                    <X size={20} />
                </button>

                {/* Left Side - Image/Visual */}
                <div className="hidden md:flex md:w-1/2 bg-[#13151A] relative flex-col justify-end p-10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent z-10" />
                    {/* Placeholder for a nice image - using CSS pattern for now or use a course image if passed */}
                    <div className="absolute inset-0 opacity-30" style={{
                        backgroundImage: `url('/images/auth-pattern.svg')`, // Assumed pattern or create a CSS radial
                        backgroundSize: 'cover'
                    }}>
                        {/* Fallback visual */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#5D5CDE]/20 via-[#0B0F19] to-[#0B0F19]" />
                    </div>

                    <div className="relative z-20 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5D5CDE]/20 border border-[#5D5CDE]/30 text-[#5D5CDE] text-xs font-bold uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-[#5D5CDE] animate-pulse" />
                            Acceso Exclusivo
                        </div>
                        <h2 className="text-3xl font-black text-white leading-tight">
                            {courseTitle} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">comienza aquí.</span>
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            Únete a miles de estudiantes que ya están operando en los mercados financieros. Completa tu perfil para desbloquear el curso gratuito.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-[#0B0F19]/50 backdrop-blur-sm">
                    <div className="mb-8 text-center md:text-left">
                        <h3 className="text-2xl font-bold text-white mb-2">Completá tu perfil</h3>
                        <p className="text-gray-400 text-sm">
                            Para acceder al curso "{courseTitle}", necesitamos crear tu cuenta de estudiante.
                        </p>
                    </div>

                    {/* Google Button */}
                    {providers?.google && (
                        <Button
                            onClick={handleGoogleLogin}
                            className="w-full h-14 bg-white hover:bg-gray-100 text-black font-bold rounded-xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98] mb-6"
                        >
                            <GoogleIcon /> {/* Reusing the SVG component defined below */}
                            Registrarse con Google
                        </Button>
                    )}

                    <div className="relative flex items-center gap-4 mb-6">
                        <div className="h-px bg-gray-800 flex-1" />
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">O con tu email</span>
                        <div className="h-px bg-gray-800 flex-1" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                            {/* Added Name field for "Profile" feel if needed, but keeping simple for now as requested by 'register with google or mail' standard */}
                            {isRegister && (
                                <div className="grid grid-cols-2 gap-4">
                                    <FloatingInput
                                        label="Nombre"
                                        name="firstName"
                                        className="bg-[#13151A] border-gray-700 focus:border-[#5D5CDE]"
                                    // Optional for now or required if simple registration supports it
                                    />
                                    <FloatingInput
                                        label="Apellido"
                                        name="lastName"
                                        className="bg-[#13151A] border-gray-700 focus:border-[#5D5CDE]"
                                    />
                                </div>
                            )}

                            <FloatingInput
                                label="Correo Electrónico"
                                name="email"
                                type="email"
                                required
                                className="bg-[#13151A] border-gray-700 focus:border-[#5D5CDE]"
                            />
                            <FloatingInput
                                label="Contraseña"
                                name="password"
                                type="password"
                                required
                                className="bg-[#13151A] border-gray-700 focus:border-[#5D5CDE]"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white font-bold rounded-xl shadow-lg shadow-[#5D5CDE]/25 shiny-hover transition-all mt-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : (isRegister ? "Completar Registro" : "Iniciar Sesión")}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setMode(isRegister ? 'login' : 'register')}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            {isRegister ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Registrate gratis"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}

// Simple Google Icon Component
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
