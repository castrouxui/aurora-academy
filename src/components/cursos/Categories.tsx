import { TrendingUp, Bitcoin, Wallet, PiggyBank, LineChart, Bot } from "lucide-react";
import { Container } from "@/components/layout/Container";
import Link from "next/link";

const categories = [
    { name: "Trading", tag: "Programa Completo", icon: TrendingUp },
    { name: "Finanzas Personales", tag: "Curso Intensivo", icon: PiggyBank },
    { name: "Fondos de Inversión", tag: "Curso Especializado", icon: LineChart },
    { name: "IA + Inversiones", tag: "Masterclass", icon: Bot },
    { name: "Cripto", tag: "Próximamente", icon: Bitcoin, soon: true },
    { name: "Bonos", tag: "Curso Especializado", icon: Wallet },
];

export function Categories() {
    return (
        <section id="categories" className="py-28 md:py-36 border-b border-white/6">
            <Container>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <h2 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white leading-tight max-w-md">
                        ¿Qué querés<br />aprender?
                    </h2>
                    <Link href="/cursos">
                        <span className="text-sm font-semibold text-[#5D5CDE] hover:underline">Ver todos los cursos →</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/6">
                    {categories.map((cat, i) => (
                        <div
                            key={i}
                            className={`bg-[#0B0F19] p-8 group hover:bg-white/[0.02] transition-colors ${cat.soon ? "opacity-50 cursor-default" : "cursor-pointer"}`}
                        >
                            <div className="flex items-start justify-between mb-6">
                                <cat.icon size={22} className="text-[#5D5CDE]" />
                                {cat.soon && (
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 border border-white/8 px-2 py-1 rounded-full">
                                        Pronto
                                    </span>
                                )}
                            </div>
                            <h3 className="font-bold text-white text-base mb-1 font-display group-hover:text-[#5D5CDE] transition-colors">
                                {cat.name}
                            </h3>
                            <p className="text-xs text-gray-600 uppercase tracking-widest font-medium">
                                {cat.tag}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
