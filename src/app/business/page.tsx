import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle2, ChevronRight, Building2, Users, Trophy } from "lucide-react";
import BusinessForm from "@/components/business/BusinessForm";

export default function BusinessPage() {
    return (
        <main className="min-h-screen bg-[#0B0F19]">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5D5CDE]/10 text-[#5D5CDE] border border-[#5D5CDE]/20 mb-6 animate-in fade-in slide-in-from-bottom-4">
                            <Building2 size={16} />
                            <span className="text-sm font-semibold">Aurora for Business</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-500">
                            Potenciá el bienestar financiero de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5D5CDE] to-[#b3b2f7]">tu equipo</span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            Invertí en el futuro de tus colaboradores con la formación más completa en mercados financieros del mercado hispano.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
                            <a
                                href="#contact-form"
                                className="bg-[#5D5CDE] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#4b4ac0] transition-colors flex items-center justify-center gap-2"
                            >
                                Hablar con un asesor <ChevronRight size={20} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value Props */}
            <section className="py-20 bg-[#111827]">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-[#1F2937]/50 p-8 rounded-2xl border border-gray-800">
                            <div className="bg-[#5D5CDE]/20 w-12 h-12 rounded-xl flex items-center justify-center text-[#5D5CDE] mb-6">
                                <Users size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Gestión Simple</h3>
                            <p className="text-gray-400">
                                Olvidate de gestiones complejas. Asigná licencias con un solo link y monitoreá el uso desde tu panel de empresa.
                            </p>
                        </div>
                        <div className="bg-[#1F2937]/50 p-8 rounded-2xl border border-gray-800">
                            <div className="bg-[#5D5CDE]/20 w-12 h-12 rounded-xl flex items-center justify-center text-[#5D5CDE] mb-6">
                                <Trophy size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Talento Retenido</h3>
                            <p className="text-gray-400">
                                El 78% de los empleados valora la educación financiera como beneficio clave. Aumentá la lealtad de tu equipo.
                            </p>
                        </div>
                        <div className="bg-[#1F2937]/50 p-8 rounded-2xl border border-gray-800">
                            <div className="bg-[#5D5CDE]/20 w-12 h-12 rounded-xl flex items-center justify-center text-[#5D5CDE] mb-6">
                                <CheckCircle2 size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Impacto Real</h3>
                            <p className="text-gray-400">
                                Empleados con menos estrés financiero son 2x más productivos. Te damos las métricas para demostrarlo.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Plans Display (No Buy Button) */}
            <section className="py-20 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Planes flexibles para cada etapa</h2>
                        <p className="text-gray-400">Elegí la duración que mejor se adapte a tu presupuesto anual.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Business Starter */}
                        <div className="relative p-8 rounded-3xl border border-gray-800 bg-[#0B0F19] flex flex-col hover:border-gray-700 transition-colors">
                            <h3 className="text-xl font-bold text-white mb-2">Business Starter</h3>
                            <div className="text-[#5D5CDE] font-semibold text-sm mb-1">1 a 10 Licencias</div>
                            <p className="text-gray-400 text-sm mb-6">PyMEs y equipos pequeños</p>

                            <div className="flex-1 space-y-4 mb-8">
                                <li className="flex gap-3 text-gray-300">
                                    <CheckCircle2 className="text-[#5D5CDE] shrink-0" size={20} />
                                    <span className="text-sm">Precio Fijo por Pack</span>
                                </li>
                                <li className="flex gap-3 text-gray-300">
                                    <CheckCircle2 className="text-[#5D5CDE] shrink-0" size={20} />
                                    <span className="text-sm">Ahorro -20% vs particular</span>
                                </li>
                                <li className="flex gap-3 text-gray-300">
                                    <CheckCircle2 className="text-[#5D5CDE] shrink-0" size={20} />
                                    <span className="text-sm">Pago Único (Acceso de por vida)</span>
                                </li>
                            </div>
                        </div>

                        {/* Business Growth - Highlighted */}
                        <div className="relative p-8 rounded-3xl border border-[#5D5CDE] bg-[#111827] flex flex-col transform md:-translate-y-4 shadow-[0_0_50px_rgba(93,92,222,0.1)]">
                            <div className="absolute top-0 right-0 bg-[#5D5CDE] text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">POPULAR</div>
                            <h3 className="text-xl font-bold text-white mb-2">Business Growth</h3>
                            <div className="text-[#5D5CDE] font-semibold text-sm mb-1">11 a 30 Licencias</div>
                            <p className="text-gray-400 text-sm mb-6">Empresas en crecimiento</p>

                            <div className="flex-1 space-y-4 mb-8">
                                <li className="flex gap-3 text-white">
                                    <CheckCircle2 className="text-[#5D5CDE] shrink-0" size={20} />
                                    <span className="text-sm">Precio por Cupo Reducido</span>
                                </li>
                                <li className="flex gap-3 text-white">
                                    <CheckCircle2 className="text-[#5D5CDE] shrink-0" size={20} />
                                    <span className="text-sm">Dashboard de Métricas Básico</span>
                                </li>
                                <li className="flex gap-3 text-white">
                                    <CheckCircle2 className="text-[#5D5CDE] shrink-0" size={20} />
                                    <span className="text-sm">Pago Único</span>
                                </li>
                                <li className="flex gap-3 text-white">
                                    <CheckCircle2 className="text-[#5D5CDE] shrink-0" size={20} />
                                    <span className="text-sm">Soporte Prioritario</span>
                                </li>
                            </div>
                        </div>

                        {/* Plan Enterprise */}
                        <div className="relative p-8 rounded-3xl border border-gray-800 bg-[#0B0F19] flex flex-col hover:border-gray-700 transition-colors">
                            <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
                            <div className="text-[#5D5CDE] font-semibold text-sm mb-1">+100 Licencias</div>
                            <p className="text-gray-400 text-sm mb-6">Grandes corporaciones</p>

                            <div className="flex-1 space-y-4 mb-8">
                                <li className="flex gap-3 text-gray-300">
                                    <CheckCircle2 className="text-[#5D5CDE] shrink-0" size={20} />
                                    <span className="text-sm">Cotización a Medida</span>
                                </li>
                                <li className="flex gap-3 text-gray-300">
                                    <CheckCircle2 className="text-[#5D5CDE] shrink-0" size={20} />
                                    <span className="text-sm">Soporte Dedicado 24/7</span>
                                </li>
                                <li className="flex gap-3 text-gray-300">
                                    <CheckCircle2 className="text-[#5D5CDE] shrink-0" size={20} />
                                    <span className="text-sm">Reportes Trimestrales</span>
                                </li>
                                <li className="flex gap-3 text-gray-300">
                                    <CheckCircle2 className="text-[#5D5CDE] shrink-0" size={20} />
                                    <span className="text-sm">Integraciones API</span>
                                </li>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section id="contact-form" className="py-20 bg-[#111827]">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-4">Hablemos de tu equipo</h2>
                            <p className="text-gray-400 mb-8">
                                Dejanos tus datos y un especialista en educación corporativa te contactará para armar una propuesta a medida.
                            </p>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 text-gray-300">
                                    <div className="w-10 h-10 rounded-full bg-[#5D5CDE]/10 flex items-center justify-center text-[#5D5CDE]">
                                        <Building2 size={20} />
                                    </div>
                                    <p>Planes desde 5 personas</p>
                                </div>
                                <div className="flex items-center gap-4 text-gray-300">
                                    <div className="w-10 h-10 rounded-full bg-[#5D5CDE]/10 flex items-center justify-center text-[#5D5CDE]">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <p>Factura A disponible</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0B0F19] p-8 rounded-2xl border border-gray-800 shadow-2xl">
                            <BusinessForm />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
