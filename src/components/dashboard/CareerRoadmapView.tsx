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
    const [selectedCourse, setSelectedCourse] = useState<{ title: string, price: string, id: string } | null>(null);

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

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando Hoja de Ruta...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">No se encontró la carrera.</div>;

    const { milestones, hasActiveSubscription } = data;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Hoja de Ruta</h1>
                <p className="text-gray-400">Completá los pasos para convertirte en un Trader profesional de 0 a 100.</p>
            </header>

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-white/5 md:-translate-x-1/2"></div>

                <div className="space-y-16">
                    {milestones.map((milestone: any, index: number) => {
                        const isEven = index % 2 === 0;
                        const isLast = index === milestones.length - 1;

                        // Milestone Logic Colors/Icons
                        const isCompleted = milestone.completed;
                        const milestoneTitle = index === 0 ? "El camino del inversor" :
                            index === 1 ? "Los 7 Pilares del Éxito en Bolsa" :
                                "Membresía Aurora";

                        // Pricing Logic for Hito 2
                        const showMemberPrice = index === 1 && hasActiveSubscription;
                        const price = index === 1 ? (showMemberPrice ? "$0" : "$7.000") :
                            index === 0 ? "Gratis" : "Suscripción";

                        return (
                            <div key={milestone.id} className={cn(
                                "relative flex items-center gap-8 md:gap-0",
                                isEven ? "md:flex-row" : "md:flex-row-reverse"
                            )}>
                                {/* Circle Indicator */}
                                <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-[#13151A] border-4 border-white/5 flex items-center justify-center -translate-x-1/2 z-10">
                                    {isCompleted ? (
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                    ) : (
                                        <Circle size={12} className="text-gray-600" />
                                    )}
                                </div>

                                {/* Content Card */}
                                <div className="flex-1 pl-12 md:pl-0 md:w-5/12">
                                    <div className={cn(
                                        "bg-[#13151A] p-6 rounded-3xl border transition-all duration-300",
                                        isCompleted ? "border-emerald-500/20" : "border-white/5 hover:border-[#5D5CDE]/30"
                                    )}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Paso {index + 1}</span>
                                            {isCompleted && <span className="text-[10px] font-bold text-emerald-500 uppercase">Completado</span>}
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2">{milestoneTitle}</h3>

                                        <div className="flex items-center gap-3 mb-6">
                                            {index === 1 && showMemberPrice ? (
                                                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">
                                                    Incluido en tu plan
                                                </span>
                                            ) : (
                                                <span className="text-xs font-bold text-gray-400">{price}</span>
                                            )}
                                        </div>

                                        {milestone.type === "COURSE" ? (
                                            <Link
                                                href={isCompleted ? `/cursos/${milestone.courseId}` : `/cursos/${milestone.courseId}`}
                                                className={cn(
                                                    "inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition-all",
                                                    isCompleted ? "bg-emerald-500/10 text-emerald-500" : "bg-[#5D5CDE] text-white hover:shadow-lg hover:shadow-[#5D5CDE]/20"
                                                )}
                                            >
                                                {isCompleted ? "Ver curso" : "Comenzar ahora"}
                                                <ArrowRight size={16} />
                                            </Link>
                                        ) : (
                                            <Link
                                                href="/membresias"
                                                className={cn(
                                                    "inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition-all",
                                                    isCompleted ? "bg-emerald-500/10 text-emerald-500" : "bg-gradient-to-r from-amber-500 to-amber-600 text-white"
                                                )}
                                            >
                                                {isCompleted ? "Membresía Activa" : "Unirse a la Membresía"}
                                                {!isCompleted && <Zap size={16} fill="currentColor" />}
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                {/* Placeholder for opposite side on desktop */}
                                <div className="hidden md:block md:w-5/12"></div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Final Certification Seal */}
            {data.progress === 100 && (
                <div className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-[#1E2235] to-[#13151A] border border-amber-500/30 text-center animate-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Award size={32} className="text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">¡Felicitaciones, Trader!</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">Has completado todos los requisitos de la carrera Trader de 0 a 100. Tu certificado ha sido generado.</p>
                    <button className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20">
                        Descargar Certificado
                    </button>
                </div>
            )}
        </div>
    );
}
