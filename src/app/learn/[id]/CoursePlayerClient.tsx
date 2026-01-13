"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Play, CheckCircle, Lock, MonitorPlay, FileText, MessageSquare, Download, Trophy, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CertificateModal } from "@/components/certificates/CertificateModal";
import { VideoPlayer } from "@/components/player/VideoPlayer";

interface Lesson {
    id: string;
    title: string;
    description?: string;
    duration: string;
    completed: boolean;
    type: string;
    current?: boolean;
    locked?: boolean;
    videoUrl?: string;
}

interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
}

interface CoursePlayerProps {
    course: {
        id: string;
        title: string;
        modules: Module[];
    };
    isAccess: boolean; // Does user own this course?
    studentName: string;
}

export function CoursePlayerClient({ course, isAccess, studentName }: CoursePlayerProps) {
    const [activeTab, setActiveTab] = useState("description");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isCertificateOpen, setIsCertificateOpen] = useState(false);

    // Determine initial active lesson
    // If has access, first uncompleted or last played. 
    // If NO access, MUST be the first lesson (preview).
    const [activeLessonId, setActiveLessonId] = useState(() => {
        if (!isAccess) {
            const firstLesson = course.modules[0]?.lessons[0];
            return firstLesson ? firstLesson.id : null;
        }
        // Default to first lesson for now if logged in
        const firstLesson = course.modules[0]?.lessons[0];
        return firstLesson ? firstLesson.id : null;
    });

    // Helper to find lesson by ID
    const activeLesson = course.modules
        .flatMap(m => m.lessons)
        .find(l => l.id === activeLessonId);

    // Determines if CURRENTLY VIEWING lesson is locked
    const isCurrentLessonLocked = !isAccess && activeLessonId !== course.modules[0]?.lessons[0]?.id;

    // Determines if PREVIEW MODE applies (User has NO access AND it is the first lesson)
    const isPreviewMode = !isAccess && activeLessonId === course.modules[0]?.lessons[0]?.id;

    const completionDate = new Date().toLocaleDateString();

    // Local state for modules/lessons to handle optimistic updates
    const [localModules, setLocalModules] = useState(course.modules);

    // Calculate progress
    const totalLessons = localModules.reduce((acc, m) => acc + m.lessons.length, 0);
    const completedLessons = localModules.reduce((acc, m) => acc + m.lessons.filter(l => l.completed).length, 0);
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const handleToggleComplete = async (lessonId: string, currentStatus: boolean) => {
        // Optimistic update
        setLocalModules(prev => prev.map(m => ({
            ...m,
            lessons: m.lessons.map(l => l.id === lessonId ? { ...l, completed: !currentStatus } : l)
        })));

        try {
            await fetch("/api/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lessonId, completed: !currentStatus })
            });
        } catch (error) {
            console.error("Failed to update progress", error);
            // Revert on error (could implement if needed, skipping for now for speed)
        }
    };

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
                            <span className="text-gray-200 font-medium truncate">{course.title}</span>
                        </div>
                    </div>

                    {/* Video Player Container */}
                    <div className="bg-black w-full flex justify-center bg-[#050505]">
                        <div className="w-full max-w-5xl">
                            {activeLesson ? (
                                <VideoPlayer
                                    url={activeLesson.videoUrl || "/hero-video.mp4"} // Fallback video
                                    title={activeLesson.title}
                                    isLocked={isCurrentLessonLocked || false}
                                    previewMode={isPreviewMode}
                                    courseId={course.id}
                                />
                            ) : (
                                <div className="aspect-video bg-gray-900 flex items-center justify-center text-gray-400">
                                    Selecciona una lección
                                </div>
                            )}
                        </div>
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
                                {activeTab === "description" && activeLesson && (
                                    <>
                                        <div className="space-y-4">
                                            <h2 className="text-2xl font-bold">{activeLesson.title}</h2>
                                            <p className="text-gray-400 leading-relaxed">
                                                {activeLesson.description || "Sin descripción disponible para esta lección."}
                                            </p>
                                        </div>
                                        <div className="pt-4 flex items-center justify-end">
                                            <Button
                                                onClick={() => handleToggleComplete(activeLesson.id, activeLesson.completed)}
                                                variant={activeLesson.completed ? "outline" : "default"}
                                                className={cn(
                                                    "gap-2 transition-all",
                                                    activeLesson.completed
                                                        ? "border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                                                        : "bg-[#5D5CDE] text-white hover:bg-[#4B4AC0]"
                                                )}
                                            >
                                                {activeLesson.completed ? (
                                                    <>
                                                        <CheckCircle size={18} />
                                                        Completada
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle size={18} />
                                                        Marcar como Vista
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </>
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
                                                    <p className="font-medium text-gray-200">Recursos de la clase</p>
                                                    <p className="text-xs text-gray-500">Próximamente</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" disabled>Descargar</Button>
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
                                progress === 100 ? "text-white bg-green-600" : "text-emerald-400 bg-emerald-400/10"
                            )}>
                                {progress}% completado
                            </span>
                        </div>

                        {progress === 100 && (
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
                        {localModules.map((module, i) => (
                            <div key={i} className="border-b border-gray-800/50">
                                <div className="bg-gray-800/20 px-5 py-3 text-sm font-medium text-gray-300">
                                    {module.title}
                                </div>
                                <div>
                                    {module.lessons.map((lesson) => {
                                        const isLocked = !isAccess && lesson.id !== course.modules[0].lessons[0].id;
                                        return (
                                            <div
                                                key={lesson.id}
                                                onClick={() => setActiveLessonId(lesson.id)}
                                                className={cn(
                                                    "flex items-start gap-3 px-5 py-4 cursor-pointer hover:bg-gray-800/40 transition-colors border-l-2 border-transparent",
                                                    activeLessonId === lesson.id ? "bg-gray-800/60 border-primary" : "",
                                                    isLocked ? "" : ""
                                                )}
                                            >
                                                <div className="mt-0.5">
                                                    {isLocked ? (
                                                        <Lock size={16} className="text-gray-500" />
                                                    ) : lesson.completed ? (
                                                        <CheckCircle size={16} className="text-emerald-500" />
                                                    ) : (
                                                        <div className={cn(
                                                            "h-4 w-4 rounded-full border-2",
                                                            activeLessonId === lesson.id ? "border-primary" : "border-gray-500"
                                                        )} />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className={cn(
                                                        "text-sm font-medium mb-1",
                                                        activeLessonId === lesson.id ? "text-primary" : "text-gray-300"
                                                    )}>
                                                        {lesson.title}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <MonitorPlay size={12} />
                                                        <span>{lesson.duration || "10 min"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
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
                courseName={course.title}
                studentName={studentName}
                date={completionDate}
            />
        </div >
    );
}
