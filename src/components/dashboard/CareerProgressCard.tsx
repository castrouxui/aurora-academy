"use client";

import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Award, Lock, CheckCircle2, Zap } from 'lucide-react';
import Link from 'next/link';
import { getCareerProgress } from '@/actions/career';
import { cn } from '@/lib/utils';

interface CareerProgressCardProps {
    userId: string;
    careerReferenceId: string;
}

export function CareerProgressCard({ userId, careerReferenceId }: CareerProgressCardProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getCareerProgress(userId, careerReferenceId);
                setData(result);
            } catch (error) {
                console.error("Error fetching career progress:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId && careerReferenceId) {
            fetchData();
        }
    }, [userId, careerReferenceId]);

    if (loading) {
        return (
            <div className="bg-[#13151A] rounded-[2rem] p-8 border border-white/5 animate-pulse">
                <div className="h-4 w-24 bg-white/10 rounded-full mb-6"></div>
                <div className="h-10 w-48 bg-white/10 rounded-xl mb-4"></div>
                <div className="h-4 w-full bg-white/10 rounded-lg mb-8"></div>
                <div className="h-12 w-full bg-white/10 rounded-2xl"></div>
            </div>
        );
    }

    if (!data) return null;

    const { progress, careerName } = data;

    // Determine dynamic copy
    let statusCopy = "¡Buen comienzo! Siguiente paso: Los 7 Pilares";
    if (progress === 0) {
        statusCopy = "Comenzá tu formación profesional hoy mismo";
    } else if (progress >= 33 && progress < 66) {
        statusCopy = "Llevás buen ritmo. Continuá con Los 7 Pilares";
    } else if (progress >= 66 && progress < 100) {
        statusCopy = "Casi sos profesional. Sumate a la Membresía para finalizar";
    } else if (progress === 100) {
        statusCopy = "¡Felicitaciones! Has completado la ruta con éxito";
    }

    return (
        <div className="bg-[#13151A] rounded-[2rem] p-8 border border-white/10 relative overflow-hidden group hover:border-[#5D5CDE]/30 transition-all duration-500 shadow-2xl hover:shadow-[#5D5CDE]/5">
            {/* Mesh Gradient Background */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#5D5CDE]/10 blur-[60px] pointer-events-none group-hover:bg-[#5D5CDE]/20 transition-all duration-700"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-black text-[#5D5CDE] uppercase tracking-[0.2em] bg-[#5D5CDE]/10 px-3 py-1.5 rounded-full border border-[#5D5CDE]/20">
                        Ruta Profesional
                    </span>
                    <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                        <span className="text-white font-black text-xs">{progress}%</span>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-[#5D5CDE] transition-colors">{careerName}</h3>
                <p className="text-xs font-semibold text-white/50 mb-8 leading-relaxed max-w-[240px]">{statusCopy}</p>

                {/* Refined Segmented Progress Bar */}
                <div className="flex gap-1.5 h-1.5 mb-10">
                    {[33, 67, 100].map((step) => (
                        <div
                            key={step}
                            className={cn(
                                "flex-1 rounded-full transition-all duration-700",
                                progress >= step
                                    ? "bg-gradient-to-r from-[#5D5CDE] to-[#7B7AEC]"
                                    : "bg-white/[0.05]"
                            )}
                        />
                    ))}
                </div>

                <Link
                    href={`/dashboard/carrera/${careerReferenceId}`}
                    className="flex items-center justify-between w-full bg-white/[0.03] hover:bg-[#5D5CDE] text-white px-6 py-4 rounded-2xl text-sm font-black transition-all group-hover:shadow-xl group-hover:shadow-[#5D5CDE]/20 border border-white/5 hover:border-[#5D5CDE]/20"
                >
                    <span>Continuar Carrera</span>
                    <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        </div>
    );
}
