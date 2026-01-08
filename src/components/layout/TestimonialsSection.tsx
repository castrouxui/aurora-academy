
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Quote } from "lucide-react";

interface Testimonial {
    id: number;
    author: string;
    text: string;
    image: string;
}

const TESTIMONIALS: Testimonial[] = [
    {
        id: 1,
        author: "Ezequiel",
        text: "Respecto al servicio estoy con Fran hace poco más de 6 meses ininterrumpidos. La verdad que mi satisfacción es absoluta. Excelente resultados y gran profesor! Recién arrancamos.",
        image: "https://framerusercontent.com/images/p7bvoFnbGtK8RZ1HSLiAUiHxx8.jpg"
    },
    {
        id: 2,
        author: "Pato Touceda",
        text: "Estoy muy contento con el servicio, sobre todo y lo más valioso la predisposición a responder y estar super atentos a las consultas.",
        image: "https://framerusercontent.com/images/AvfrQfX4hg4yY1cKJQO4OAaXQ.png"
    },
    {
        id: 3,
        author: "Juany",
        text: "Quería felicitar a Fran por el servicio que presta y por las enseñanzas que da dia a dia con sus bitácoras. El ingreso hoy de VALO fue Luxury.",
        image: "https://framerusercontent.com/images/2zaizaltMbd0hfmlArpqcyuC20.png"
    },
    {
        id: 4,
        author: "Santino Herrera",
        text: "Estoy súper agradecido de las asesorías, mas allá de las alertas (mayormente positivas), en los canales se aprende muchísimo de Fran y su experiencia respecto al mercado.",
        image: "https://framerusercontent.com/images/IZ6QsMgI2gFXUCOrdoCUsgOcvk.jpg"
    },
    {
        id: 5,
        author: "Juan Huérfano",
        text: "Excelente servicio, muy confiable, excelente tutoría y muy grandes personas, excelentes resultados, no me arrepiento.",
        image: "https://framerusercontent.com/images/4KykQdxaykJ3SmZZ9orjS0MT8.jpg"
    },
    {
        id: 6,
        author: "Fabián",
        text: "No tengo más que agradecimientos. Llevo poco tiempo con la asesoría personalizada y de no saber sobre inversiones aprendí muchísimo, además de incrementar mí capital notablemente.",
        image: "https://framerusercontent.com/images/ReDEVMJsLlrTYoDjEJ0Y42clXY.png"
    },
    {
        id: 7,
        author: "Graciela",
        text: "Fran Castro es muy audaz ! Te arma 2 carteras: a largo plazo y a corto plazo. La de corto plazo es para aplaudirlo 👏 Si no te llevan “a pasear con correa” en este mercado pierdes dinero. Siempre salimos con ganancias por su ojo profesional!💰",
        image: "https://framerusercontent.com/images/zWYaQp7huo4iC7pJ5b9SfnRR4.jpg"
    },
    {
        id: 8,
        author: "Cristian",
        text: "Soy suscriptor hace ya unos años, confianza y seguridad junto con transparencia es una característica del servicio brindado, a sumarse , que se aprende y gana en inversión.",
        image: "https://framerusercontent.com/images/zKJ6HAHTifYjmA2FxMEnpqy1jEg.png"
    },
    {
        id: 9,
        author: "Adrián",
        text: "Excelente servicio y predisposición. Lo mejor es la constante innovación con ideas superadoras. 100% recomendable.",
        image: "https://framerusercontent.com/images/Ush6w0oEeByTIiHE4LqQyBcb3Ng.jpg"
    }
];

export function TestimonialsSection() {
    return (
        <section className="py-24 bg-[#0B0F19] relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />

            <Container>
                <div className="text-center mb-16 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        ¿Qué dicen nuestros alumnos?
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        La comunidad de Aurora Academy crece día a día. Estas son algunas de las experiencias de quienes ya se están formando con nosotros.
                    </p>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 relative z-10">
                    {TESTIMONIALS.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="break-inside-avoid bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                        >
                            <div className="mb-4 text-blue-400">
                                <Quote size={24} className="opacity-50" />
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed mb-6">
                                &ldquo;{testimonial.text}&rdquo;
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20">
                                    <Image
                                        src={testimonial.image}
                                        alt={testimonial.author}
                                        fill
                                        className="object-cover"
                                        sizes="40px"
                                    />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium text-sm">
                                        {testimonial.author}
                                    </h4>
                                    <p className="text-blue-400 text-xs">Alumno</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
