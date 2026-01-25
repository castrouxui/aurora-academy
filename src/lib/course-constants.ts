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
    // 1. Priority: Check if we have a verified local cover for this course title
    // This allows us to override broken/old production URLs with our fresh local files
    const exactMatch = Object.entries(COURSE_IMAGES).find(([key]) => course.title.includes(key));
    if (exactMatch) return exactMatch[1];

    // 2. Secondary: Use DB provided URL if available
    if (course.imageUrl && course.imageUrl.trim() !== "") {
        // If it starts with http (external) or / (absolute path), return as is
        if (course.imageUrl.startsWith("http") || course.imageUrl.startsWith("/")) {
            return course.imageUrl;
        }
        // Otherwise, assume it's a filename in /images/courses/
        return `/images/courses/${course.imageUrl}`;
    }

    return "/course-placeholder.jpg";
}
