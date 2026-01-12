import { Star, Users, PlayCircle, Instagram, Send, Twitter, BadgeCheck } from "lucide-react";
// import Image from "next/image";

export function InstructorCard() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-white font-headings">Tu Instructor</h2>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-start hover:bg-white/10 transition-colors duration-300">
                <div className="shrink-0 relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#5D5CDE] shadow-[0_0_20px_rgba(93,92,222,0.3)]">
                        <img
                            src="/images/francisco-speaking.png"
                            alt="Fran Castro"
                            className="w-full h-full object-cover object-top"
                        />
                    </div>
                    {/* Verified Badge Icon */}
                    <div className="absolute bottom-1 right-1 bg-[#0B0F19] rounded-full text-[#5D5CDE]">
                        <BadgeCheck size={28} fill="#0B0F19" className="text-[#5D5CDE]" />
                    </div>
                </div>

                <div className="space-y-4 flex-1 text-center md:text-left">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-1">Francisco Castro</h3>
                        <p className="text-[#5D5CDE] font-medium text-sm md:text-base">
                            Lic. en Adm. de Empresas & Asesor Bursátil CNV (Mat. 2688)
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-white font-bold">4.9</span>
                            <span>Calificación</span>
                        </div>
                        <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                            <Users size={14} className="text-[#5D5CDE]" />
                            <span className="text-white font-bold">+1,000</span>
                            <span className="hidden sm:inline">Estudiantes</span>
                        </div>
                        <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                            <PlayCircle size={14} className="text-[#5D5CDE]" />
                            <span className="text-white font-bold">5</span>
                            <span>Cursos</span>
                        </div>
                    </div>

                    <p className="text-gray-300 leading-relaxed text-sm">
                        CEO de Aurora Advisors y fundador de Aurora Academy. Con más de 10 años en el sector bursátil, su misión es democratizar el acceso al conocimiento financiero profesional, enseñando no solo a invertir, sino a entender el porqué detrás de cada decisión.
                    </p>

                    <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                        <a href="https://www.instagram.com/auroradvisorsok/" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-[#E1306C]/20 hover:text-[#E1306C] text-gray-400 transition-colors border border-white/5">
                            <Instagram size={18} />
                        </a>
                        <a href="https://t.me/Auroradvisors" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-[#0088cc]/20 hover:text-[#0088cc] text-gray-400 transition-colors border border-white/5">
                            <Send size={18} />
                        </a>
                        <a href="https://twitter.com/francastromt" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-white/10 hover:text-white text-gray-400 transition-colors border border-white/5">
                            <Twitter size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
