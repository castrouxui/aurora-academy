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
            <header className="mb-12 text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-[#5D5CDE]/10 text-[#5D5CDE] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-[#5D5CDE]/20 mb-2">
                    Nivel: Profesional
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                    Tu Hoja de Ruta
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
                    Domina el mercado paso a paso. Completá cada fase para desbloquear la siguiente.
                </p>
            </header>

            <div className="space-y-4 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute left-[27px] top-8 bottom-8 w-0.5 bg-gray-800 -z-10"></div>

                {milestones.map((milestone: any, index: number) => {
                    const isCompleted = milestone.completed;
                    const isLocked = milestone.isLocked;
                    const isCurrent = !isLocked && !isCompleted;
                    const isTripwire = index === 1; // Tripwire step
                    const isMembership = milestone.type === "SUBSCRIPTION";

                    const handleClick = (e: React.MouseEvent) => {
                        if (isLocked) {
                            e.preventDefault();
                            if (index === 1) { // Tripwire
                                window.location.href = "/checkout/cl_7_pilares_exito";
                            } else if (index === 2) { // Membership
                                window.location.href = "/membresias";
                            }
                        }
                    };

                    const href = milestone.type === "COURSE"
                        ? (index === 0 ? `/learn/${milestone.courseId}` : `/cursos/${milestone.courseId}`)
                        : "/membresias";

                    return (
                        <div key={milestone.id} className="relative group">
                            <Link
                                href={href}
                                onClick={handleClick}
                                className={cn(
                                    "flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 p-4 md:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden",
                                    isLocked
                                        ? "bg-[#0B0F19]/50 border-gray-800/50 opacity-70 hover:opacity-100 hover:bg-[#121620] cursor-pointer"
                                        : isCurrent
                                            ? "bg-[#121620] border-[#5D5CDE]/50 shadow-lg shadow-[#5D5CDE]/5"
                                            : "bg-[#0B0F19] border-gray-800 hover:border-gray-700"
                                )}
                            >
                                {/* Status Icon / Number */}
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-colors relative z-10",
                                    isCompleted ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                                        isCurrent ? "bg-[#5D5CDE] border-[#5D5CDE] text-white shadow-lg shadow-[#5D5CDE]/30" :
                                            "bg-gray-800/50 border-gray-700 text-gray-400"
                                )}>
                                    {isCompleted ? (
                                        <CheckCircle2 size={24} />
                                    ) : isLocked ? (
                                        <Lock size={20} />
                                    ) : (
                                        <span className="text-lg font-bold">{index + 1}</span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 w-full">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className={cn(
                                            "text-lg font-bold truncate",
                                            isCompleted ? "text-emerald-400" : "text-white"
                                        )}>
                                            {milestone.title}
                                        </h3>
                                        {isTripwire && isLocked && (
                                            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase rounded border border-amber-500/20">
                                                Recomendado
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-400 line-clamp-2 md:line-clamp-1 mb-3 md:mb-0">
                                        {milestone.description}
                                    </p>

                                    {/* Mobile Only: Action Button/State */}
                                    <div className="mt-3 md:hidden">
                                        {isLocked ? (
                                            <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                                                <Lock size={12} /> Bloqueado
                                            </span>
                                        ) : (
                                            <span className="text-xs font-bold text-[#5D5CDE] flex items-center gap-1">
                                                <ArrowRight size={12} /> Continuar
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Desktop Actions */}
                                <div className="hidden md:flex items-center gap-4 shrink-0">
                                    {isLocked ? (
                                        <div className="text-right">
                                            {isTripwire && (
                                                <p className="text-xs text-gray-400 mb-1">Oferta única</p>
                                            )}
                                            <div className="px-4 py-2 rounded-lg bg-gray-800 text-gray-400 text-sm font-bold flex items-center gap-2 group-hover:bg-gray-700 transition-colors">
                                                <Lock size={14} />
                                                {isMembership ? "Requiere Membresía" : "Desbloquear"}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            {milestone.progress > 0 && milestone.progress < 100 && (
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-xs text-gray-400 font-medium">{milestone.progress}%</span>
                                                    <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-[#5D5CDE] rounded-full"
                                                            style={{ width: `${milestone.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                                isCurrent
                                                    ? "bg-white text-black hover:scale-110"
                                                    : "bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-white"
                                            )}>
                                                <ArrowRight size={20} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>

            {/* Final Certification Seal */}
            {data.progress === 100 && (
                <div className="mt-20 p-8 md:p-12 relative rounded-[3rem] bg-gradient-to-br from-[#1E2235] to-[#13151A] border border-amber-500/30 text-center animate-in zoom-in duration-700 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                            <Award size={48} className="text-amber-500" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">¡Misión Cumplida!</h2>
                        <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
                            Has completado con éxito la ruta **Trader de 0 a 100**. Tu disciplina ha dado sus frutos.
                        </p>
                        <button className="bg-amber-500 hover:bg-amber-600 text-black font-black px-12 py-4 rounded-xl transition-all shadow-xl shadow-amber-500/20 hover:-translate-y-1 active:scale-95">
                            Descargar Certificado Profesional
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
