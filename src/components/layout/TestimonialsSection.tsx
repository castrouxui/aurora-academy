"use client";

import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";
import { TESTIMONIALS, Testimonial } from "@/constants/testimonials";
import { useEffect, useState } from "react";
import { getRegisteredUserCount } from "@/actions/user";

function ReviewCard({ review }: { review: Testimonial }) {
    return (
        <figure className="relative w-full cursor-pointer overflow-hidden rounded-3xl border border-white/5 bg-[#0D0D0D] p-8 transition-all duration-300 hover:border-white/10 hover:bg-[#151515] h-full flex flex-col">
            <div className="flex flex-row items-center gap-4 mb-6">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0">
                    <Image
                        src={review.image}
                        alt={review.author}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <figcaption className="text-base font-bold text-white">
                        {review.author}
                    </figcaption>
                </div>
            </div>
            <blockquote className="text-base leading-relaxed text-gray-400 font-light flex-1">
                {review.text}
            </blockquote>
        </figure>
    );
}

function ReviewColumn({
    reviews,
    className,
    duration = 20
}: {
    reviews: Testimonial[];
    className?: string;
    duration?: number;
}) {
    // Double the array for marquee
    const doubledReviews = [...reviews, ...reviews];

    return (
        <div
            className={cn("animate-marquee space-y-6", className)}
            style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
        >
            {doubledReviews.map((review, i) => (
                <ReviewCard key={`${review.id}-${i}`} review={review} />
            ))}
        </div>
    );
}

export function TestimonialsSection() {
    const [userCount, setUserCount] = useState(1000);

    useEffect(() => {
        getRegisteredUserCount().then(setUserCount);
    }, []);

    return (
        <section className="py-24 bg-[#0B0F19] relative overflow-hidden">
            <Container className="relative z-10">
                <div className="text-center mb-16 md:mb-24 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black font-display text-white mb-6 tracking-tight">
                        ¿Qué dicen nuestros <span className="text-[#5D5CDE]">alumnos</span>?
                    </h2>
                    <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed">
                        La comunidad de Aurora Academy crece día a día. Descubre por qué miles de estudiantes eligen nuestra plataforma.
                    </p>

                    {/* Social Proof Block */}
                    <div className="mt-8 flex flex-col items-center justify-center gap-3">
                        <div className="flex items-center -space-x-3">
                            {TESTIMONIALS.slice(0, 5).map((t, i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0B0F19] bg-gray-800 overflow-hidden relative">
                                    <Image
                                        src={t.image}
                                        alt={t.author}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-[#0B0F19] bg-[#5D5CDE] flex items-center justify-center text-[10px] font-bold text-white">
                                +100
                            </div>
                        </div>
                        <p className="text-sm font-bold text-white tracking-wide">
                            Unite a <span className="text-[#5D5CDE]">+{userCount} alumnos activos</span>
                        </p>
                    </div>
                </div>

                <div className="relative h-[800px] max-h-[80vh] overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
                    <ReviewColumn reviews={TESTIMONIALS.slice(0, 3)} duration={45} />
                    <ReviewColumn reviews={TESTIMONIALS.slice(3, 6)} duration={55} className="hidden md:block" />
                    <ReviewColumn reviews={TESTIMONIALS.slice(6, 9)} duration={50} className="hidden lg:block" />
                </div>
            </Container>

            <style jsx global>{`
                @keyframes marquee {
                    from { transform: translateY(0); }
                    to { transform: translateY(calc(-50% - 12px)); }
                }
                .animate-marquee {
                    animation: marquee var(--marquee-duration) linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
