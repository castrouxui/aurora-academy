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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-[160px] left-[16%] right-[16%] h-1 bg-gray-800 -z-10"></div>

                {milestones.map((milestone: any, index: number) => {
                    const isCompleted = milestone.completed;
                    const isLocked = milestone.isLocked;
                    const isCurrent = !isCompleted && !isLocked;

                    const handleClick = (e: React.MouseEvent) => {
                        if (isLocked) {
                            e.preventDefault();
                            if (index === 1) {
                                // Tripwire logic: Redirect to checkout
                                window.location.href = "/checkout/cl_7_pilares_exito";
                            } else if (index === 2) {
                                // Membership logic: Redirect to memberships
                                window.location.href = "/membresias";
                            }
                        }
                    };

                    const href = milestone.type === "COURSE"
                        ? (index === 0 ? `/learn/${milestone.courseId}` : `/cursos/${milestone.courseId}`)
                        : "/membresias";


                    return (
                        <div key={milestone.id} className="relative group">
                            {/* Step Indicator */}
                            <div className="flex justify-center mb-6">
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center font-black text-lg border-4 transition-all z-10",
                                    isCompleted ? "bg-emerald-500 border-emerald-500 text-white" :
                                        isCurrent ? "bg-[#5D5CDE] border-[#5D5CDE] text-white shadow-[0_0_20px_rgba(93,92,222,0.5)]" :
                                            "bg-[#13151A] border-gray-700 text-gray-500"
                                )}>
                                    {isCompleted ? <CheckCircle2 size={24} /> : index + 1}
                                </div>
                            </div>

                            {/* Card */}
                            <Link
                                href={href}
                                onClick={handleClick}
                                className={cn(
                                    "block relative rounded-2xl overflow-hidden border transition-all duration-300 h-full",
                                    isLocked ? "opacity-60 grayscale hover:opacity-80 hover:grayscale-0 cursor-pointer" :
                                        "hover:-translate-y-2 hover:shadow-2xl",
                                    isCurrent ? "border-[#5D5CDE] ring-1 ring-[#5D5CDE]/50 shadow-xl shadow-[#5D5CDE]/10" : "border-gray-800 bg-[#13151A]"
                                )}
                            >
                                {/* Thumbnail Image */}
                                <div className="aspect-video relative bg-gray-900">
                                    {milestone.imageUrl ? (
                                        <img src={milestone.imageUrl} alt={milestone.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600">
                                            <Zap size={40} />
                                        </div>
                                    )}

                                    {/* Overlay for Lock/Play */}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        {isLocked ? <Lock size={48} className="text-white drop-shadow-lg" /> : <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm"><ArrowRight size={32} className="text-white" /></div>}
                                    </div>

                                    {/* Lock Icon Persistent if Locked */}
                                    {isLocked && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:opacity-0 transition-opacity">
                                            <Lock size={32} className="text-white/70" />
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <h3 className={cn("text-lg font-bold mb-2 leading-tight", isCompleted ? "text-emerald-400" : "text-white")}>
                                        {milestone.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                                        {milestone.description}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto">
                                        {isLocked ? (
                                            <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 flex items-center gap-2">
                                                <Lock size={12} />
                                                {milestone.price > 0 ? `$${milestone.price.toLocaleString('es-AR')}` : "Requiere Membresía"}
                                            </span>
                                        ) : (
                                            <span className={cn(
                                                "text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2",
                                                isCompleted ? "bg-emerald-500/10 text-emerald-400" : "bg-[#5D5CDE]/10 text-[#5D5CDE]"
                                            )}>
                                                {isCompleted ? "Completado" : index === 0 ? "En curso" : "Desbloqueado"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>

                            {/* Mobile Connector (Line) */}
                            {index < milestones.length - 1 && (
                                <div className="md:hidden absolute left-1/2 bottom-[-32px] w-1 h-8 bg-gray-800 -translate-x-1/2"></div>
                            )}
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
