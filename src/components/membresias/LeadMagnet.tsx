import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

export function LeadMagnet() {
    return (
        <div className="w-full max-w-4xl mx-auto mb-8 md:mb-12">
            <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-950/50 via-emerald-900/30 to-transparent backdrop-blur-sm p-6 md:p-8 shadow-2xl shadow-emerald-900/20">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-start gap-4 text-left flex-1">
                        <div className="hidden md:flex shrink-0 w-12 h-12 rounded-full bg-emerald-500/20 items-center justify-center border border-emerald-500/30">
                            <Gift className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                                ¿Todavía no estás listo?
                            </h3>
                            <p className="text-sm md:text-base text-gray-300">
                                Empezá gratis con <span className="font-semibold text-emerald-400">&quot;El camino del inversor&quot;</span>
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={() => {
                            // TODO: Configure redirect URL or modal
                            window.location.href = "/cursos/el-camino-del-inversor";
                        }}
                        className="w-full md:w-auto shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30 border border-emerald-500/50"
                    >
                        Ver clase gratuita ahora
                    </Button>
                </div>
            </div>
        </div>
    );
}
