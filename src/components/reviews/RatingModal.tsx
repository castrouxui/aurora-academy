"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    courseId: string;
    courseName: string;
}

export function RatingModal({ isOpen, onClose, onSuccess, courseId, courseName }: RatingModalProps) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    courseId,
                    rating,
                    comment
                })
            });

            if (!res.ok) {
                throw new Error("Error al enviar calificación");
            }

            toast.success("¡Gracias por tu calificación!");
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error("Ocurrió un error al enviar tu calificación.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && !open && onClose()}>
            <DialogContent className="sm:max-w-md bg-[#121620] border-gray-800 text-white">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        ¡Felicidades por completar el curso!
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 text-base mt-2">
                        Has terminado "{courseName}". Valora tu experiencia para obtener tu certificado.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-6 space-y-6">
                    {/* Stars */}
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                            >
                                <Star
                                    size={36}
                                    className={cn(
                                        "transition-all duration-300",
                                        rating >= star
                                            ? "fill-[#FFD700] text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                                            : "fill-transparent text-gray-600 hover:text-gray-500"
                                    )}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="text-center">
                        <span className="text-yellow-400 font-semibold text-lg">
                            {rating === 5 ? "¡Excelente!" :
                                rating === 4 ? "Muy bueno" :
                                    rating === 3 ? "Bueno" :
                                        rating === 2 ? "Regular" : "Malo"}
                        </span>
                    </div>

                    {/* Comment Area */}
                    <div className="w-full relative">
                        <MessageSquare className="absolute top-3 left-3 text-gray-500" size={18} />
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Cuéntanos qué te pareció el curso (Opcional)..."
                            className="w-full bg-[#0B0F19] border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:border-[#5D5CDE] focus:ring-1 focus:ring-[#5D5CDE] transition-all resize-none min-h-[100px]"
                        />
                    </div>
                </div>

                <DialogFooter className="sm:justify-center">
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto min-w-[200px] bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white font-bold py-6 rounded-xl shadow-lg shadow-[#5D5CDE]/20 transition-all hover:scale-105"
                    >
                        {isSubmitting ? "Enviando..." : "Enviar Calificación"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
