import { Navbar } from "@/components/layout/Navbar";
import { HeroBanner } from "@/components/layout/HeroBanner";
import { SocialProofBar } from "@/components/layout/SocialProofBar";
import { Categories } from "@/components/cursos/Categories";
import { LearningPath } from "@/components/cursos/LearningPath";
import { CourseList } from "@/components/cursos/CourseList";
import { InstructorSection } from "@/components/layout/InstructorSection";
import { TestimonialsSection } from "@/components/layout/TestimonialsSection";
import { FAQSection } from "@/components/layout/FAQSection";
import { CTASection } from "@/components/layout/CTASection";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroBanner />
      <SocialProofBar />
      <Categories />
      <LearningPath />
      <div id="courses" className="scroll-mt-32">
        <CourseList />
      </div>
      <InstructorSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
