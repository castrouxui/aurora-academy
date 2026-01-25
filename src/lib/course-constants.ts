export const COURSE_IMAGES: Record<string, string> = {
    // Verified Covers
    "Trading": "/images/courses/trading_inicial_cover_1768005327407.png",
    "Price Action": "/images/courses/price_action_cover_1768005409635.png",
    "Bonos": "/images/courses/renta_fija_cover_1768005380686.png",
    "Tecnico": "/images/courses/analisis_tecnico_cover_1768005395407.png",
    "Avanzado": "/images/courses/trading_avanzado_cover_1768005355571.png",
    "Intermedio": "/images/courses/trading_intermedio_cover_1768005341591.png",

    // Fallbacks (Map known text to specific files if found, otherwise keep empty to trigger fallback)
    "Futuros": "/images/courses/futuros_cover_gen.png",
    "Opciones": "/images/courses/opciones_cover_gen.png",
};

export function getCourseImage(course: { title: string, imageUrl?: string | null }) {
    let finalImage = course.imageUrl || "/course-placeholder.jpg";

    // Override with local map if title matches
    for (const [key, path] of Object.entries(COURSE_IMAGES)) {
        if (course.title.includes(key) || (course.title.toLowerCase().includes(key.toLowerCase()))) {
            finalImage = path;
            break;
        }
    }

    return finalImage;
}
