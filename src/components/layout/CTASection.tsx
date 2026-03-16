import { Container } from "@/components/layout/Container";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const reasons = [
    {
        title: "Aprendé Haciendo",
        desc: "Analizamos el mercado en vivo y operamos con dinero real desde el día 1. Sin teoría vacía.",
    },
    {
        title: "Comunidad VIP",
        desc: "Acceso exclusivo a Telegram con señales, análisis diario y networking con traders activos.",
    },
    {
        title: "Mentoría Garantizada",
        desc: "Acceso directo a tus instructores para revisar tus operaciones y resolver dudas en tiempo real.",
    },
];

export function CTASection() {
    return (
        <section className="py-28 md:py-36 border-b border-white/6">
            <Container>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <h2 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white leading-tight max-w-md">
                        ¿Por qué elegir<br />
                        <span className="text-[#5D5CDE]">Aurora?</span>
                    </h2>
                    <p className="text-gray-500 text-base max-w-xs leading-relaxed md:text-right">
                        No somos solo una academia. Somos tu puente hacia la libertad financiera.
                    </p>
                </div>

                {/* Reasons — 3 columns with dividers */}
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/6 mb-24">
                    {reasons.map((r, i) => (
                        <div key={i} className="py-10 md:py-0 md:px-10 first:pl-0 last:pr-0">
                            <span className="text-xs font-bold text-[#5D5CDE] tracking-[0.2em] block mb-4">0{i + 1}</span>
                            <h3 className="text-xl font-bold text-white font-display mb-3">{r.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{r.desc}</p>
                        </div>
                    ))}
                </div>

                {/* CTA Block */}
                <div className="border border-white/8 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 bg-white/[0.02]">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#5D5CDE] mb-4">Comenzá hoy</p>
                        <h3 className="text-3xl md:text-4xl font-black font-display text-white tracking-tight leading-tight">
                            Unite a la comunidad Aurora
                        </h3>
                    </div>
                    <Link href="/membresias" className="shrink-0">
                        <button className="group h-14 px-10 rounded-xl bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white font-bold text-base transition-colors flex items-center gap-3 whitespace-nowrap">
                            Ver planes
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </div>

            </Container>
        </section>
    );
}
