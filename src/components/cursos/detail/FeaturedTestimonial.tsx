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
        <div className="py-12 w-full flex justify-center">
            {/* Width limited to 750px and centered */}
            <div className="bg-gradient-to-br from-[#5D5CDE]/10 to-transparent border border-[#5D5CDE]/20 p-8 md:p-12 rounded-3xl relative overflow-visible w-full max-w-[750px] text-center">
                {/* Decorative Quote Mark */}
                <span className="text-6xl md:text-8xl text-[#5D5CDE]/20 font-serif absolute -top-4 md:-top-8 left-1/2 -translate-x-1/2 leading-none select-none">
                    “
                </span>

                {/* Quote Text - Reduced size on mobile */}
                <blockquote className="text-xl md:text-3xl font-headings font-medium text-white italic leading-relaxed relative z-10">
                    {quote}
                </blockquote>

                {/* Author Info - Centered */}
                <div className="mt-8 flex flex-col items-center gap-3 relative z-10">
                    {authorImage ? (
                        <img
                            src={authorImage}
                            alt={authorName}
                            className="w-14 h-14 rounded-full object-cover border-2 border-white/10 shadow-lg"
                        />
                    ) : (
                        <div className="w-14 h-14 rounded-full bg-[#5D5CDE]/20 border border-[#5D5CDE]/30 flex items-center justify-center shrink-0 shadow-lg">
                            <span className="text-[#5D5CDE] font-bold text-base">{initials}</span>
                        </div>
                    )}
                    <div className="flex flex-col items-center">
                        <p className="font-bold text-white text-base">{authorName}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Estudiante Verificado</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
