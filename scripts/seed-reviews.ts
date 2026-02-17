import { PrismaClient } from "@prisma/client";
import { subDays, startOfDay } from "date-fns";

const prisma = new PrismaClient();

// --- Data ---

const DATA = [
    {
        courseTitle: "Manejo de TradingView",
        category: "Trading y Herramientas",
        reviews: [
            {
                student: "Matías Varela",
                rating: 5,
                comment: "Excelente para configurar el espacio de trabajo. Los atajos y las alertas que enseñan me ahorran muchísimo tiempo.",
            },
        ],
    },
    {
        courseTitle: "Mentoría Análisis Técnico",
        category: "Trading y Herramientas",
        isMentorship: true,
        reviews: [
            {
                student: "Sofía Rossi",
                rating: 5,
                comment: "La profundidad con la que analizamos los gráficos en las sesiones en vivo superó mis expectativas. Muy profesional.",
            },
        ],
    },
    {
        courseTitle: "Análisis Técnico (Curso)",
        category: "Trading y Herramientas",
        reviews: [
            {
                student: "Lucas Benítez",
                rating: 4,
                comment: "Muy buena base teórica. Me hubiera gustado ver un poco más de volumen, pero para entender tendencias es impecable.",
            },
        ],
    },
    {
        courseTitle: "Price Action",
        category: "Trading y Herramientas",
        reviews: [
            {
                student: "Juan Ignacio López",
                rating: 5,
                comment: "Por fin entendí que no necesito mil indicadores para operar. La lectura de velas es súper clara y aplicable.",
            },
        ],
    },
    {
        courseTitle: "Domina el Stop Loss",
        category: "Trading y Herramientas",
        reviews: [
            {
                student: "Diego Herrera",
                rating: 5,
                comment: "Esencial. Cortito y al pie para dejar de quemar cuentas por una mala gestión de la salida.",
            },
        ],
    },
    {
        courseTitle: "Machine Learning + IA",
        category: "Inteligencia Artificial Aplicada",
        reviews: [
            {
                student: "Marcos Galván",
                rating: 5,
                comment: "Un enfoque muy serio sobre cómo usar datos para predecir movimientos. No te venden magia, te enseñan procesos.",
            },
        ],
    },
    {
        courseTitle: "Testing con IA",
        category: "Inteligencia Artificial Aplicada",
        reviews: [
            {
                student: "Valentina Sosa",
                rating: 4,
                comment: "El backtesting ahora lo hago en una fracción del tiempo que me tomaba antes. Muy buena la metodología.",
            },
        ],
    },
    {
        courseTitle: "IA en Inversiones",
        category: "Inteligencia Artificial Aplicada",
        reviews: [
            {
                student: "Ricardo Méndez",
                rating: 5,
                comment: "Muy interesante cómo integrar herramientas de IA para filtrar activos. Me cambió la forma de investigar el mercado.",
            },
        ],
    },
    {
        courseTitle: "El camino del inversor",
        category: "Finanzas e Inversión General",
        reviews: [
            {
                student: "Florencia Díaz",
                rating: 5,
                comment: "Lo mejor para arrancar de cero sin miedo. El paso a paso es muy amigable y el diseño de la plataforma ayuda mucho.",
            },
        ],
    },
    {
        courseTitle: "Finanzas Personales",
        category: "Finanzas e Inversión General",
        reviews: [
            {
                student: "Santiago López",
                rating: 5,
                comment: "Clave para entender dónde se te va la plata y cómo empezar a armar un fondo de emergencia real en este contexto.",
            },
        ],
    },
    {
        courseTitle: "Los 7 Pilares del Éxito",
        category: "Finanzas e Inversión General",
        reviews: [
            {
                student: "Agustín Ramírez",
                rating: 4,
                comment: "Buenos principios de disciplina. Es más mental que técnico, pero sirve mucho para mantenerse enfocado.",
            },
        ],
    },
    {
        courseTitle: "Intro. Mercado de Capitales",
        category: "Finanzas e Inversión General",
        reviews: [
            {
                student: "Carla Bianchi",
                rating: 5,
                comment: "Imprescindible para entender quién es quién en la bolsa y cómo abrir una cuenta en un broker de forma segura.",
            },
        ],
    },
    {
        courseTitle: "Fondos Comunes de Inversión",
        category: "Análisis de Activos y Renta Fija",
        reviews: [
            {
                student: "Ramiro Ortega",
                rating: 5,
                comment: "Muy útil para comparar las distintas familias de fondos y saber cuál elegir según la liquidez que necesites.",
            },
        ],
    },
    {
        courseTitle: "Análisis Fundamental",
        category: "Análisis de Activos y Renta Fija",
        reviews: [
            {
                student: "Elena Pardo",
                rating: 5,
                comment: "Aprender a leer un balance me dio la tranquilidad de saber en qué empresas estoy poniendo mi capital a largo plazo.",
            },
        ],
    },
    {
        courseTitle: "Renta Fija",
        category: "Análisis de Activos y Renta Fija",
        reviews: [
            {
                student: "Esteban Ruiz",
                rating: 4,
                comment: "Buen detalle sobre los cupones y el funcionamiento de los bonos. Ideal para perfiles conservadores.",
            },
        ],
    },
    {
        courseTitle: "Valuación de Bonos",
        category: "Análisis de Activos y Renta Fija",
        reviews: [
            {
                student: "Gastón Peralta",
                rating: 5,
                comment: "Explicar la paridad y la TIR de forma tan sencilla es un mérito enorme. Excelente nivel académico.",
            },
        ],
    },
    {
        courseTitle: "Tasa de interés (TNA/TEA)",
        category: "Análisis de Activos y Renta Fija",
        reviews: [
            {
                student: "Natalia Grecco",
                rating: 5,
                comment: "Fundamental para no dejarse engañar por los números de los bancos. Ahora entiendo la diferencia real de rendimiento.",
            },
        ],
    },
    {
        courseTitle: "Futuros Financieros",
        category: "Instrumentos Avanzados y Valuación",
        reviews: [
            {
                student: "Julián Benítez",
                rating: 5,
                comment: "Muy buena la explicación sobre el apalancamiento y los contratos. Es un tema complejo pero está muy bien bajado a tierra.",
            },
        ],
    },
    {
        courseTitle: "Opciones Financieras",
        category: "Instrumentos Avanzados y Valuación",
        reviews: [
            {
                student: "Marcos Duarte",
                rating: 4,
                comment: "Las estrategias de cobertura son excelentes. Me costó un poco el módulo de las 'griegas', pero con repaso se entiende.",
            },
        ],
    },
    {
        courseTitle: "Mentoría Gestión de Cartera",
        category: "Instrumentos Avanzados y Valuación",
        isMentorship: true,
        reviews: [
            {
                student: "Andrés Villalba",
                rating: 5,
                comment: "La visión estratégica que te dan sobre cómo balancear activos según el riesgo es de otro nivel.",
            },
        ],
    },
    {
        courseTitle: "Riesgo y Volatilidad",
        category: "Instrumentos Avanzados y Valuación",
        reviews: [
            {
                student: "Lucía Fernández",
                rating: 5,
                comment: "Entender el drawdown me ayudó a no desesperar cuando el mercado corrige. Muy buena la parte de psicología.",
            },
        ],
    },
    {
        courseTitle: "Beneficio vs. Caja",
        category: "Instrumentos Avanzados y Valuación",
        reviews: [
            {
                student: "Martín Guzmán",
                rating: 5,
                comment: "Un baño de realidad contable. Clave para entender que una empresa puede ganar plata y aun así fundirse si no tiene flujo.",
            },
        ],
    },
];

