import { Star, User } from "lucide-react";
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

export function ReviewList({ reviews }: { reviews: Review[] }) {
    if (reviews.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                Aún no hay reseñas. ¡Sé el primero en opinar!
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <div key={review.id} className="bg-white/5 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#5D5CDE]/10 flex items-center justify-center overflow-hidden border border-white/10 relative">
                                {review.user.image ? (
                                    <Image
                                        src={review.user.image}
                                        alt={review.user.name || "User"}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <User className="text-[#5D5CDE]" size={20} />
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">{review.user.name || "Estudiante"}</h4>
                                <div className="flex text-yellow-400 text-xs mt-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} className={i < review.rating ? "fill-current" : "text-gray-700"} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: es })}
                        </span>
                    </div>
                    {review.comment && (
                        <p className="mt-3 text-gray-300 text-sm leading-relaxed">
                            {review.comment}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
