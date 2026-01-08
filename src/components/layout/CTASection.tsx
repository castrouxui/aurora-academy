import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import Image from "next/image";
import Link from "next/link";

export function CTASection() {
    return (
        <section className="py-24">
            <Container>
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Promo Card (Left) */}
                    <div className="relative overflow-hidden rounded-3xl bg-[#4F46E5] p-8 text-white shadow-2xl md:p-12">
                        <div className="relative z-10 max-w-lg">
                            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                                Trader de 0 a 100
                            </h2>
                            <p className="mb-8 text-indigo-100 md:text-lg">
                                Domina la psicología, el análisis técnico y la gestión de riesgo.
                                Instructores expertos te guían desde los fundamentos hasta tu primera operación rentable.
                            </p>
                            <Link href="/pricing">
                                <Button className="h-12 bg-white px-8 text-base font-semibold text-[#4F46E5] hover:bg-gray-100">
                                    Empezar
                                </Button>
                            </Link>
                        </div>

                        {/* Decorative Circle */}
                        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>

                        {/* Ideally we would have a real image of a person here like in the reference. 
                Using a placeholder or decorative element for now. */}
                        <div className="absolute bottom-0 right-0 hidden h-64 w-64 translate-x-12 translate-y-12 items-end justify-center md:flex opacity-20 lg:opacity-100 mix-blend-soft-light">
                            {/* Placeholder graphic until user provides image */}
                            <div className="h-48 w-48 rounded-t-full bg-white/20 blur-xl"></div>
                        </div>
                    </div>

                    {/* Steps Card (Right) */}
                    <div className="rounded-3xl bg-white p-8 shadow-xl md:p-12 text-slate-900">
                        <h2 className="mb-8 text-3xl font-bold">Pasos de aprendizaje</h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            <StepItem
                                number="1"
                                text="Domina los Fundamentos"
                                bg="bg-indigo-100 text-indigo-700"
                            />
                            <StepItem
                                number="2"
                                text="Análisis Técnico Profundo"
                                bg="bg-orange-100 text-orange-700"
                            />
                            <StepItem
                                number="3"
                                text="Gestión de Riesgo y Psicología"
                                bg="bg-red-100 text-red-700"
                            />
                            <StepItem
                                number="4"
                                text="Tu Primera Operación Real"
                                bg="bg-emerald-100 text-emerald-700"
                            />
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}

function StepItem({ number, text, bg }: { number: string; text: string; bg: string }) {
    return (
        <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-bold text-xl ${bg}`}>
                {number}
            </div>
            <p className="font-medium text-slate-700">{text}</p>
        </div>
    );
}
