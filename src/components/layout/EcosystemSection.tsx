import { Container } from "@/components/layout/Container";

export function EcosystemSection() {
    return (
        <section className="py-24 bg-gradient-to-b from-[#0B0F19] to-[#111827] relative overflow-hidden">
            {/* Divider Line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>

            <Container>
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Más que cursos, un ecosistema</h2>
                    <p className="text-gray-400">
                        La educación financiera efectiva requiere constancia. Te damos las herramientas para que no solo aprendas, sino que apliques y rentabilices.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            title: "Mentoría en Vivo",
                            desc: "Clases semanales para analizar el mercado real junto a expertos.",
                            icon: "⚡"
                        },
                        {
                            title: "Comunidad VIP",
                            desc: "Conectá con otros traders, compartí análisis y operá acompañado.",
                            icon: "🤝"
                        },
                        {
                            title: "Soporte 24/7",
                            desc: "Canal directo para resolver todas tus dudas técnicas y teóricas.",
                            icon: "💬"
                        },
                        {
                            title: "Certificación",
                            desc: "Obtené diplomas verificables al completar cada trayecto educativo.",
                            icon: "🎓"
                        }
                    ].map((item, i) => (
                        <div key={i} className="bg-[#1F2937]/30 border border-gray-800 p-8 rounded-3xl hover:bg-[#1F2937]/50 transition-all text-center group hover:scale-105 duration-300">
                            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300 transform inline-block filter drop-shadow-lg">{item.icon}</div>
                            <h3 className="text-white text-lg font-bold mb-3">{item.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
