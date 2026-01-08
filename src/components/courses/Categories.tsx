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
                <h2 className="text-3xl font-bold text-center mb-12 text-white">Categorías principales</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat, i) => (
                        <div key={i} className="bg-[#FFF5F1] hover:bg-white transition-colors p-6 rounded-xl flex items-center gap-4 cursor-pointer group hover:shadow-lg">
                            <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-primary/10 text-orange-500 group-hover:text-primary transition-colors">
                                <cat.icon size={28} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                    {cat.name}
                                    {cat.status === "coming_soon" && (
                                        <span className="text-[9px] sm:text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase font-bold tracking-wider w-fit">
                                            Próximamente
                                        </span>
                                    )}
                                </h3>
                                <p className="text-xs text-gray-500">
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
