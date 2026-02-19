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

// Expanded distinctive colors
const AVATAR_COLORS = [
    { bg: "bg-indigo-500/15", text: "text-indigo-400" },
    { bg: "bg-violet-500/15", text: "text-violet-400" },
    { bg: "bg-emerald-500/15", text: "text-emerald-400" },
    { bg: "bg-amber-500/15", text: "text-amber-400" },
    { bg: "bg-sky-500/15", text: "text-sky-400" },
    { bg: "bg-rose-500/15", text: "text-rose-400" },
    { bg: "bg-fuchsia-500/15", text: "text-fuchsia-400" },
    { bg: "bg-cyan-500/15", text: "text-cyan-400" },
    { bg: "bg-lime-500/15", text: "text-lime-400" },
    { bg: "bg-orange-500/15", text: "text-orange-400" },
];

const RESULT_KEYWORDS = ["broker", "cuenta", "segundo curso", "abrí", "inscrib", "resultado", "operando", "invertir"];

function hasConcreteResults(comment: string | null): boolean {
    if (!comment) return false;
    const lower = comment.toLowerCase();
    return RESULT_KEYWORDS.some(keyword => lower.includes(keyword));
}

function getInitials(name: string | null): string {
    if (!name) return "A";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

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

    const sortedReviews = [...reviews].sort((a, b) => {
        const aHasResults = hasConcreteResults(a.comment);
        const bHasResults = hasConcreteResults(b.comment);
        if (aHasResults && !bHasResults) return -1;
        if (!aHasResults && bHasResults) return 1;
        return 0;
    });

    return (
        <div className="space-y-6">
            {sortedReviews.map((review, index) => {
                const isHighlighted = hasConcreteResults(review.comment);
                const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
                const instructorReply = INSTRUCTOR_REPLIES[review.id];

                return (
                    <div key={review.id} className="group">
                        {/* Review Card - Increased padding 24px (p-6) */}
                        <div
                            className={`rounded-2xl p-6 transition-all duration-300 ${isHighlighted
                                    ? "bg-[#5D5CDE]/[0.05] border border-[#5D5CDE]/20 shadow-[0_4px_20px_rgba(93,92,222,0.05)]"
                                    : "bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.03] hover:border-white/[0.08]"
                                }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    {/* Avatar - Always enforced colors/initials unless image exists */}
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${review.user.image ? "" : `${color.bg} ${color.text}`
                                        } overflow-hidden relative shadow-inner ring-1 ring-white/5`}>
                                        {review.user.image ? (
                                            <Image src={review.user.image} alt={review.user.name || "User"} fill className="object-cover" />
                                        ) : (
                                            <span className="font-bold text-base tracking-wide">{getInitials(review.user.name)}</span>
                                        )}
                                    </div>
                                    <div>
                                        <span className="font-bold text-white text-base block leading-tight mb-1">
                                            {review.user.name || "Estudiante"}
                                        </span>
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={11} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-700"} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-600 shrink-0 font-medium">
                                    {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: es })}
                                </span>
                            </div>
                            {review.comment && (
                                <p className="text-base text-gray-300 leading-relaxed font-light">
                                    {review.comment}
                                </p>
                            )}
                        </div>

                        {/* Instructor Reply - Anchored */}
                        {instructorReply && (
                            <div className="flex mt-2 relative">
                                {/* Connector Line */}
                                <div className="w-12 flex justify-center shrink-0">
                                    <div className="w-px h-8 bg-[#5D5CDE]/20 -mt-2"></div>
                                    <div className="absolute top-6 left-[23px] w-4 h-px bg-[#5D5CDE]/20"></div>
                                </div>

                                <div className="flex-1 pl-4">
                                    <div className="bg-[#5D5CDE]/[0.06] border border-[#5D5CDE]/15 rounded-xl p-5 mt-1 flex gap-4">
                                        <CornerDownRight size={16} className="text-[#5D5CDE] shrink-0 mt-1" />
                                        <div>
                                            <div className="flex items-center gap-2.5 mb-2">
                                                <div className="w-6 h-6 rounded-full overflow-hidden border border-[#5D5CDE]/30 relative shrink-0">
                                                    <Image src={instructorReply.image} alt={instructorReply.name} fill className="object-cover" />
                                                </div>
                                                <span className="font-bold text-white text-sm">{instructorReply.name}</span>
                                                <span className="text-[10px] text-[#5D5CDE] font-bold bg-[#5D5CDE]/10 px-2 py-0.5 rounded-full leading-none tracking-wide">INSTRUCTOR</span>
                                            </div>
                                            <p className="text-sm text-gray-400 leading-relaxed italic">
                                                "{instructorReply.reply}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
