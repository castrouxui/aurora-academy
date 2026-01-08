"use client";

import { useSession } from "next-auth/react";
import { Container } from "@/components/layout/Container";
import { Navbar } from "@/components/layout/Navbar";
import { MyCourseCard } from "@/components/courses/MyCourseCard";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function MyCoursesPage() {
    const { data: session, status } = useSession();

    // Mock Enrolled Courses Data
    const myCourses = [
        {
            id: "trading-pro",
            title: "Trading Profesional: De Cero a Rentable",
            image: "/images/francisco-speaking.png",
            author: "Francisco Castro",
            progress: 35,
            lastLesson: "1.4 Velas Japonesas",
        },
        {
            id: "crypto-master",
            title: "Criptomonedas y Defi: El Futuro",
            image: "/images/francisco-speaking.png", // Using same image as placeholder for now
            author: "Aurora Team",
            progress: 0,
            lastLesson: "Bienvenida",
        },
        // Add a "Completed" course example
        {
            id: "finanzas-personales",
            title: "Finanzas Personales para Inversores",
            image: "/images/francisco-speaking.png", // Using same image as placeholder for now
            author: "Francisco Castro",
            progress: 100,
            lastLesson: "Examen Final",
        }
    ];

    // Simple client-side protection
    // In a real app, Middleware is better, but this works for now.
    useEffect(() => {
        if (status === "unauthenticated") {
            redirect("/");
        }
    }, [status]);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
            </div>
        );
    }

    if (!session) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white">
            <Navbar />

            <main className="pt-24 pb-16">
                <Container>
                    {/* Header */}
                    <div className="mb-10 border-b border-gray-800 pb-6">
                        <h1 className="text-3xl font-bold text-white mb-2">Mis Cursos</h1>
                        <p className="text-gray-400">
                            Bienvenido de nuevo, <span className="text-primary font-medium">{session.user?.name}</span>.
                            Continúa donde lo dejaste.
                        </p>
                    </div>

                    {/* Courses Grid */}
                    {myCourses.length > 0 ? (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {myCourses.map((course) => (
                                <MyCourseCard key={course.id} {...course} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-2xl border-dashed border-gray-800 bg-[#121620]">
                            <p className="text-xl text-gray-300 font-medium mb-4">Aún no estás inscrito en ningún curso.</p>
                            <p className="text-gray-500 mb-8 max-w-sm">Explora nuestro catálogo y comienza tu camino profesional hoy mismo.</p>
                            {/* Link to courses page */}
                        </div>
                    )}
                </Container>
            </main>
        </div>
    );
}
