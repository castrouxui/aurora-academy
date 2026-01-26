"use client";

import { Navbar } from "@/components/layout/Navbar";
import { CourseCatalog } from "@/components/cursos/CourseCatalog";
import { Suspense } from "react";

export default function CoursesPage() {
    return (
        <main className="min-h-screen bg-[#0B0F19]">
            <Navbar />
            <Suspense fallback={<div className="pt-32 text-center text-white">Cargando...</div>}>
                <CourseCatalog showTitle={true} paddingTop="pt-32" />
            </Suspense>
        </main>
    );
}
