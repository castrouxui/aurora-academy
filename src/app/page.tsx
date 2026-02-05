import { Navbar } from "@/components/layout/Navbar";
import { HeroBanner } from "@/components/layout/HeroBanner";
import { TrustBar } from "@/components/layout/TrustBar";
import { Categories } from "@/components/cursos/Categories";
import { CourseList } from "@/components/cursos/CourseList";
import { CTASection } from "@/components/layout/CTASection";
import { Footer } from "@/components/layout/Footer";
import { StatsStrip } from "@/components/layout/StatsStrip";

import { EcosystemSection } from "@/components/layout/EcosystemSection";
import { TestimonialsSection } from "@/components/layout/TestimonialsSection";
import { AuthoritySection } from "@/components/layout/AuthoritySection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0F19]">
      <Navbar />
      <div>
        <HeroBanner />
        <TrustBar />

        <Categories />
        <div id="courses" className="scroll-mt-32">
          <CourseList />
        </div>

        <AuthoritySection />
        <EcosystemSection />
        <TestimonialsSection />
        <CTASection />

        <Footer />
      </div>
    </main>
  );
}
