import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, BookOpen, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
    // Placeholder data - will be replaced by DB queries later
    const stats = [
        {
            title: "Ingresos Totales",
            value: "$120,450",
            change: "+12.5% vs mes ant.",
            icon: DollarSign,
            color: "text-emerald-500",
        },
        {
            title: "Estudiantes Activos",
            value: "1,234",
            change: "+5.2% vs mes ant.",
            icon: Users,
            color: "text-blue-500",
        },
        {
            title: "Cursos Publicados",
            value: "12",
            change: "2 nuevos este mes",
            icon: BookOpen,
            color: "text-purple-500",
        },
        {
            title: "Tasa de Conversión",
            value: "3.2%",
            change: "-0.4% vs mes ant.",
            icon: TrendingUp,
            color: "text-amber-500",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 mt-2">Bienvenido al panel de control de Aurora Academy.</p>
            </div>

            {/* KPI Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="bg-[#1F2937] border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity Section (Placeholder) */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-[#1F2937] border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white">Ventas Recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-gray-400">
                            No hay ventas recientes para mostrar. (Próximamente conectado a BD)
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#1F2937] border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white">Estudiantes Recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-gray-400">
                            No hay registros recientes. (Próximamente conectado a BD)
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