const COLORS = [
    "5D5CDE", // Aurora Primary
    "009EE3", // Accent Blue
    "10B981", // Emerald
    "F59E0B", // Amber
    "EC4899", // Pink
];

const IMAGES = [
    "/images/trading-intro.png",
    "/images/price-action.png",
    "/images/bonds-valuation.png",
    "/images/francisco-speaking.png"
];

// --- Helpers ---

function getRandomImage() {
    return IMAGES[Math.floor(Math.random() * IMAGES.length)];
}

function getRandomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function getRandomDate(daysBack: number = 60) {
    const now = new Date();
    const past = subDays(now, daysBack);
    const start = past.getTime();
    const end = now.getTime();
    return new Date(start + Math.random() * (end - start));
}

// --- Main ---

async function main() {
    console.log("🚀 Starting Review Seeding Process...");

    for (const item of DATA) {
        console.log(`\nProcessing: ${item.courseTitle}`);

        // 1. Find or Create Course
        // We look for a course that *contains* the title to be flexible, or match exact.
        // Given the list is precise, let's try exact match first, then fuzzy.

        // NOTE: In the provided DB dump, "Los 7 Pilares del Éxito en Bolsa" exists, user said "Los 7 Pilares del Éxito".
        // "El camino del inversor" exists.
        // Others likely don't.

        let course = await prisma.course.findFirst({
            where: {
                title: {
                    contains: item.courseTitle,
                    mode: 'insensitive'
                }
            }
        });

        // (Removed from here)

        // ... existing code ...

        if (!course) {
            console.log(`- Course not found. Creating: ${item.courseTitle}`);
            course = await prisma.course.create({
                data: {
                    title: item.courseTitle,
                    category: item.category,
                    description: `Curso completo de ${item.courseTitle}. Aprende con los mejores expertos de Aurora Academy.`,
                    shortDescription: `Domina ${item.courseTitle} con este curso práctico.`,
                    price: 0, // Placeholder
                    published: true,
                    imageUrl: getRandomImage(), // Use real image
                    level: "Todos los niveles",
                }
            });
        } else {
            console.log(`- Found existing course: ${course.title} (${course.id})`);

            // Fix broken images
            if (course.imageUrl === "/course-placeholder.jpg" || !course.imageUrl) {
                await prisma.course.update({
                    where: { id: course.id },
                    data: { imageUrl: getRandomImage() }
                });
                console.log("  -> Fixed broken image.");
            }

            // Ensure it's published so reviews show up
            if (!course.published) {
                await prisma.course.update({
                    where: { id: course.id },
                    data: { published: true }
                });
                console.log("  -> Published course.");
            }
        }

        // 2. Process Reviews
        for (const review of item.reviews) {
            // Create generated email
            const safeName = review.student.toLowerCase().replace(/[^a-z0-9]/g, '.');
            const email = `${safeName}.review@aurora.academy`;

            let user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                const color = getRandomColor();
                const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.student)}&background=${color}&color=fff&size=128`;

                user = await prisma.user.create({
                    data: {
                        name: review.student,
                        email: email,
                        role: "ESTUDIANTE",
                        image: avatarUrl,
                        password: "placeholder-hash", // Not for login
                    }
                });
                console.log(`  -> Created user: ${review.student} (${color})`);
            } else {
                console.log(`  -> Found user: ${review.student}`);
            }

            // Check if review exists
            const existingReview = await prisma.review.findFirst({
                where: {
                    courseId: course.id,
                    userId: user.id
                }
            });

            if (!existingReview) {
                const reviewDate = getRandomDate();
                await prisma.review.create({
                    data: {
                        rating: review.rating,
                        comment: review.comment,
                        courseId: course.id,
                        userId: user.id,
                        createdAt: reviewDate
                    }
                });
                console.log(`  -> Created review: ${review.rating} STARS - "${review.comment.substring(0, 20)}..." on ${reviewDate.toISOString().split('T')[0]}`);
            } else {
                console.log(`  -> Review already exists.`);
            }
        }
    }

    console.log("\n✅ Done!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
