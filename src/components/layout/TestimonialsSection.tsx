"use client";

import { Container } from "../layout/Container";
import { Star, MessageCircle } from "lucide-react";
import Image from "next/image";

import { InfiniteMovingCards } from "../ui/infinite-moving-cards";
import { getMockCourseReviews } from "@/lib/course-reviews";
import { useMemo } from "react";

export function TestimonialsSection() {
    // Generate 15 deterministic reviews using our utility
    const { mockReviews } = useMemo(() => getMockCourseReviews("HOME_TESTIMONIALS", 15), []);

    // Format for the InfiniteMovingCards component
    const formattedTestimonials = mockReviews.map(review => ({
        content: review.comment || "",
        name: review.user.name || "Usuario Anónimo",
        description: "Estudiante Verificado",
        image: review.user.image || "/course-placeholder.jpg",
        rating: review.rating
    }));

    return (
        <section className="py-20 bg-muted/20">
            <Container>
                <div className="max-w-2xl mb-12 mx-auto text-center flex flex-col items-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border text-foreground font-semibold text-xs uppercase tracking-widest mb-4">
                        <MessageCircle className="w-4 h-4 text-primary" /> Casos de Éxito
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-foreground font-display tracking-tight leading-tight text-center">
                        No lo decimos nosotros, lo dicen los resultados.
                    </h2>
                </div>

                {/* Global CSS for the animation (Fallback if not in tailwind config) */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes scroll {
                        to {
                            transform: translate(calc(-50% - 0.5rem));
                        }
                    }
                    .animate-scroll {
                        animation: scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite;
                    }
                `}} />

                <div className="flex justify-center -mx-4 md:mx-0">
                    <InfiniteMovingCards
                        items={formattedTestimonials}
                        direction="left"
                        speed="slow"
                    />
                </div>
            </Container>
        </section>
    );
}
