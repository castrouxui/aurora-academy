import { Navbar } from "@/components/layout/Navbar";
import { HeroBanner } from "@/components/layout/HeroBanner";
import { Categories } from "@/components/courses/Categories";
import { CourseList } from "@/components/courses/CourseList";
import { CTASection } from "@/components/layout/CTASection";
import { Footer } from "@/components/layout/Footer";
import { StatsStrip } from "@/components/layout/StatsStrip";

import { TestimonialsSection } from "@/components/layout/TestimonialsSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0F19]">
      <Navbar />
      <div>
        <HeroBanner />

        <Categories />
        <div id="courses" className="scroll-mt-24">
          <CourseList />
        </div>

        <TestimonialsSection />
        <CTASection />

        <Footer />
      </div>
    </main>
  );
}
