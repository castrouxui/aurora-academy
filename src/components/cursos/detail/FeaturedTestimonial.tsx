"use client";

import { Quote } from "lucide-react";

interface FeaturedTestimonialProps {
    quote: string;
    authorName: string;
    authorImage?: string;
}

export function FeaturedTestimonial({ quote, authorName, authorImage }: FeaturedTestimonialProps) {
    const initials = authorName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="py-10 md:py-14">
            <div className="bg-white/[0.025] border border-white/[0.06] rounded-xl p-6 md:p-8 relative overflow-hidden">
                {/* Subtle accent line on the left */}
                <div className="absolute left-0 top-6 bottom-6 w-[2px] bg-[#5D5CDE]/40 rounded-full" />

                {/* Quote icon */}
                <Quote size={24} className="text-[#5D5CDE]/25 mb-4 ml-1" />

                {/* Quote text */}
                <blockquote className="text-base md:text-lg text-gray-300 font-light leading-relaxed italic mb-6 ml-1">
                    &ldquo;{quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 ml-1">
                    {authorImage ? (
                        <img
                            src={authorImage}
                            alt={authorName}
                            className="w-9 h-9 rounded-full object-cover border border-white/10"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-[#5D5CDE]/15 border border-[#5D5CDE]/20 flex items-center justify-center">
                            <span className="text-[#5D5CDE] font-bold text-[11px]">{initials}</span>
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-white text-sm">{authorName}</p>
                        <p className="text-xs text-gray-600">Estudiante de Aurora Academy</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
