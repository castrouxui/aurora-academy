"use client";

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
        <div className="py-12 md:py-16">
            <div className="bg-gradient-to-r from-[#5D5CDE]/10 to-transparent border-l-4 border-[#5D5CDE] p-8 md:p-12 rounded-r-2xl relative overflow-visible">
                {/* Decorative Quote Mark */}
                <span className="text-8xl text-[#5D5CDE]/20 font-serif absolute -top-8 -left-3 leading-none select-none">
                    “
                </span>

                {/* Quote Text */}
                <blockquote className="text-2xl md:text-3xl font-headings font-medium text-white italic leading-relaxed relative z-10 pl-2">
                    {quote}
                </blockquote>

                {/* Author Info */}
                <div className="mt-8 flex items-center gap-4 relative z-10 pl-2">
                    {authorImage ? (
                        <img
                            src={authorImage}
                            alt={authorName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white/10 shadow-lg"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-[#5D5CDE]/20 border border-[#5D5CDE]/30 flex items-center justify-center shrink-0 shadow-lg">
                            <span className="text-[#5D5CDE] font-bold text-sm">{initials}</span>
                        </div>
                    )}
                    <div>
                        <p className="font-bold text-white text-base">{authorName}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Estudiante Verificado</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
