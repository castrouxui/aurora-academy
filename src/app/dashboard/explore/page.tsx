"use client";

import { CourseCard } from "@/components/courses/CourseCard";
import { FilterModal, type FilterState } from "@/components/courses/FilterModal";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Mock data (extended) - reusing same data as main courses page
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


function ExploreContent() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<FilterState>({
        categories: [],
        levels: [],
        price: null
    });
    const [filteredCourses, setFilteredCourses] = useState(allCourses);
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search');
    const [searchTerm, setSearchTerm] = useState(searchQuery || "");

    useEffect(() => {
        if (searchQuery) setSearchTerm(searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        const term = searchTerm.toLowerCase();
        let filtered = allCourses;

        // Filter by Search Term
        if (term) {
            filtered = filtered.filter(course =>
                course.title.toLowerCase().includes(term) ||
                (course as any).tag?.toLowerCase().includes(term) ||
                course.instructor?.toLowerCase().includes(term)
            );
        }

        // Filter by Categories
        if (activeFilters.categories.length > 0) {
            filtered = filtered.filter(course => activeFilters.categories.some(cat => (course as any).tag?.includes(cat)));
        }

        // Filter by Price
        if (activeFilters.price) {
            if (activeFilters.price === "Gratis") {
                filtered = filtered.filter(c => c.price === "Gratis" || c.price === "$0");
            } else if (activeFilters.price === "De Pago") {
                filtered = filtered.filter(c => c.price !== "Gratis" && c.price !== "$0");
            }
        }

        setFilteredCourses(filtered);
    }, [searchTerm, activeFilters]);

    return (
        <div className="min-h-screen bg-[#0B0F19] pt-6 pb-20">
            <Container>
                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Explorar Catálogo</h1>
                    <p className="text-gray-400">Descubre nuevos conocimientos y habilidades.</p>
                </div>

                {/* Controls Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    {/* Filter Button */}
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-2 px-5 py-3 rounded-lg bg-[#1F2937] border border-gray-700 text-white hover:bg-gray-700 transition-colors bg-gradient-to-r from-transparent to-transparent hover:from-white/5 hover:to-white/5"
                    >
                        <SlidersHorizontal size={20} />
                        <span className="font-medium">Filtros</span>
                        {(activeFilters.categories.length + activeFilters.levels.length + (activeFilters.price ? 1 : 0)) > 0 && (
                            <span className="ml-1 bg-primary text-[10px] text-black w-5 h-5 flex items-center justify-center rounded-sm font-bold">
                                {activeFilters.categories.length + activeFilters.levels.length + (activeFilters.price ? 1 : 0)}
                            </span>
                        )}
                    </button>

                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Buscar curso, instructor o categoría..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-[50px] rounded-lg bg-[#1F2937] border border-gray-700 pl-11 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>

                    {/* Sort Dropdown (Visual mock for now to match UI) */}
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#1F2937] border border-gray-700 text-white cursor-pointer hover:bg-gray-700 transition-colors min-w-[200px] justify-between h-[50px]">
                        <span className="text-sm text-gray-400">Ordenar por:</span>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Populares</span>
                            <ChevronDown size={16} className="text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Tags and Results Count */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-gray-400">Sugerencias:</span>
                        {['análisis técnico', 'trading', 'finanzas', 'crypto', 'python'].map((tag) => (
                            <span key={tag} className="text-primary hover:text-primary/80 cursor-pointer font-medium transition-colors">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="text-gray-400">
                        <span className="font-bold text-white">{filteredCourses.length + (filteredCourses.length === allCourses.length ? allCourses.length : 0)}</span> resultados disponibles
                    </div>
                </div>

                {/* Course Grid - Full Width */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCourses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                    {/* Duplicating courses to fill grid for demo purposes if no filters active */}
                    {JSON.stringify(activeFilters) === JSON.stringify({ categories: [], levels: [], price: null }) && !searchTerm && allCourses.map((course) => (
                        <CourseCard key={`${course.id}-dup`} course={{ ...course, id: `${course.id}-dup` }} />
                    ))}
                </div>

            </Container>

            <FilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                activeFilters={activeFilters}
                onApply={setActiveFilters}
            />
        </div>
    );
}

export default function ExplorePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0B0F19] pt-12 text-center text-white">Cargando catálogo...</div>}>
            <ExploreContent />
        </Suspense>
    );
}
