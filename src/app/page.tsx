import { Navbar } from "@/components/layout/Navbar";
import { HeroBanner } from "@/components/layout/HeroBanner";
import { Categories } from "@/components/courses/Categories";
import { CourseList } from "@/components/courses/CourseList";
import { CTASection } from "@/components/layout/CTASection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0F19]">
      <Navbar />
      <div className="pt-24">
        <HeroBanner />
        <Categories />
        <CourseList />

        <CTASection />

        {/* Extra spacing for footer area */}
        <div className="py-20 text-center text-gray-500">
          © 2026 Aurora Academy. Todos los derechos reservados.
        </div>
      </div>
    </main>
  );
}

