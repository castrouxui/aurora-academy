"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/layout/Navbar";
import { Play, CheckCircle, Lock, MonitorPlay, FileText, MessageSquare, Download, Trophy, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CertificateModal } from "@/components/player/CertificateModal";

// Mock Data for the Course
interface Lesson {
    id: string;
    title: string;
    duration: string;
    completed: boolean;
    type: string;
    current?: boolean;
    locked?: boolean;
}

interface Module {
    title: string;
    lessons: Lesson[];
}

interface Course {
    title: string;
    progress: number;
    modules: Module[];
}

const courseData: Course = {
    title: "Trading Profesional: De Cero a Rentable",
    progress: 100, // Changed to 100 to demo certificate
    modules: [
        {
            title: "Módulo 1: Introducción a los Mercados",
            lessons: [
                { id: "1-1", title: "Bienvenida al Curso", duration: "5:00", completed: true, type: "video" },
                { id: "1-2", title: "¿Qué es el Trading?", duration: "12:30", completed: true, type: "video" },
                { id: "1-3", title: "Tipos de Mercados Financieros", duration: "15:45", completed: true, type: "video" },
                { id: "1-4", title: "Velas Japonesas", duration: "20:00", completed: true, current: false, type: "video" },
                { id: "1-5", title: "Quiz Módulo 1", duration: "10:00", completed: true, type: "quiz" },
            ]
        },
        {
            title: "Módulo 2: Análisis Técnico",
            lessons: [
                { id: "2-1", title: "Soportes y Resistencias", duration: "18:20", completed: true, type: "video", locked: false },
                { id: "2-2", title: "Tendencias y Canales", duration: "22:15", completed: true, type: "video", locked: false },
                { id: "2-3", title: "Patrones Gráficos", duration: "25:00", completed: true, type: "video", locked: false, current: true },
            ]
        }
    ]
};

