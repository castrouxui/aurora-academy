"use client";

import { CourseCard } from "@/components/courses/CourseCard";
import { FilterModal, type FilterState } from "@/components/courses/FilterModal";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface CourseCatalogProps {
    showTitle?: boolean;
    paddingTop?: string;
    basePath?: string; // New prop
}

export function CourseCatalog({ showTitle = true, paddingTop = "pt-32", basePath }: CourseCatalogProps) {
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [availableCategories, setAvailableCategories] = useState<string[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<FilterState>({
        categories: [],
        levels: [],
        price: null
    });
    const [sortBy, setSortBy] = useState("popular");
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search');
    const [searchTerm, setSearchTerm] = useState(searchQuery || "");

    useEffect(() => {
        if (searchQuery) setSearchTerm(searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        async function fetchCourses() {
            try {
                // Fetch published courses from API
                const res = await fetch("/api/courses?published=true");
                if (res.ok) {
                    const data = await res.json();

                    // Transform API data to UI format
                    const formattedCourses = data.map((course: any) => ({
                        id: course.id,
                        title: course.title,
                        instructor: "Aurora Academy", // Default instructor
                        rating: 5.0, // Default rating
                        reviews: "(0)",
                        price: new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(Number(course.price)),
                        image: course.imageUrl || "/course-placeholder.jpg",
                        tag: course.category || "General",
                        level: course.level || "Todos los niveles",
                        rawPrice: course.price,
                        createdAt: course.createdAt
                    }));
                    setCourses(formattedCourses);

                    const categories = Array.from(new Set(formattedCourses.map((c: any) => c.tag)));
                    setAvailableCategories(categories as string[]);
                }
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.tag.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeFilters.categories.length === 0 || activeFilters.categories.some(cat => course.tag.includes(cat));
        const matchesLevel = activeFilters.levels.length === 0 || activeFilters.levels.includes(course.level);

        let matchesPrice = true;
        if (activeFilters.price === "Gratis") matchesPrice = course.rawPrice === 0;
        if (activeFilters.price === "De Pago") matchesPrice = course.rawPrice > 0;

        return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    }).sort((a, b) => {
        switch (sortBy) {
            case "price-asc":
                return a.rawPrice - b.rawPrice;
            case "price-desc":
                return b.rawPrice - a.rawPrice;
            case "newest":
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case "popular":
            default:
                return 0;
        }
    });

    return (
        <div className={`${paddingTop} pb-20`}>
            <Container>
                {showTitle && (
                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-8">Catálogo de Cursos</h1>
                    </div>
                )}

                {/* Controls Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
                    >
                        <SlidersHorizontal size={20} />
                        <span className="font-bold">Filtros</span>
                        {(activeFilters.categories.length + activeFilters.levels.length + (activeFilters.price ? 1 : 0)) > 0 && (
                            <span className="ml-2 bg-[#5D5CDE] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                                {activeFilters.categories.length + activeFilters.levels.length + (activeFilters.price ? 1 : 0)}
                            </span>
                        )}
                    </button>

                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Buscar curso, instructor o categoría..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-[50px] rounded-full bg-white/5 border border-white/10 pl-12 pr-6 text-white placeholder-gray-400 focus:outline-none focus:border-[#5D5CDE]/50 focus:ring-1 focus:ring-[#5D5CDE]/50 transition-all backdrop-blur-sm"
                        />
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>

                    <div className="relative group min-w-[200px] h-[50px]">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none w-full h-full px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white cursor-pointer hover:bg-white/10 transition-colors pl-6 pr-12 focus:outline-none backdrop-blur-sm font-medium"
                        >
                            <option value="popular" className="bg-[#1F2937]">Más Populares</option>
                            <option value="newest" className="bg-[#1F2937]">Más Recientes</option>
                            <option value="price-asc" className="bg-[#1F2937]">Menor Precio</option>
                            <option value="price-desc" className="bg-[#1F2937]">Mayor Precio</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Tags and Results Count */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-gray-400">Sugerencias:</span>
                        {['análisis técnico', 'trading', 'finanzas', 'crypto', 'python'].map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setSearchTerm(tag)}
                                className="text-primary hover:text-primary/80 cursor-pointer font-medium transition-colors bg-transparent border-0 p-0"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                    <div className="text-gray-400">
                        <span className="font-bold text-white">{filteredCourses.length}</span> resultados encontrados
                    </div>
                </div>

                {/* Course Grid */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCourses.length > 0 ? (
                            filteredCourses.map((course) => (
                                <CourseCard key={course.id} course={{ ...course, basePath }} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                No se encontraron cursos publicados.
                            </div>
                        )}
                    </div>
                )}
            </Container>

            <FilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                activeFilters={activeFilters}
                onApply={setActiveFilters}
                categories={availableCategories}
            />
        </div>
    );
}
