import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function RoadmapBanner() {
    return (
        <div className="relative w-full overflow-hidden rounded-2xl bg-[#09090b] border border-[#10b981]/20 shadow-[0_0_30px_-15px_rgba(16,185,129,0.15)] group">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#10b981]/5 to-transparent opacity-50" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#10b981]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative flex flex-col md:flex-row items-center justify-between p-6 md:p-8 gap-6 md:gap-12">

                {/* Left: Progress Narrative */}
                <div className="flex flex-col sm:flex-row items-center md:items-start gap-6 shrink-0">
                    <div className="relative flex flex-col items-center">
                        {/* Vertical Line */}
                        <div className="absolute top-8 bottom-0 w-0.5 bg-gradient-to-b from-[#10b981] to-[#27272a] h-12 md:h-full left-1/2 -translate-x-1/2" />

                        {/* Completed Node */}
                        <div className="relative z-10 w-8 h-8 rounded-full bg-[#10b981]/10 border border-[#10b981] flex items-center justify-center mb-8 md:mb-1">
                            <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                        </div>
                        {/* Active Node (Visual trick for vertical alignment on mobile, horizontal on desktop if needed, keeping simple vertical stack for icon) */}
                    </div>

                    <div className="flex flex-col gap-6 md:gap-2">
                        {/* Step 1 */}
                        <div className="flex items-center gap-3 opacity-60">
                            <span className="text-xs font-mono text-[#10b981] uppercase tracking-wider">Completado</span>
                            <span className="text-sm font-medium text-gray-400">Fundamentos</span>
                        </div>

                        {/* Step 2 - Current/Next */}
                        <div className="flex items-center gap-3">
                            <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10b981]"></span>
                            </div>
                            <span className="text-xs font-mono text-[#10b981] uppercase tracking-wider">Siguiente Nivel</span>
                            <span className="text-sm font-bold text-white text-shadow-sm shadow-[#10b981]/50">Maestría</span>
                        </div>
                    </div>
                </div>

                {/* Center: Copy */}
                <div className="text-center md:text-left flex-1 max-w-2xl">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
                        Tu hoja de ruta: <span className="text-[#10b981]">De 0 a 100</span>
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                        Has dominado los fundamentos. El acceso completo a las estrategias avanzadas, mentorías y comunidad te espera.
                    </p>
                </div>

                {/* Right: CTA */}
                <Link href="/membresias" className="shrink-0 w-full md:w-auto">
                    <button className="w-full md:w-auto relative group overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:ring-offset-2 focus:ring-offset-slate-900">
                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#09090b_0%,#10b981_50%,#09090b_100%)]" />
                        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#09090b] px-8 py-3 text-sm font-medium text-white backdrop-blur-3xl transition-all group-hover:bg-[#10b981]/10">
                            <span className="flex items-center gap-2">
                                Desbloquear Acceso Total
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </span>
                    </button>
                </Link>

            </div>
        </div>
    );
}
