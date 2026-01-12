import { Star, Users, PlayCircle } from "lucide-react";
// import Image from "next/image";

export function InstructorCard() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-white font-headings">Tu Instructor</h2>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-start hover:bg-white/10 transition-colors duration-300">
                <div className="shrink-0 relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#5D5CDE] shadow-[0_0_20px_rgba(93,92,222,0.3)]">
                        {/* Placeholder for instructor image - replacing with a colored div if no image */}
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-white font-bold text-3xl">
                            FC
                        </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-[#5D5CDE] text-white text-xs font-bold px-2 py-1 rounded-lg border border-[#0B0F19]">
                        VERIFICADO
                    </div>
                </div>

                <div className="space-y-4 flex-1">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-1">Fran Castro</h3>
                        <p className="text-[#5D5CDE] font-medium">Fundador de Aurora Academy & Trader Profesional</p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-white font-bold">4.9</span>
                            <span>Calificación</span>
                        </div>
                        <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                            <Users size={14} className="text-[#5D5CDE]" />
                            <span className="text-white font-bold">15,000+</span>
                            <span>Estudiantes</span>
                        </div>
                        <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                            <PlayCircle size={14} className="text-[#5D5CDE]" />
                            <span className="text-white font-bold">5</span>
                            <span>Cursos</span>
                        </div>
                    </div>

                    <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                        Fran es un apasionado de los mercados financieros con más de 8 años de experiencia. Ha ayudado a miles de estudiantes a entender el trading desde una perspectiva profesional, enfocándose en la gestión de riesgo y la psicología.
                    </p>
                </div>
            </div>
        </div>
    );
}
