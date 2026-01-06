import { Navbar } from "@/components/layout/Navbar";
import { CourseHero } from "@/components/courses/CourseHero";
import { CurriculumList } from "@/components/courses/CurriculumList";
import { InstructorCard } from "@/components/courses/InstructorCard";
import { Button } from "@/components/ui/button";
import { PlayCircle, Award, Smartphone, Infinity, Download, FileText } from "lucide-react";

export default function CourseDetailPage({ params }: { params: { id: string } }) {
    // In a real app, fetch data based on params.id
    const courseData = {
        title: "The Complete 2024 Web Development Bootcamp",
        description: "Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node, React, PostgreSQL, Web3 and DApps",
        rating: 4.8,
        reviews: "345,120",
        students: "1,200,400",
        lastUpdated: "12/2025",
        language: "Español",
        price: "$19.99",
        oldPrice: "$99.99",
    };

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />
            <div className="pt-16">
                <CourseHero {...courseData} />

                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-8 relative">

                        {/* Main Content */}
                        <div className="lg:w-2/3 space-y-12">

                            {/* What you'll learn box */}
                            <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg bg-white dark:bg-[#1F2937]/30">
                                <h2 className="text-2xl font-bold mb-4 dark:text-white">Lo que aprenderás</h2>
                                <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
                                    <div className="flex gap-2"><span className="text-primary">✓</span> Build 16 web development projects for your portfolio</div>
                                    <div className="flex gap-2"><span className="text-primary">✓</span> Learn the latest technologies, including Javascript ES6, Bootstrap 5, etc.</div>
                                    <div className="flex gap-2"><span className="text-primary">✓</span> Master backend development with Node</div>
                                    <div className="flex gap-2"><span className="text-primary">✓</span> Build fully-fledged websites and web apps for your startup or business.</div>
                                </div>
                            </div>

                            <CurriculumList />

                            <InstructorCard />
                        </div>

                        {/* Sticky Sidebar */}
                        <div className="lg:w-1/3 relative">
                            <div className="sticky top-24 bg-white dark:bg-[#1F2937] p-1 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                {/* Video Preview Area */}
                                <div className="relative aspect-video bg-black rounded-xl overflow-hidden mb-4 group cursor-pointer">
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                                        <PlayCircle size={64} className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                    </div>
                                    <div className="absolute bottom-4 left-0 w-full text-center text-white font-bold text-sm">Vista previa del curso</div>
                                </div>

                                <div className="p-5 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{courseData.price}</span>
                                        <span className="text-gray-500 line-through text-lg">{courseData.oldPrice}</span>
                                        <span className="text-primary font-bold text-sm">80% de descuento</span>
                                    </div>

                                    <div className="space-y-3">
                                        <Button size="lg" className="w-full font-bold text-lg h-12">Comprar ahora</Button>
                                        <Button variant="outline" size="lg" className="w-full h-12">Añadir al carrito</Button>
                                    </div>

                                    <div className="text-center text-xs text-gray-500">
                                        Garantía de reembolso de 30 días
                                    </div>

                                    <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <h4 className="font-bold text-gray-900 dark:text-white">Este curso incluye:</h4>
                                        <div className="flex items-center gap-3"><PlayCircle size={16} /> 12.5 horas de video bajo demanda</div>
                                        <div className="flex items-center gap-3"><FileText size={16} /> 15 artículos</div>
                                        <div className="flex items-center gap-3"><Download size={16} /> 12 recursos descargables</div>
                                        <div className="flex items-center gap-3"><Infinity size={16} /> Acceso de por vida</div>
                                        <div className="flex items-center gap-3"><Smartphone size={16} /> Acceso en dispositivos móviles y TV</div>
                                        <div className="flex items-center gap-3"><Award size={16} /> Certificado de finalización</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
