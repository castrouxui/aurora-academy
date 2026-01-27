"use client";

import { Logo } from "@/components/layout/Logo";
import { TelegramVerification } from "@/components/dashboard/TelegramVerification";
import { Send, LogOut, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export function TelegramBlockingOverlay({ user }: { user: { name?: string | null, email?: string | null, telegram?: string | null, telegramVerified?: boolean } }) {
    return (
        <div className="fixed inset-0 z-[100] bg-[#0B0F19] overflow-y-auto">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#0088cc]/20 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-2xl bg-[#1F2937]/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-8 md:p-12">
                        {/* Header */}
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="mb-6">
                                <Logo />
                            </div>
                            <div className="h-16 w-16 bg-[#0088cc]/10 text-[#0088cc] rounded-2xl flex items-center justify-center mb-6 animate-bounce">
                                <Send size={32} />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter">
                                Vinculación Obligatoria
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                                ¡Hola <b>{user.name?.split(' ')[0]}</b>! Para continuar usando la plataforma, necesitamos que vincules tu cuenta con nuestro bot de Telegram.
                            </p>
                        </div>

                        {/* Verification Component */}
                        <div className="bg-black/20 rounded-2xl p-1 border border-white/5 mb-8">
                            <TelegramVerification
                                initialHandle={user.telegram}
                                isVerified={user.telegramVerified || false}
                            />
                        </div>

                        {/* Benefits / Footer Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            <div className="flex gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="text-primary shrink-0"><Info size={20} /></div>
                                <div className="text-xs text-gray-400 leading-tight">
                                    <span className="text-white font-bold block mb-1">Alertas en tiempo real</span>
                                    Recibí notificaciones de nuevos cursos, directos y actualizaciones críticas al instante.
                                </div>
                            </div>
                            <div className="flex gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="text-[#0088cc] shrink-0"><Send size={20} /></div>
                                <div className="text-xs text-gray-400 leading-tight">
                                    <span className="text-white font-bold block mb-1">Sin Spam</span>
                                    Solo enviamos información relevante a tu proceso de aprendizaje.
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center border-t border-white/10 pt-8">
                            <Button
                                variant="ghost"
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="text-gray-500 hover:text-white hover:bg-white/5 gap-2"
                            >
                                <LogOut size={16} />
                                Cerrar sesión
                            </Button>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-sm text-gray-500 font-medium">
                    &copy; {new Date().getFullYear()} Aurora Academy. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
}
