import { LayoutGrid, BarChart3, PieChart, TrendingUp, Bitcoin, Wallet } from "lucide-react";

const categories = [
    { name: "Trading", count: "38,929 Cursos", icon: TrendingUp },
    { name: "Ecommerces", count: "48,119 Cursos", icon: Wallet },
    { name: "Inversiones Ws", count: "29,789 Cursos", icon: BarChart3 },
    { name: "Cripto", count: "29,111 Cursos", icon: Bitcoin },
    { name: "Forex", count: "11,889 Cursos", icon: LayoutGrid },
    { name: "Bolsa", count: "16,889 Cursos", icon: PieChart },
    { name: "Indices", count: "9,991 Cursos", icon: TrendingUp },
    { name: "ETF", count: "9,991 Cursos", icon: PieChart },
    { name: "Bonos", count: "9,991 Cursos", icon: Wallet },
    { name: "DeFi", count: "891 Cursos", icon: Bitcoin },
];

export function Categories() {
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-white">Categorías principales</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {categories.slice(0, 10).map((cat, i) => ( // Showing top 10 as per design logic
                        <div key={i} className="bg-[#FFF5F1] hover:bg-white transition-colors p-4 rounded-xl flex items-center gap-4 cursor-pointer group hover:shadow-lg">
                            <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-primary/10 text-orange-500 group-hover:text-primary transition-colors">
                                <cat.icon size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">{cat.name}</h3>
                                <p className="text-xs text-gray-500">{cat.count}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-8">
                    <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors">
                        Ver todas las categorías ▼
                    </button>
                </div>
            </div>
        </section>
    );
}
