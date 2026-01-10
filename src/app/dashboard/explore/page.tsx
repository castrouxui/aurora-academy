"use client";

import { CourseCatalog } from "@/components/courses/CourseCatalog";
import { Suspense } from "react";

export default function ExplorePage() {
    return (
        <div className="min-h-screen bg-[#0B0F19]">
            <div className="mb-0 pt-6 px-4 md:px-8 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Explorar Catálogo</h1>
                <p className="text-gray-400">Descubre nuevos conocimientos y habilidades.</p>
            </div>

            <Suspense fallback={<div className="pt-8 text-center text-white">Cargando...</div>}>
                <CourseCatalog showTitle={false} paddingTop="pt-4" basePath="/dashboard/explore" />
            </Suspense>
        </div>
    );
}
