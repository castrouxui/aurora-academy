
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AboutSection } from "@/components/layout/AboutSection";
import { MediaSection } from "@/components/layout/MediaSection";
import { TestimonialsSection } from "@/components/layout/TestimonialsSection";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#0B0F19]">
            <Navbar />
            <div className="pt-24">
                <AboutSection />
                <MediaSection />
                <TestimonialsSection />
                <Footer />
            </div>
        </main>
    );
}
