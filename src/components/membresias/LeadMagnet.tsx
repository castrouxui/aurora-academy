import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

export function LeadMagnet() {
    return (
        <div className="w-full max-w-6xl mx-auto mt-16 md:mt-24 mb-16 md:mb-20">
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-transparent backdrop-blur-sm px-8 py-8 md:py-10 shadow-xl">
                {/* Subtle accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    {/* Text Content - Left Aligned */}
                    <div className="flex-1 text-left space-y-1">
                        <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white font-display">
                            ¿Todavía no estás listo?
                        </h3>
                        <p className="text-base text-gray-400 font-normal">
                            Empezá gratis con <span className="font-semibold text-emerald-400">"El camino del inversor"</span>
                        </p>
                    </div>

                    {/* Button - Right Aligned */}
                    <Button
                        onClick={() => {
                            // TODO: Configure redirect URL or modal
                            window.location.href = "/cursos/el-camino-del-inversor";
                        }}
                        className="w-full md:w-auto shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-6 md:py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30 border border-emerald-500/30 hover:border-emerald-500/50"
                    >
                        Ver clase gratuita
                    </Button>
                </div>
            </div>
        </div>
    );
}
