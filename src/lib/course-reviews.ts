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
        comment: "Gracias Fran, crack total. Yo venía de ver videos random en YouTube sin entender nada y acá en unas horas ya tenía todo claro. Ya abrí mi cuenta en el broker.",
        user: { name: "Facundo Giménez", image: null },
        daysAgo: 19
    },
    {
        id: "mock-rev-2",
        rating: 5,
        comment: "Un amigo me lo recomendó y enserio no me arrepiento. Fran no te vende humo, te habla con ejemplos de la vida real y eso se valora. Ya voy por el segundo curso de la plataforma.",
        user: { name: "Martín Aguirre", image: null },
        daysAgo: 24
    },
    {
        id: "mock-rev-3",
        rating: 4,
        comment: "Le pongo 4 porque me quedé con ganas de que profundice más en análisis técnico, pero entiendo que eso va en otro curso. Igualmente para ser gratuito la calidad es una locura, Fran explica sin tecnicismos y se entiende todo.",
        user: { name: "Santiago Pereyra", image: null },
        daysAgo: 30, // 1 month
        instructorReply: {
            name: "Fran Castro",
            image: "/images/francisco-speaking.png",
            reply: "¡Gracias Santiago! El análisis técnico en profundidad lo trabajamos dentro de nuestras membresías, donde tenés acceso a todos los cursos avanzados. ¡Te esperamos ahí!"
        }
    },
    {
        id: "mock-rev-4",
        rating: 4,
        comment: "Justo lo que necesitaba para dejar de tener la plata parada en el banco. Videos cortitos, los veía en el bondi. Lo único que le agregaría son ejercicios prácticos pero fuera de eso joya.",
        user: { name: "Nicolás Herrera", image: null },
        daysAgo: 31 // 1 month
    },
    {
        id: "mock-rev-5",
        rating: 5,
        comment: "Contenido espectacular. Todo muy directo y aplicable desde el día 1.",
        user: { name: "Vicente Mateo", image: null },
        daysAgo: 7
    },
    {
        id: "mock-rev-6",
        rating: 4,
        comment: "Espectacular Resumen. Lo definiría con el título de iniciación a las inversiones. Capaz que el paso a paso sería ideal para los que arrancan.",
        user: { name: "Pchipty", image: null },
        daysAgo: 25
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
        selectedIndices = [0, 1, 2, 3, 4, 5];
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
