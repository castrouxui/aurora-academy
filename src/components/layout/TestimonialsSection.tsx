"use client";

import { Container } from "../layout/Container";
import { MessageCircle } from "lucide-react";

import { InfiniteMovingCards } from "../ui/infinite-moving-cards";
import { getMockCourseReviews } from "@/lib/course-reviews";
import { useMemo } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

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

    const { ref, isInView } = useInView();

    return (
        <section ref={ref} className="py-28 bg-muted/20">
            <Container>
                <div className={cn("max-w-2xl mb-12 mx-auto text-center flex flex-col items-center fade-in-up", isInView && "visible")}>
                    <span className="text-sm text-muted-foreground font-medium mb-4 block">
                        <MessageCircle className="w-4 h-4 inline mr-1.5 text-primary" />Casos de Éxito
                    </span>
                    <h2 className="text-3xl md:text-4xl font-display font-medium leading-[1.15] tracking-normal text-foreground text-center">
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
