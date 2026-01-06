import { Navbar } from "@/components/layout/Navbar";
import { HeroBanner } from "@/components/layout/HeroBanner";
import { Categories } from "@/components/courses/Categories";
import { CourseList } from "@/components/courses/CourseList";
import { CTASection } from "@/components/layout/CTASection";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0F19]">
      <Navbar />
      <div className="pt-24">
        <HeroBanner />
        <Categories />
        <CourseList />

        <CTASection />

        <Footer />
      </div>
    </main>
  );
}
