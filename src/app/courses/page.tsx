import { Navbar } from "@/components/layout/Navbar";
import { CourseFilters } from "@/components/courses/CourseFilters";
import { CourseCard } from "@/components/courses/CourseCard";
import { Search } from "lucide-react";

// Mock data (extended)
const allCourses = [
    {
        id: "1",
        title: "The Complete 2024 Web Development Bootcamp",
        instructor: "Dr. Angela Yu",
        rating: 4.8,
        reviews: "(123)",
        price: "$19.99",
        oldPrice: "$99.99",
        image: "/course-1.jpg",
        tag: "Web Dev"
    },
    {
        id: "2",
        title: "Machine Learning A-Z: AI, Python & R + ChatGPT",
        instructor: "Kirill Eremenko",
        rating: 4.7,
        reviews: "(453)",
        price: "$24.99",
        oldPrice: "$89.99",
        image: "/course-2.jpg",
        tag: "Data Science"
    },
    {
        id: "3",
        title: "Financial Analysis and Investing Masterclass",
        instructor: "365 Careers",
        rating: 4.9,
        reviews: "(899)",
        price: "$14.99",
        oldPrice: "$99.99",
        image: "/course-3.jpg",
        tag: "Finance"
    },
    {
        id: "4",
        title: "Complete Python Bootcamp From Zero to Hero in Python",
        instructor: "Jose Portilla",
        rating: 4.7,
        reviews: "(2,300)",
        price: "$19.99",
        oldPrice: "$94.99",
        image: "/course-4.jpg",
        tag: "Python"
    },
    {
        id: "5",
        title: "Ethereum Blockchain Developer Bootcamp With Solidity",
        instructor: "Ravinder Deol",
        rating: 4.6,
        reviews: "(500)",
        price: "$29.99",
        oldPrice: "$120.00",
        image: "/course-5.jpg",
        tag: "Crypto"
    },
    {
        id: "6",
        title: "The Complete Digital Marketing Course - 12 Courses in 1",
        instructor: "Rob Percival",
        rating: 4.5,
        reviews: "(1,200)",
        price: "$22.99",
        oldPrice: "$149.99",
        image: "/course-6.jpg",
        tag: "Marketing"
    }
];

export default function CoursesPage() {
    return (
        <main className="min-h-screen bg-[#0B0F19]">
            <Navbar />

            <div className="container mx-auto px-4 pt-32 pb-20">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Catálogo de Cursos</h1>
                    <div className="relative max-w-xl">
                        <input
                            type="text"
                            placeholder="Buscar curso, instructor o categoría..."
                            className="w-full h-12 rounded-lg bg-[#1F2937] border border-gray-700 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <CourseFilters />
                    </aside>

                    {/* Course Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {allCourses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
