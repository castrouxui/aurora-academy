"use client";

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Lock, ArrowRight, Zap, Award } from 'lucide-react';
import Link from 'next/link';
import { getCareerProgress } from '@/actions/career';
import { cn } from '@/lib/utils';
import { PaymentModal } from '@/components/checkout/PaymentModal';

interface CareerRoadmapViewProps {
    userId: string;
    careerReferenceId: string;
}

export function CareerRoadmapView({ userId, careerReferenceId }: CareerRoadmapViewProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getCareerProgress(userId, careerReferenceId);
                setData(result);
            } catch (error) {
                console.error("Error fetching roadmap:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, careerReferenceId]);

    if (loading) return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-gray-500 flex items-center gap-2 animate-pulse">
                <Zap className="animate-bounce" size={20} />
                Cargando Hoja de Ruta...
            </div>
        </div>
    );

    if (!data) return (
        <div className="p-12 text-center">
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md mx-auto">
                <p className="text-red-400 font-medium">No se encontró la carrera.</p>
            </div>
        </div>
    );

    const { milestones, hasActiveSubscription } = data;

    return (
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
            <header className="mb-20 text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-[#5D5CDE]/10 text-[#5D5CDE] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-[#5D5CDE]/20 mb-2">
                    Nivel: Profesional
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                    Tu Hoja de Ruta
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
                    Convertite en un Trader profesional siguiendo este camino estructurado paso a paso.
                </p>
            </header>

            <div className="relative">
                {/* Vertical Line - Centered on tablet+, left on mobile */}
                <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#5D5CDE]/50 via-white/5 to-transparent md:-translate-x-1/2"></div>

                <div className="space-y-24">
                    {milestones.map((milestone: any, index: number) => {
                        const isEven = index % 2 === 0;
                        const isCompleted = milestone.completed;
                        const milestoneTitle = index === 0 ? "El camino del inversor" :
                            index === 1 ? "Los 7 Pilares del Éxito en Bolsa" :
                                "Membresía Aurora";

                        const showMemberPrice = index === 1 && hasActiveSubscription;
                        const price = index === 1 ? (showMemberPrice ? "$0" : "$7.000") :
                            index === 0 ? "Gratis" : "Suscripción";

                        return (
                            <div key={milestone.id} className={cn(
                                "relative flex flex-col md:flex-row items-center",
                                isEven ? "md:flex-row" : "md:flex-row-reverse"
                            )}>
                                {/* Circle Indicator */}
                                <div className={cn(
                                    "absolute left-6 md:left-1/2 w-12 h-12 rounded-full border-4 flex items-center justify-center -translate-x-1/2 z-20 shadow-2xl transition-all duration-500",
                                    isCompleted
                                        ? "bg-emerald-500 border-emerald-500/30 text-white"
                                        : "bg-[#13151A] border-white/10 text-gray-400"
                                )}>
                                    {isCompleted ? (
                                        <CheckCircle2 size={24} />
                                    ) : (
                                        <span className="text-sm font-black">{index + 1}</span>
                                    )}
                                </div>

                                {/* Content Card */}
                                <div className={cn(
                                    "w-full md:w-5/12 pl-16 md:pl-0",
                                    isEven ? "md:pr-16" : "md:pl-16"
                                )}>
                                    <div className={cn(
                                        "relative p-8 rounded-[2rem] border transition-all duration-500 group overflow-hidden",
                                        isCompleted
                                            ? "bg-emerald-500/[0.03] border-emerald-500/20 shadow-[0_0_50px_-12px_rgba(16,185,129,0.1)]"
                                            : "bg-[#13151A] border-white/5 hover:border-[#5D5CDE]/30 hover:shadow-[0_0_50px_-12px_rgba(93,92,222,0.15)] shadow-2xl"
                                    )}>
                                        {/* Glow effect */}
                                        <div className={cn(
                                            "absolute -top-24 -right-24 w-48 h-48 blur-[80px] pointer-events-none transition-all duration-500",
                                            isCompleted ? "bg-emerald-500/10" : "bg-[#5D5CDE]/5 group-hover:bg-[#5D5CDE]/10"
                                        )}></div>

                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-6">
                                                <span className={cn(
                                                    "text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border",
                                                    isCompleted
                                                        ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5"
                                                        : "text-[#5D5CDE] border-[#5D5CDE]/20 bg-[#5D5CDE]/5"
                                                )}>
                                                    PASO {index + 1}
                                                </span>
                                                {isCompleted && (
                                                    <div className="flex items-center gap-1.5 text-emerald-500">
                                                        <CheckCircle2 size={14} />
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">Completado</span>
                                                    </div>
                                                )}
                                            </div>

                                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
                                                {milestoneTitle}
                                            </h3>

                                            <div className="mb-8">
                                                {index === 1 && showMemberPrice ? (
                                                    <p className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                                                        <Zap size={16} fill="currentColor" />
                                                        Incluido en tu plan ($0)
                                                    </p>
                                                ) : (
                                                    <p className="text-base font-medium text-white/50">{price}</p>
                                                )}
                                            </div>

                                            {milestone.type === "COURSE" ? (
                                                <Link
                                                    href={`/cursos/${milestone.courseId}`}
                                                    className={cn(
                                                        "w-full inline-flex items-center justify-between gap-2 text-sm font-black px-6 py-4 rounded-2xl transition-all",
                                                        isCompleted
                                                            ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                                                            : "bg-[#5D5CDE] text-white hover:bg-[#4B4AC0] hover:shadow-xl hover:shadow-[#5D5CDE]/20"
                                                    )}
                                                >
                                                    <span>{isCompleted ? "Repasar curso" : "Comenzar ahora"}</span>
                                                    <ArrowRight size={18} />
                                                </Link>
                                            ) : (
                                                <Link
                                                    href="/membresias"
                                                    className={cn(
                                                        "w-full inline-flex items-center justify-between gap-2 text-sm font-black px-6 py-4 rounded-2xl transition-all",
                                                        isCompleted
                                                            ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                                                            : "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:shadow-xl hover:shadow-amber-500/20"
                                                    )}
                                                >
                                                    <span>{isCompleted ? "Membresía Activa" : "Unirse a la Membresía"}</span>
                                                    {isCompleted ? <CheckCircle2 size={18} /> : <Zap size={18} fill="currentColor" />}
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Spacer */}
                                <div className="hidden md:block md:w-5/12"></div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Final Certification Seal */}
            {data.progress === 100 && (
                <div className="mt-32 p-12 relative rounded-[3rem] bg-gradient-to-br from-[#1E2235] to-[#13151A] border border-amber-500/30 text-center animate-in zoom-in duration-700 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                            <Award size={48} className="text-amber-500" />
                        </div>
                        <h2 className="text-4xl font-black text-white mb-4 tracking-tight">¡Misión Cumplida!</h2>
                        <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                            Has completado con éxito la ruta **Trader de 0 a 100**. Tu disciplina ha dado sus frutos.
                        </p>
                        <button className="bg-amber-500 hover:bg-amber-600 text-black font-black px-12 py-4 rounded-2xl transition-all shadow-xl shadow-amber-500/20 hover:-translate-y-1 active:scale-95">
                            Descargar Certificado Profesional
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
