"use client";

import { Container } from "../layout/Container";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";
import { getMockCourseReviews } from "@/lib/course-reviews";
import { useMemo } from "react";

export function TestimonialsSection() {
    const { mockReviews } = useMemo(() => getMockCourseReviews("HOME_TESTIMONIALS", 15), []);

    const formattedTestimonials = mockReviews.map(review => ({
        content: review.comment || "",
        name: review.user.name || "Usuario Anónimo",
        description: "Estudiante Verificado",
        image: review.user.image || "/course-placeholder.jpg",
        rating: review.rating
    }));

    return (
        <section className="py-28 md:py-36 border-b border-white/6 overflow-hidden">
            <Container>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <h2 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white leading-tight max-w-md">
                        Lo que dicen<br />nuestros estudiantes.
                    </h2>
                    <p className="text-gray-500 text-sm md:text-right max-w-xs">
                        Más de {formattedTestimonials.length} reseñas verificadas · Calificación 4.9/5
                    </p>
                </div>
            </Container>

            <style dangerouslySetInnerHTML={{
                __html: `@keyframes scroll { to { transform: translate(calc(-50% - 0.5rem)); } } .animate-scroll { animation: scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite; }`
            }} />

            <div className="-mx-4 md:mx-0">
                <InfiniteMovingCards items={formattedTestimonials} direction="left" speed="slow" />
            </div>
        </section>
    );
}
