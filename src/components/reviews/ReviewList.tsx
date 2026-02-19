import { Star, CornerDownRight } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    user: {
        name: string | null;
        image: string | null;
    };
}

// Palette-aligned avatar colors — subtle, cohesive
const AVATAR_COLORS = [
    { bg: "bg-indigo-500/15", text: "text-indigo-400" },
    { bg: "bg-violet-500/15", text: "text-violet-400" },
    { bg: "bg-emerald-500/12", text: "text-emerald-400" },
    { bg: "bg-amber-500/12", text: "text-amber-400" },
    { bg: "bg-sky-500/12", text: "text-sky-400" },
    { bg: "bg-rose-500/12", text: "text-rose-400" },
];

// Keywords indicating concrete results
const RESULT_KEYWORDS = ["broker", "cuenta", "segundo curso", "abrí", "inscrib", "resultado", "operando", "invertir"];

function hasConcreteResults(comment: string | null): boolean {
    if (!comment) return false;
    const lower = comment.toLowerCase();
    return RESULT_KEYWORDS.some(keyword => lower.includes(keyword));
}

function getInitials(name: string | null): string {
    if (!name) return "E";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

// Instructor reply data — keyed by review ID
const INSTRUCTOR_REPLIES: Record<string, { name: string; image: string; reply: string }> = {
    "fake-review-3": {
        name: "Fran Castro",
        image: "/images/francisco-speaking.png",
        reply: "¡Gracias Santiago! El análisis técnico en profundidad lo trabajamos dentro de nuestras membresías, donde tenés acceso a todos los cursos avanzados. ¡Te esperamos ahí!",
    },
};

export function ReviewList({ reviews }: { reviews: Review[] }) {
    if (reviews.length === 0) {
        return (
            <div className="text-center py-16 text-gray-600 text-sm">
                Aún no hay reseñas. ¡Sé el primero en opinar!
            </div>
        );
    }

    // Sort: reviews with concrete results first
    const sortedReviews = [...reviews].sort((a, b) => {
        const aHasResults = hasConcreteResults(a.comment);
        const bHasResults = hasConcreteResults(b.comment);
        if (aHasResults && !bHasResults) return -1;
        if (!aHasResults && bHasResults) return 1;
        return 0;
    });

    return (
        <div className="space-y-4">
            {sortedReviews.map((review, index) => {
                const isHighlighted = hasConcreteResults(review.comment);
                const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
                const instructorReply = INSTRUCTOR_REPLIES[review.id];

                return (
                    <div key={review.id}>
                        {/* Review card */}
                        <div
                            className={`rounded-xl p-5 md:p-6 transition-colors ${isHighlighted
                                    ? "bg-[#5D5CDE]/[0.04] border border-[#5D5CDE]/15"
                                    : "bg-white/[0.025] border border-white/[0.05]"
                                }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    {/* Avatar */}
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${review.user.image ? "" : `${color.bg} ${color.text}`
                                        } overflow-hidden relative`}>
                                        {review.user.image ? (
                                            <Image src={review.user.image} alt={review.user.name || "User"} fill className="object-cover" />
                                        ) : (
                                            <span className="font-bold text-[11px]">{getInitials(review.user.name)}</span>
                                        )}
                                    </div>
                                    <div>
                                        <span className="font-semibold text-white text-sm block leading-tight">
                                            {review.user.name || "Estudiante"}
                                        </span>
                                        <div className="flex gap-0.5 mt-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={10} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-700"} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[11px] text-gray-600 shrink-0 mt-0.5">
                                    {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: es })}
                                </span>
                            </div>
                            {review.comment && (
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    {review.comment}
                                </p>
                            )}
                        </div>

                        {/* Instructor reply — visually anchored with connector */}
                        {instructorReply && (
                            <div className="flex mt-1">
                                {/* Visual thread connector */}
                                <div className="flex items-start pt-3 pl-6 pr-3 shrink-0">
                                    <CornerDownRight size={16} className="text-[#5D5CDE]/30" />
                                </div>
                                {/* Reply bubble */}
                                <div className="flex-1 bg-[#5D5CDE]/[0.04] border border-[#5D5CDE]/10 rounded-xl p-4 md:p-5 mt-1">
                                    <div className="flex items-center gap-2.5 mb-2.5">
                                        <div className="w-7 h-7 rounded-full overflow-hidden border border-[#5D5CDE]/25 relative shrink-0">
                                            <Image src={instructorReply.image} alt={instructorReply.name} fill className="object-cover object-top" />
                                        </div>
                                        <span className="font-semibold text-white text-sm">{instructorReply.name}</span>
                                        <span className="text-[10px] text-[#5D5CDE] font-bold bg-[#5D5CDE]/10 px-2 py-0.5 rounded-full leading-none">INSTRUCTOR</span>
                                    </div>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        {instructorReply.reply}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
