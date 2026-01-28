"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Play, CheckCircle, Lock, MonitorPlay, FileText, MessageSquare, Download, Trophy, ChevronLeft, FolderPlus, File as FileIcon } from "lucide-react";
import { cn, formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CertificateModal } from "@/components/certificates/CertificateModal";
import { VideoPlayer } from "@/components/player/VideoPlayer";

interface Lesson {
    id: string;
    title: string;
    description?: string;
    duration: string;
    durationSeconds?: number;
    completed: boolean;
    lastPlayedTime?: number;
    type: string;
    current?: boolean;
    locked?: boolean;
    videoUrl?: string;
    resources?: { id: string; title: string; url: string; type: string }[];
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
    backLink: string;
}

export function CoursePlayerClient({ course, isAccess, studentName, backLink }: CoursePlayerProps) {
    const [activeTab, setActiveTab] = useState("description");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isCertificateOpen, setIsCertificateOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    // Debounced Progress Update
    const progressTimeoutRef = useState<{ [key: string]: NodeJS.Timeout }>({})[0];

    const handleProgressUpdate = (seconds: number, total: number) => {
        if (!activeLesson) return;

        // Update local state immediately for smooth UI
        setLocalModules(prev => prev.map(m => ({
            ...m,
            lessons: m.lessons.map(l => {
                if (l.id === activeLesson.id) {
                    return {
                        ...l,
                        lastPlayedTime: seconds,
                        durationSeconds: total > 0 ? total : l.durationSeconds
                    };
                }
                return l;
            })
        })));


        // API Update (Debounced 2s)
        if (progressTimeoutRef[activeLesson.id]) {
            clearTimeout(progressTimeoutRef[activeLesson.id]);
        }

        progressTimeoutRef[activeLesson.id] = setTimeout(async () => {
            try {
                const res = await fetch("/api/progress", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        lessonId: activeLesson.id,
                        seconds: Math.floor(seconds),
                        totalDuration: Math.floor(total),
                        completed: false // Let the backend decide completion based on %
                    })
                });

                if (res.ok) {
                    const data = await res.json();

                    // If backend says it's completed, update local state to reflect that!
                    if (data.completed && !activeLesson.completed) {
                        setLocalModules(prev => prev.map(m => ({
                            ...m,
                            lessons: m.lessons.map(l => {
                                if (l.id === activeLesson.id) {
                                    return { ...l, completed: true };
                                }
                                return l;
                            })
                        })));
                    }
                }
            } catch (error) {
                console.error("Failed to update progress", error);
            }
        }, 2000);
    };

    return (
        <div className="flex h-screen flex-col bg-[#0B0F19] text-white overflow-hidden">
            <Navbar />

            <div className="flex flex-1 overflow-hidden pt-16 flex-col lg:flex-row relative">
                {/* Main Content Area */}
                <div className="flex flex-1 flex-col overflow-y-auto w-full">

                    {/* Breadcrumb Navigation - Mobile Optimized */}
                    <div className="px-4 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-gray-400 border-b border-gray-800 bg-[#0B0F19] flex justify-between items-center w-full">
                        <div className="flex items-center gap-2 truncate">
                            <Link href={backLink} className="flex items-center gap-1 hover:text-white transition-colors shrink-0">
                                <ChevronLeft size={16} />
                                <span className="hidden sm:inline">Mis Cursos</span>
                            </Link>
                            <span className="text-gray-700 hidden sm:inline">/</span>
                            <span className="text-gray-200 font-medium truncate max-w-[150px] sm:max-w-md">{course.title}</span>
                        </div>

                        {/* Mobile Sidebar Toggle Button */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden flex items-center gap-2 bg-[#5D5CDE]/10 text-[#5D5CDE] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#5D5CDE]/20 transition-all border border-[#5D5CDE]/20"
                        >
                            <FileText size={14} />
                            Ver Temario
                        </button>
                    </div>

                    {/* Video Player Container - Full Width on Mobile */}
                    <div className="bg-black w-full flex justify-center bg-[#050505] py-0 lg:py-10 aspect-video lg:aspect-auto border-b border-gray-800 lg:border-none">
                        <div className="w-full lg:max-w-5xl h-full lg:h-auto">
                            {activeLesson ? (
                                <VideoPlayer
                                    key={activeLesson.id} // Re-mount on lesson change to reset player state correctly
                                    url={activeLesson.videoUrl || "/hero-video.mp4"} // Fallback video
                                    title={activeLesson.title}
                                    isLocked={isCurrentLessonLocked || false}
                                    previewMode={isPreviewMode}
                                    courseId={course.id}
                                    onProgressUpdate={handleProgressUpdate}
                                    onDuration={(d: number) => {
                                        // Auto-update duration if it's currently 0 (00:00)
                                        if (activeLesson.duration === "00:00" && d > 0) {
                                            const newDuration = Math.floor(d);

                                            // Optimistic update
                                            setLocalModules(prev => prev.map(m => ({
                                                ...m,
                                                lessons: m.lessons.map(l => {
                                                    if (l.id === activeLesson.id) {
                                                        return { ...l, duration: formatDuration(newDuration) };
                                                    }
                                                    return l;
                                                })
                                            })));

                                            // API persist
                                            fetch(`/api/lessons/${activeLesson.id}`, {
                                                method: "PATCH",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ duration: newDuration })
                                            }).catch(err => console.error("Failed to update duration", err));
                                        }
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full aspect-video bg-gray-900 flex items-center justify-center text-gray-400">
                                    Selecciona una lección
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Tabs Area */}
                    <div className="flex-1 bg-[#0B0F19] p-4 lg:p-8">
                        <div className="mx-auto max-w-5xl">
                            <div className="mb-6 border-b border-gray-800 overflow-x-auto">
                                <nav className="-mb-px flex space-x-6 lg:space-x-8">
                                    {["description", "resources"].map((tab) => (
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
                                            {tab === "resources" && "Recursos"}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="min-h-[200px] pb-20 lg:pb-0">
                                {activeTab === "description" && activeLesson && (
                                    <>
                                        <div className="space-y-4">
                                            <h2 className="text-xl lg:text-2xl font-bold">{activeLesson.title}</h2>
                                            <p className="text-sm lg:text-base text-gray-400 leading-relaxed">
                                                {activeLesson.description || "Sin descripción disponible para esta lección."}
                                            </p>
                                        </div>

                                        {/* New Intuitive Completion UI */}
                                        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-800/50 mt-6">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "h-12 w-12 rounded-full flex items-center justify-center transition-all shadow-lg",
                                                    activeLesson.completed
                                                        ? "bg-emerald-500/20 text-emerald-400 shadow-emerald-500/10"
                                                        : "bg-gray-800 text-gray-500"
                                                )}>
                                                    {activeLesson.completed ? <CheckCircle size={24} className="animate-in zoom-in duration-300" /> : <MonitorPlay size={24} />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">Estado de la clase</p>
                                                    <p className={cn("text-sm transition-colors", activeLesson.completed ? "text-emerald-400" : "text-gray-400")}>
                                                        {activeLesson.completed ? "¡Lección completada!" : "En progreso..."}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <label className="relative inline-flex items-center cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={activeLesson.completed}
                                                        onChange={() => handleToggleComplete(activeLesson.id, activeLesson.completed)}
                                                    />
                                                    <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                                                    <span className="ml-3 text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                                                        {activeLesson.completed ? "Marcada como vista" : "Marcar como vista"}
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </>

                                )}
                                {activeTab === "resources" && activeLesson && (
                                    <div className="space-y-3">
                                        {activeLesson.resources && activeLesson.resources.length > 0 ? (
                                            activeLesson.resources.map((resource: any) => (
                                                <div key={resource.id} className="flex items-center justify-between p-4 rounded-lg bg-card/40 border border-gray-800 hover:border-gray-700 transition-colors group">
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <div className="p-2 rounded bg-blue-500/10 text-blue-400 shrink-0">
                                                            {resource.type === 'PDF' ? <FileText size={20} /> : <Download size={20} />}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-medium text-gray-200 truncate text-sm lg:text-base">{resource.title}</p>
                                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                                <span className="uppercase">{resource.type || 'Archivo'}</span>
                                                                <span className="hidden sm:inline">•</span>
                                                                <span className="truncate max-w-[200px] opacity-70 hidden sm:inline">{resource.url}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <a
                                                        href={resource.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ml-4 flex items-center gap-2 bg-[#1F2937] hover:bg-white hover:text-black text-xs font-bold py-2 px-3 lg:px-4 rounded-lg transition-all"
                                                    >
                                                        <Download size={14} />
                                                        <span className="hidden sm:inline">Abrir</span>
                                                    </a>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-gray-800 rounded-xl bg-gray-900/30">
                                                <div className="bg-gray-800/50 p-4 rounded-full mb-3">
                                                    <FolderPlus className="h-8 w-8 text-gray-600" />
                                                </div>
                                                <p className="text-gray-300 font-medium">No hay recursos disponibles</p>
                                                <p className="text-sm text-gray-500 mt-1 max-w-sm">
                                                    Esta clase no tiene archivos adjuntos o material complementario por el momento.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Curriculum) - Desktop & Mobile Overlay */}
                {/* Mobile Overlay Background */}
                <div
                    className={cn(
                        "fixed inset-0 bg-black/80 z-40 lg:hidden transition-opacity duration-300",
                        mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                />

                <div className={cn(
                    "fixed inset-y-0 right-0 z-50 w-80 bg-[#121620] border-l border-gray-800 shadow-2xl transform transition-transform duration-300 lg:relative lg:transform-none lg:w-96 lg:flex lg:flex-col lg:z-auto",
                    mobileMenuOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
                )}>
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="lg:hidden absolute top-4 right-4 text-gray-400 hover:text-white"
                    >
                        <ChevronLeft size={24} className="rotate-180" />
                    </button>

                    <div className="p-5 border-b border-gray-800 pt-12 lg:pt-5">
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
                                        // Calculate percentage for visual progress bar
                                        // Assuming average lesson is 10 mins (600s) if duration not set/parsed?? 
                                        // Lesson duration is string "MM:SS" ?? No, in interface it is string.
                                        // But wait, in schema it is Int (Seconds). 
                                        // In page.tsx we formatted it using formatDuration. 
                                        // To calculate progress bar width we need TOTAL seconds.
                                        // We might need to store totalSeconds in the Lesson interface or parse it back.
                                        // Simpler: Just rely on lastPlayedTime if we have it? 
                                        // Let's guess max 100% or use a simple indicator if we don't have total.

                                        // Actually I can try to parse lesson.duration string back to seconds or add rawDuration to interface.
                                        // For now let's just show a simple bar if lastPlayedTime > 0

                                        return (
                                            <div
                                                key={lesson.id}
                                                onClick={() => setActiveLessonId(lesson.id)}
                                                className={cn(
                                                    "flex items-start gap-3 px-5 py-4 cursor-pointer hover:bg-gray-800/40 transition-colors border-l-2 border-transparent relative overflow-hidden",
                                                    activeLessonId === lesson.id ? "bg-gray-800/60 border-primary" : "",
                                                    isLocked ? "" : ""
                                                )}
                                            >
                                                {/* Visual Progress Bar Background - Subtle */}
                                                {lesson.lastPlayedTime && !lesson.completed && (
                                                    <div
                                                        className="absolute bottom-0 left-0 h-[2px] bg-primary/50 transition-all duration-500"
                                                        style={{
                                                            width: `${Math.min((lesson.lastPlayedTime / (lesson.durationSeconds || 600)) * 100, 100)}%`
                                                        }}
                                                    />
                                                )}


                                                <div className="mt-0.5 relative z-10">
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
                                                <div className="flex-1 relative z-10">
                                                    <p className={cn(
                                                        "text-sm font-medium mb-1",
                                                        activeLessonId === lesson.id ? "text-primary" : "text-gray-300"
                                                    )}>
                                                        {lesson.title}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <MonitorPlay size={12} />
                                                        <span>{lesson.duration || "10 min"}</span>
                                                        {lesson.lastPlayedTime && lesson.lastPlayedTime > 0 && !lesson.completed && (
                                                            <span className="text-primary ml-2">
                                                                Retomar {formatDuration(lesson.lastPlayedTime)}
                                                            </span>
                                                        )}
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
            </div >

            {/* Certificate Modal */}
            < CertificateModal
                isOpen={isCertificateOpen}
                onClose={() => setIsCertificateOpen(false)
                }
                courseName={course.title}
                studentName={studentName}
                date={completionDate}
            />
        </div >
    );
}