export default function CoursePlayerPage({ params }: { params: { id: string } }) {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState("description");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isCertificateOpen, setIsCertificateOpen] = useState(false);

    const studentName = session?.user?.name || "Estudiante Demo";
    const completionDate = new Date().toLocaleDateString();

    return (
        <div className="flex h-screen flex-col bg-[#0B0F19] text-white overflow-hidden">
            <Navbar />

            <div className="flex flex-1 overflow-hidden pt-16">
                {/* Main Content Area */}
                <div className="flex flex-1 flex-col overflow-y-auto">

                    {/* Breadcrumb Navigation */}
                    <div className="px-6 py-4 text-sm text-gray-400 border-b border-gray-800 bg-[#0B0F19]">
                        <div className="max-w-5xl mx-auto w-full flex items-center gap-2">
                            <Link href="/my-courses" className="flex items-center gap-1 hover:text-white transition-colors">
                                <ChevronLeft size={16} />
                                Mis Cursos
                            </Link>
                            <span className="text-gray-700">/</span>
                            <span className="text-gray-200 font-medium truncate">{courseData.title}</span>
                        </div>
                    </div>

                    {/* Video Player Container */}
                    <div className="bg-black relative aspect-video w-full max-h-[70vh] flex items-center justify-center">
                        {/* Placeholder for Video Player */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col items-center justify-center">
                            <Button size="icon" className="h-20 w-20 rounded-full bg-primary/90 hover:bg-primary hover:scale-105 transition-all mb-4">
                                <Play fill="currentColor" className="ml-1 h-8 w-8 text-white" />
                            </Button>
                            <p className="text-xl font-medium">1.4 Velas Japonesas</p>
                        </div>
                        {/* In a real app, <video> or <iframe> goes here */}
                    </div>

                    {/* Content Tabs Area */}
                    <div className="flex-1 bg-[#0B0F19] p-6 lg:p-8">
                        <div className="mx-auto max-w-5xl">
                            <div className="mb-6 border-b border-gray-800">
                                <nav className="-mb-px flex space-x-8">
                                    {["description", "notes", "resources"].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={cn(
                                                "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors",
                                                activeTab === tab
                                                    ? "border-primary text-primary"
                                                    : "border-transparent text-gray-400 hover:border-gray-700 hover:text-gray-300"
                                            )}
                                        >
                                            {tab === "description" && "Descripción"}
                                            {tab === "notes" && "Apuntes"}
                                            {tab === "resources" && "Recursos"}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="min-h-[200px]">
                                {activeTab === "description" && (
                                    <div className="space-y-4">
                                        <h2 className="text-2xl font-bold">{courseData.modules[0].lessons[3].title}</h2>
                                        <p className="text-gray-400 leading-relaxed">
                                            En esta clase aprenderás la estructura básica de las velas japonesas, cómo interpretarlas
                                            y por qué son la herramienta fundamental para el análisis de acción del precio.
                                            Veremos los componentes de cuerpo y mecha, y qué nos dicen sobre la psicología del mercado.
                                        </p>
                                    </div>
                                )}
                                {activeTab === "notes" && (
                                    <div className="flex flex-col items-center justify-center py-12 text-gray-500 border border-dashed border-gray-800 rounded-xl bg-card/20">
                                        <FileText className="h-10 w-10 mb-3 opacity-50" />
                                        <p>Tus apuntes personales para esta clase irán aquí.</p>
                                    </div>
                                )}
                                {activeTab === "resources" && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-4 rounded-lg bg-card/40 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded bg-blue-500/10 text-blue-400">
                                                    <Download size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-200">Guía de Patrones de Velas.pdf</p>
                                                    <p className="text-xs text-gray-500">2.4 MB</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm">Descargar</Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Curriculum) */}
                <div className={cn(
                    "w-96 border-l border-gray-800 bg-[#121620] flex flex-col transition-all duration-300",
                    !sidebarOpen && "hidden"
                )}>
                    <div className="p-5 border-b border-gray-800">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-white">Contenido del Curso</h3>
                            <span className={cn(
                                "text-xs font-medium px-2 py-1 rounded-full",
                                courseData.progress === 100 ? "text-white bg-green-600" : "text-emerald-400 bg-emerald-400/10"
                            )}>
                                {courseData.progress}% completado
                            </span>
                        </div>

                        {courseData.progress === 100 && (
                            <div className="mt-2">
                                <Button
                                    onClick={() => setIsCertificateOpen(true)}
                                    className="w-full bg-[#D4AF37] hover:bg-[#b5952f] text-black font-bold gap-2 shadow-lg shadow-[#D4AF37]/20"
                                >
                                    <Trophy size={16} />
                                    Obtener Certificado
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {courseData.modules.map((module, i) => (
                            <div key={i} className="border-b border-gray-800/50">
                                <div className="bg-gray-800/20 px-5 py-3 text-sm font-medium text-gray-300">
                                    {module.title}
                                </div>
                                <div>
                                    {module.lessons.map((lesson) => (
                                        <div
                                            key={lesson.id}
                                            className={cn(
                                                "flex items-start gap-3 px-5 py-4 cursor-pointer hover:bg-gray-800/40 transition-colors border-l-2 border-transparent",
                                                lesson.current ? "bg-gray-800/60 border-primary" : "",
                                                lesson.locked ? "opacity-50 cursor-not-allowed" : ""
                                            )}
                                        >
                                            <div className="mt-0.5">
                                                {lesson.locked ? (
                                                    <Lock size={16} className="text-gray-500" />
                                                ) : lesson.completed ? (
                                                    <CheckCircle size={16} className="text-emerald-500" />
                                                ) : (
                                                    <div className={cn(
                                                        "h-4 w-4 rounded-full border-2",
                                                        lesson.current ? "border-primary" : "border-gray-500"
                                                    )} />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className={cn(
                                                    "text-sm font-medium mb-1",
                                                    lesson.current ? "text-primary" : "text-gray-300"
                                                )}>
                                                    {lesson.title}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <MonitorPlay size={12} />
                                                    <span>{lesson.duration}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Certificate Modal */}
            <CertificateModal
                isOpen={isCertificateOpen}
                onClose={() => setIsCertificateOpen(false)}
                courseName={courseData.title}
                studentName={studentName}
                date={completionDate}
            />
        </div>
    );
}
