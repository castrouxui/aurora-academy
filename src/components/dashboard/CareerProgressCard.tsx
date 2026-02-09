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
            console.log(`[DEBUG] CareerProgressCard: Fetching for user ${userId} and career ${careerReferenceId}`);
            try {
                const result = await getCareerProgress(userId, careerReferenceId);
                console.log("[DEBUG] CareerProgressCard: Result received", result ? "YES" : "NO");
                setData(result);
            } catch (error) {
                console.error("[DEBUG] CareerProgressCard: Error fetching", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId && careerReferenceId) {
            fetchData();
        } else {
            console.log("[DEBUG] CareerProgressCard: Missing userId or careerReferenceId", { userId, careerReferenceId });
            setLoading(false);
        }
    }, [userId, careerReferenceId]);

    if (loading) {
        return (
            <div className="bg-[#13151A] rounded-2xl p-6 border border-white/5 animate-pulse">
                <p className="text-[10px] text-gray-500 mb-2">Debug: Loading Career Data...</p>
                <div className="h-4 w-24 bg-white/10 rounded mb-4"></div>
                <div className="h-8 w-48 bg-white/10 rounded mb-6"></div>
                <div className="h-2 w-full bg-white/10 rounded"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="bg-[#13151A]/50 rounded-2xl p-4 border border-dashed border-white/10 text-center">
                <p className="text-xs text-gray-500">Debug: No se pudo cargar la ruta (careerRefernceId: {careerReferenceId})</p>
            </div>
        );
    }

    const { progress, careerName, milestones } = data;

    // Determine dynamic copy
    let statusCopy = "¡Buen comienzo! Siguiente paso: Los 7 Pilares";
    if (progress === 0) {
        statusCopy = "¡Comenzá tu ruta hacia el profesionalismo!";
    } else if (progress >= 33 && progress < 66) {
        statusCopy = "¡Buen comienzo! Siguiente paso: Los 7 Pilares";
    } else if (progress >= 66 && progress < 100) {
        statusCopy = "Casi sos un profesional. Sumate a la Membresía para finalizar";
    } else if (progress === 100) {
        statusCopy = "¡Felicitaciones! Has completado la ruta.";
    }

    return (
        <div className="bg-[#13151A] rounded-3xl p-6 border border-white/10 relative overflow-hidden group hover:border-[#5D5CDE]/30 transition-all duration-300 shadow-xl">
            {/* Background Gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#5D5CDE]/10 blur-[50px] pointer-events-none group-hover:bg-[#5D5CDE]/20 transition-all"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#5D5CDE] uppercase tracking-widest bg-[#5D5CDE]/10 px-2 py-1 rounded-md border border-[#5D5CDE]/20">
                        Ruta de Carrera
                    </span>
                    <span className="text-white font-bold text-sm">{progress}%</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{careerName}</h3>
                <p className="text-xs text-gray-400 mb-6">{statusCopy}</p>

                {/* Segmented Progress Bar */}
                <div className="flex gap-1 h-2 mb-8">
                    {[33, 67, 100].map((step) => (
                        <div
                            key={step}
                            className={cn(
                                "flex-1 rounded-full transition-all duration-500",
                                progress >= step ? "bg-[#5D5CDE]" : "bg-white/10"
                            )}
                        />
                    ))}
                </div>

                <Link
                    href={`/dashboard/carrera/${careerReferenceId}`}
                    className="flex items-center justify-between w-full bg-white/5 hover:bg-[#5D5CDE] text-white px-4 py-3 rounded-xl text-sm font-bold transition-all group-hover:shadow-lg group-hover:shadow-[#5D5CDE]/20"
                >
                    <span>Continuar Carrera</span>
                    <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        </div>
    );
}
