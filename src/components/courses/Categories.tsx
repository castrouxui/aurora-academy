import { TrendingUp, Bitcoin, Wallet, PiggyBank, LineChart, Bot } from "lucide-react";
import { Container } from "@/components/layout/Container";

const categories = [
    { name: "Trading", count: "Programa Completo", icon: TrendingUp },
    { name: "Finanzas Personales", count: "Curso Intensivo", icon: PiggyBank },
    { name: "Fondos Comunes de Inversión", count: "Curso Especializado", icon: LineChart },
    { name: "IA + Inversiones", count: "Masterclass", icon: Bot },
    { name: "Cripto", count: "Próximamente", icon: Bitcoin, status: "coming_soon" },
    { name: "Bonos", count: "Próximamente", icon: Wallet, status: "coming_soon" },
];

export function Categories() {
    return (
        <section id="categories" className="py-16">
            <Container>
                <h2 className="text-3xl font-bold text-center mb-8 md:mb-12 text-white">Categorías principales</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat, i) => (
                        <div key={i} className="bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-300 p-6 rounded-2xl flex items-center gap-4 cursor-pointer group hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/5">
                            <div className="p-3 bg-white/5 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <cat.icon size={28} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-base flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 group-hover:text-primary transition-colors">
                                    {cat.name}
                                    {cat.status === "coming_soon" && (
                                        <span className="text-[10px] bg-white/10 text-gray-300 border border-white/10 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider w-fit">
                                            Próximamente
                                        </span>
                                    )}
                                </h3>
                                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                    {cat.status === "coming_soon" ? "Disponible pronto" : cat.count}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
