import { Container } from "@/components/layout/Container";

const pillars = [
    { num: "01", title: "Mentoría en Vivo", desc: "Clases semanales para analizar el mercado real junto a expertos con experiencia activa en los mercados financieros." },
    { num: "02", title: "Comunidad VIP", desc: "Conectá con otros traders en nuestro Telegram exclusivo. Señales diarias, análisis compartido y networking real." },
    { num: "03", title: "Soporte 24/7", desc: "Canal directo con tus instructores para resolver dudas técnicas y operativas en el momento que lo necesités." },
    { num: "04", title: "Certificación", desc: "Obtené diplomas verificables al completar cada trayecto. Respaldo profesional que acompaña tu carrera." },
];

export function EcosystemSection() {
    return (
        <section className="py-28 md:py-36 border-b border-white/6">
            <Container>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <h2 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white leading-tight max-w-md">
                        Más que cursos,<br />un ecosistema.
                    </h2>
                    <p className="text-gray-500 text-base max-w-xs leading-relaxed md:text-right">
                        Todo lo que necesitás para aprender, aplicar y crecer en los mercados financieros.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/6">
                    {pillars.map((item) => (
                        <div key={item.num} className="bg-[#0B0F19] p-10 group hover:bg-white/[0.02] transition-colors">
                            <span className="text-xs font-bold text-[#5D5CDE] tracking-[0.2em] block mb-6">{item.num}</span>
                            <h3 className="text-xl font-bold text-white mb-3 font-display">{item.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
