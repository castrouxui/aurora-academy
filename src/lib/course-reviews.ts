export interface MockReview {
    id: string;
    rating: number;
    comment: string;
    createdAt: Date;
    user: {
        name: string;
        image: string | null;
    };
    instructorReply?: {
        name: string;
        image: string;
        reply: string;
    };
}

const MOCK_REVIEWS_POOL = [
    {
        id: "mock-rev-1",
        rating: 5,
        comment: "Respecto al servicio estoy con Fran hace poco más de 6 meses ininterrumpidos. La verdad que mi satisfacción es absoluta. Excelente resultados y gran profesor! Recién arrancamos.",
        user: { name: "Ezequiel", image: "https://framerusercontent.com/images/p7bvoFnbGtK8RZ1HSLiAUiHxx8.jpg" },
        daysAgo: 19
    },
    {
        id: "mock-rev-2",
        rating: 5,
        comment: "Estoy muy contento con el servicio, sobre todo y lo más valioso la predisposición a responder y estar super atentos a las consultas.",
        user: { name: "Pato Touceda", image: "https://framerusercontent.com/images/AvfrQfX4hg4yY1cKJQO4OAaXQ.png" },
        daysAgo: 24
    },
    {
        id: "mock-rev-3",
        rating: 4,
        comment: "Quería felicitar a Fran por el servicio que presta y por las enseñanzas que da dia a dia con sus bitácoras. El ingreso hoy de VALO fue Luxury.",
        user: { name: "Juany", image: "https://framerusercontent.com/images/2zaizaltMbd0hfmlArpqcyuC20.png" },
        daysAgo: 30, // 1 month
        instructorReply: {
            name: "Fran Castro",
            image: "/images/francisco-speaking.png",
            reply: "¡Qué grande Juany! Ese trade fue espectacular. A seguir aprendiendo y aprovechando las oportunidades del mercado."
        }
    },
    {
        id: "mock-rev-4",
        rating: 5,
        comment: "Estoy súper agradecido de las asesorías, mas allá de las alertas (mayormente positivas), en los canales se aprende muchísimo de Fran y su experiencia respecto al mercado.",
        user: { name: "Santino Herrera", image: "https://framerusercontent.com/images/IZ6QsMgI2gFXUCOrdoCUsgOcvk.jpg" },
        daysAgo: 31 // 1 month
    },
    {
        id: "mock-rev-5",
        rating: 5,
        comment: "Excelente servicio, muy confiable, excelente tutoría y muy grandes personas, excelentes resultados, no me arrepiento.",
        user: { name: "Juan Huérfano", image: "https://framerusercontent.com/images/4KykQdxaykJ3SmZZ9orjS0MT8.jpg" },
        daysAgo: 7
    },
    {
        id: "mock-rev-6",
        rating: 5,
        comment: "No tengo más que agradecimientos. Llevo poco tiempo con la asesoría personalizada y de no saber sobre inversiones aprendí muchísimo, además de incrementar mí capital notablemente.",
        user: { name: "Fabián", image: "https://framerusercontent.com/images/ReDEVMJsLlrTYoDjEJ0Y42clXY.png" },
        daysAgo: 25
    },
    {
        id: "mock-rev-7",
        rating: 5,
        comment: "Fran Castro es muy audaz ! Te arma 2 carteras: a largo plazo y a corto plazo. La de corto plazo es para aplaudirlo 👏 Si no te llevan “a pasear con correa” en este mercado pierdes dinero. Siempre salimos con ganancias por su ojo profesional!💰",
        user: { name: "Graciela", image: "https://framerusercontent.com/images/zWYaQp7huo4iC7pJ5b9SfnRR4.jpg" },
        daysAgo: 14
    },
    {
        id: "mock-rev-8",
        rating: 5,
        comment: "Soy suscriptor hace ya unos años, confianza y seguridad junto con transparencia es una característica del servicio brindado, a sumarse , que se aprende y gana en inversión.",
        user: { name: "Cristian", image: "https://framerusercontent.com/images/zKJ6HAHTifYjmA2FxMEnpqy1jEg.png" },
        daysAgo: 45
    },
    {
        id: "mock-rev-9",
        rating: 5,
        comment: "Excelente servicio y predisposición. Lo mejor es la constante innovación con ideas superadoras. 100% recomendable.",
        user: { name: "Adrián", image: "https://framerusercontent.com/images/Ush6w0oEeByTIiHE4LqQyBcb3Ng.jpg" },
        daysAgo: 5
    }
];

function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash);
}

function seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

export function getMockCourseReviews(courseId: string, limit?: number) {
    const seed = hashString(courseId);

    // totalRatings between 20 and 42 (all numbers different per seed)
    const randomVal1 = seededRandom(seed);
    const mockTotalRatings = 20 + Math.floor(randomVal1 * 23); // 20 to 42

    // averageRating between 4.4 and 4.9
    const randomVal2 = seededRandom(seed + 1);
    const mockAverageRating = 4.4 + Math.round(randomVal2 * 5) / 10;

    let selectedIndices: number[] = [];

    if (limit && limit >= 6) {
        // Just return all of them shuffled for the ticker
        selectedIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        for (let i = selectedIndices.length - 1; i > 0; i--) {
            const j = Math.floor(seededRandom(seed + 5 + i) * (i + 1));
            [selectedIndices[i], selectedIndices[j]] = [selectedIndices[j], selectedIndices[i]];
        }
    } else {
        // Pick 4 or 5 reviews for courses
        const hasFive = seededRandom(seed + 2) > 0.5;
        const reviewCount = hasFive ? 5 : 4;

        // Always include review 0 (featured) and review 2 (with reply)
        const requiredIndices = [0, 2];
        const optionalIndices = [1, 3, 4, 5];

        // Shuffle optional indices deterministically
        const shuffledOptional = [...optionalIndices];
        for (let i = shuffledOptional.length - 1; i > 0; i--) {
            const j = Math.floor(seededRandom(seed + 3 + i) * (i + 1));
            [shuffledOptional[i], shuffledOptional[j]] = [shuffledOptional[j], shuffledOptional[i]];
        }

        selectedIndices = [...requiredIndices, ...shuffledOptional.slice(0, reviewCount - requiredIndices.length)];
    }

    // Map to objects
    const now = new Date();
    const unmappedReviews = selectedIndices.map(idx => MOCK_REVIEWS_POOL[idx]);

    const reviews: MockReview[] = unmappedReviews.map((r, i) => {
        const d = new Date(now);
        // Add slight variation based on course to the days
        const varDays = Math.floor(seededRandom(seed + 4 + i) * 3) - 1;
        d.setDate(d.getDate() - (r.daysAgo + varDays));

        return {
            id: r.id + "-" + courseId,
            rating: r.rating,
            comment: r.comment,
            createdAt: d,
            user: r.user,
            instructorReply: r.instructorReply,
        };
    });

    // Sort by daysAgo descending (which corresponds to createdAt)
    reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return {
        mockTotalRatings,
        mockAverageRating,
        mockReviews: reviews
    };
}
