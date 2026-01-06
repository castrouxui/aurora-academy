
import { PricingCard } from "@/components/pricing/PricingCard";
import { PricingCheckmark } from "@/components/pricing/PricingCheckmark";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";

export default function PricingPage() {
    const tradingPlans = [
        {
            title: "Inicial",
            price: "$40.000",
            periodicity: "único",
            students: "Nivel Básico",
            features: [
                "Introducción a los Mercados",
                "Análisis Técnico Básico",
                "Gestión de Riesgo I",
                "Acceso a Comunidad Discord",
            ],
            isRecommended: false,
        },
        {
            title: "Intermedio",
            price: "$100.000",
            periodicity: "único",
            students: "Nivel Intermedio",
            features: [
                "Estrategias de Trading",
                "Psicotrading",
                "Análisis Fundamental",
                "Sesiones en Vivo (Grabadas)",
            ],
            isRecommended: false,
        },
        {
            title: "Avanzado",
            price: "$150.000",
            periodicity: "único",
            students: "Nivel Profesional",
            features: [
                "Smart Money Concepts",
                "Trading Institucional",
                "Mentoría 1 a 1",
                "Acceso Vitalicio",
            ],
            isRecommended: false,
        },
    ];

    const bundlePlan = {
        title: "Trader de 0 a 100",
        price: "$250.000",
        periodicity: "único",
        students: "Bundle Completo",
        features: [
            "Todo el contenido de Inicial, Intermedio y Avanzado",
            "Descuento especial por paquete",
            "Certificación Integral",
            "Acceso prioritario a eventos",
        ],
        isRecommended: true,
        buttonText: "Obtener Oferta Completa",
    };

    const otherCourses = [
        { title: "Finanzas Personales", price: "Consultar" },
        { title: "Fondos Comunes de Inversión", price: "Consultar" },
        { title: "IA + Inversiones", price: "Consultar" },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden py-16 sm:py-24">
                <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50 blur-3xl"></div>
                <div className="relative z-10 mx-auto max-w-7xl px-6 text-center lg:px-8">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        Formación Profesional
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
                        Desde tus primeros pasos hasta operar como un profesional.
                        Elige tu nivel o lleva el paquete completo.
                    </p>
                </div>
            </section>

            {/* Trading Path Section */}
            <section className="relative z-10 mx-auto max-w-7xl px-6 pb-16 lg:px-8">
                <h2 className="mb-12 text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    Carrera de Trading
                </h2>

                {/* Individual Levels */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-12">
                    {tradingPlans.map((plan, index) => (
                        <PricingCard key={index} {...plan} />
                    ))}
                </div>

                {/* Bundle Card (Full Width Highlight) */}
                <div className="mx-auto max-w-4xl">
                    <div className="relative rounded-3xl border border-primary bg-card/60 p-8 shadow-2xl backdrop-blur-sm md:p-12">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-bold text-primary-foreground shadow-lg">
                            RECOMENDADO
                        </div>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
                            <div>
                                <h3 className="text-3xl font-bold text-foreground">{bundlePlan.title}</h3>
                                <p className="mt-2 text-muted-foreground">La formación definitiva para dominar los mercados.</p>
                                <ul className="mt-6 space-y-3">
                                    {bundlePlan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <PricingCheckmark />
                                            <span className="text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="text-center rounded-2xl bg-background/50 p-6 border border-gray-800">
                                <p className="text-sm font-medium text-gray-400">Precio Paquete</p>
                                <div className="mt-2 flex items-baseline justify-center gap-1">
                                    <span className="text-5xl font-extrabold tracking-tight text-foreground">
                                        {bundlePlan.price}
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-accent">ahorras comprando el bundle</p>
                                <Button className="mt-6 w-full text-lg h-12" size="lg">
                                    {bundlePlan.buttonText}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Other Courses Section */}
            <section className="py-16 bg-card/20 border-t border-gray-800">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h2 className="mb-8 text-center text-3xl font-bold">
                        Otros Cursos Especializados
                    </h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {otherCourses.map((course, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col justify-between rounded-xl border border-gray-800 bg-card p-6 transition-colors hover:border-gray-700 hover:bg-card/80"
                            >
                                <div>
                                    <h3 className="text-xl font-semibold text-foreground">
                                        {course.title}
                                    </h3>
                                    <p className="mt-4 text-sm text-gray-400">
                                        Impulsa tus conocimientos en áreas específicas.
                                    </p>
                                </div>
                                <div className="mt-6">
                                    <Button variant="outline" className="w-full">
                                        Ver Detalles
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
