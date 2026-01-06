import { Button } from '@/components/ui/button';
import { CourseCard } from './CourseCard';

const courses = [
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
    }
];

export function CourseList() {
    return (
        <section className="py-20 bg-[#5D5CDE] text-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Cursos más elegidos</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {courses.map((course, i) => (
                        <CourseCard key={i} course={course} />
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold px-8">
                        Ver todos los cursos
                    </Button>
                </div>
            </div>
        </section>
    );
}
