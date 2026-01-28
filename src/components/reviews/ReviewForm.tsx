"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ReviewForm({ courseId }: { courseId: string }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Por favor seleccioná una calificación");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId, rating, comment }),
            });

            if (res.ok) {
                toast.success("¡Gracias por tu reseña!");
                setRating(0);
                setComment("");
                router.refresh(); // Refresh to show new review
            } else {
                const txt = await res.text();
                toast.error(txt === "Must purchase course to review" ? "Debés comprar el curso para opinar" : "Error al enviar reseña");
            }
        } catch (error) {
            toast.error("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#121620] border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Dejá tu opinión</h3>

            <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110 focus:outline-none"
                    >
                        <Star
                            size={28}
                            className={`${star <= (hoverRating || rating)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-600"
                                } transition-colors`}
                        />
                    </button>
                ))}
                <span className="ml-2 text-sm text-gray-400">
                    {rating > 0 ? (rating === 5 ? "¡Excelente!" : rating === 1 ? "Malo" : "") : "Seleccioná"}
                </span>
            </div>

            <Textarea
                placeholder="¿Qué te pareció el curso?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="bg-black/30 border-white/10 text-white min-h-[100px] mb-4 focus:border-[#5D5CDE]"
            />

            <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-[#5D5CDE] hover:bg-[#4b4ac0] text-white w-full sm:w-auto"
            >
                {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                Publicar Reseña
            </Button>
        </div>
    );
}
