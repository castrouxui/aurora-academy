import { Star, Users, PlayCircle, Instagram, Send, Twitter, BadgeCheck } from "lucide-react";

export function InstructorCard({ totalCourses = 5 }: { totalCourses?: number }) {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-black text-white font-headings">Tu Instructor</h2>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 md:p-10 hover:border-white/[0.1] transition-colors duration-300">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="shrink-0 relative">
                        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-[#5D5CDE]/40 shadow-[0_0_30px_rgba(93,92,222,0.15)]">
                            <img
                                src="/images/francisco-speaking.png"
                                alt="Fran Castro"
                                className="w-full h-full object-cover object-top"
                            />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-[#0B0F19] rounded-full">
                            <BadgeCheck size={28} fill="#0095F6" className="text-white" />
                        </div>
                    </div>

                    <div className="space-y-5 flex-1">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1">Francisco Castro</h3>
                            <p className="text-[#5D5CDE] font-medium text-sm">
                                Lic. en Adm. de Empresas & Asesor Bursátil CNV (Mat. 2688)
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                            <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                                <Star size={13} className="text-yellow-500 fill-yellow-500" />
                                <span className="text-white font-bold">4.9</span>
                                <span>Calificación</span>
                            </div>
                            <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                                <Users size={13} className="text-[#5D5CDE]" />
                                <span className="text-white font-bold">+1,000</span>
                                <span className="hidden sm:inline">Estudiantes</span>
                            </div>
                            <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                                <PlayCircle size={13} className="text-[#5D5CDE]" />
                                <span className="text-white font-bold">{totalCourses}</span>
                                <span>Cursos</span>
                            </div>
                        </div>

                        {/* First-person paragraph */}
                        <blockquote className="text-gray-300 leading-relaxed text-sm border-l-2 border-[#5D5CDE]/30 pl-4 italic">
                            &ldquo;Creé este curso porque creo que todos deberían tener acceso a educación financiera de calidad, sin humo ni falsas promesas. Mi objetivo es que termines con las herramientas para tomar decisiones informadas sobre tu dinero, sin depender de nadie.&rdquo;
                        </blockquote>

                        <p className="text-gray-400 leading-relaxed text-sm">
                            CEO de Aurora Advisors y co-fundador de Aurora Academy. Con más de 10 años en el sector bursátil, su misión es democratizar el acceso al conocimiento financiero profesional.
                        </p>

                        <div className="flex items-center gap-3 pt-1">
                            <a href="https://www.instagram.com/auroradvisorsok/" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/[0.04] rounded-full hover:bg-[#E1306C]/20 hover:text-[#E1306C] text-gray-500 transition-colors border border-white/[0.06]">
                                <Instagram size={16} />
                            </a>
                            <a href="https://t.me/Auroradvisors" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/[0.04] rounded-full hover:bg-[#0088cc]/20 hover:text-[#0088cc] text-gray-500 transition-colors border border-white/[0.06]">
                                <Send size={16} />
                            </a>
                            <a href="https://twitter.com/francastromt" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/[0.04] rounded-full hover:bg-white/10 hover:text-white text-gray-500 transition-colors border border-white/[0.06]">
                                <Twitter size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
