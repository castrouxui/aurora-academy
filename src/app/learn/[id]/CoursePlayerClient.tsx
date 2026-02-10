"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Play, CheckCircle, Lock, MonitorPlay, FileText, MessageSquare, Download, Trophy, ChevronLeft, FolderPlus, File as FileIcon, BrainCircuit, X, Loader2 } from "lucide-react";
import { cn, formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CertificateModal } from "@/components/certificates/CertificateModal";
import { RatingModal } from "@/components/reviews/RatingModal";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { RewardModal } from "@/components/rewards/RewardModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TripwireModal } from "@/components/dashboard/TripwireModal";

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
        description?: string;
        price?: number;
        modules: Module[];
    };
    isAccess: boolean; // Does user own this course?
    studentName: string;
    backLink: string;
    hasReviewed: boolean;
}

export function CoursePlayerClient({ course, isAccess, studentName, backLink, hasReviewed }: CoursePlayerProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("description");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isCertificateOpen, setIsCertificateOpen] = useState(false);
    const [isRatingOpen, setIsRatingOpen] = useState(false);
    const [hasUserReviewed, setHasUserReviewed] = useState(hasReviewed);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [rewardModalOpen, setRewardModalOpen] = useState(false);
    const [tripwireModalOpen, setTripwireModalOpen] = useState(false);
    const [isEnrolling, setIsEnrolling] = useState(false);


    // Determine initial active lesson
    // If has access, first uncompleted or last played. 
    // If NO access, MUST be the first lesson (preview).
    const [activeLessonId, setActiveLessonId] = useState(() => {
        if (!isAccess) {
            const firstLesson = course.modules[0]?.lessons?.[0];
            return firstLesson ? firstLesson.id : null;
        }
        // Default to first lesson for now if logged in
        const firstLesson = course.modules[0]?.lessons?.[0];
        return firstLesson ? firstLesson.id : null;
    });

    // Helper to find lesson by ID
    const activeLesson = course.modules
        .flatMap(m => m.lessons)
        .find(l => l.id === activeLessonId);

    // Determines if CURRENTLY VIEWING lesson is locked
    // Strict Mode: If no access, EVERYTHING is locked.
    const isCurrentLessonLocked = !isAccess;

    // Determines if PREVIEW MODE applies
    // Disabled: User requested no access for unpaid users.
    const isPreviewMode = false;

    const completionDate = new Date().toLocaleDateString();

    // Quiz State Removed
    // const [quizOpen, setQuizOpen] = useState(false);
    // ...


    // Local state for modules/lessons to handle optimistic updates
    const [localModules, setLocalModules] = useState(course.modules);

    // Calculate progress
    const totalLessons = localModules.reduce((acc, m) => acc + m.lessons.length, 0);
    const completedLessons = localModules.reduce((acc, m) => acc + m.lessons.filter(l => l.completed).length, 0);
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const handleFreeEnroll = async () => {
        setIsEnrolling(true);
        try {
            const res = await fetch("/api/enroll/free", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId: course.id }),
            });

            if (res.ok) {
                toast.success("¡Inscripción exitosa!");
                router.refresh(); // Just refresh to update UI state
            } else {
                const data = await res.json();
                toast.error(data.message || "Error al inscribirse");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error de conexión");
        } finally {
            setIsEnrolling(false);
        }
    };

    const handleToggleComplete = async (lessonId: string, currentStatus: boolean) => {
        // Quiz check removed


        // Optimistic update
        setLocalModules(prev => prev.map(m => ({
            ...m,
            lessons: m.lessons.map(l => l.id === lessonId ? { ...l, completed: !currentStatus } : l)
        })));

        try {
            const res = await fetch("/api/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lessonId, completed: !currentStatus })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.rewardGranted) {
                    setRewardModalOpen(true);
                }
            }
        } catch (error) {
            console.error("Failed to update progress", error);
            // Revert on error (could implement if needed, skipping for now for speed)
        }
    };

    // Debounced Progress Update
    const progressTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

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
        if (progressTimeoutRef.current[activeLesson.id]) {
            clearTimeout(progressTimeoutRef.current[activeLesson.id]);
        }

        progressTimeoutRef.current[activeLesson.id] = setTimeout(async () => {
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

                    if (data.rewardGranted) {
                        setRewardModalOpen(true);
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
                    <div className="bg-black w-full flex justify-center bg-[#050505] py-0 lg:py-10 aspect-video lg:aspect-auto border-b border-gray-800 lg:border-none relative">
                        <div className="w-full lg:max-w-5xl h-full lg:h-auto relative">
                            {/* Enrollment Overlay if Locked and Free */}
                            {!isAccess && course.price === 0 && (
                                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                                    <div className="text-center p-6 bg-[#13151A] border border-[#5D5CDE]/30 rounded-2xl shadow-xl max-w-sm w-full mx-4">
                                        <div className="w-12 h-12 bg-[#5D5CDE]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Play className="text-[#5D5CDE] fill-current" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Comenzar Curso Gratis</h3>
                                        <p className="text-sm text-gray-400 mb-6">Inscríbete ahora para acceder a todas las lecciones y comenzar tu camino.</p>
                                        <Button
                                            onClick={handleFreeEnroll}
                                            disabled={isEnrolling}
                                            className="w-full bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white font-bold h-12 rounded-xl"
                                        >
                                            {isEnrolling ? <Loader2 className="animate-spin mr-2" /> : null}
                                            {isEnrolling ? "Inscribiendo..." : "Comenzar Ahora"}
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {activeLesson ? (
                                <VideoPlayer
                                    key={activeLesson.id} // Re-mount on lesson change to reset player state correctly
                                    url={activeLesson.videoUrl || "/hero-video.mp4"} // Fallback video
                                    title={activeLesson.title}
                                    isLocked={isCurrentLessonLocked || false}
                                    previewMode={isPreviewMode}
                                    courseId={course.id}
                                    onProgressUpdate={handleProgressUpdate}
                                    initialProgress={activeLesson.lastPlayedTime}
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
                                    onComplete={() => {
                                        if (activeLesson && !activeLesson.completed) {
                                            handleToggleComplete(activeLesson.id, false);
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
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                                            <div className="space-y-4 flex-1">
                                                <h2 className="text-xl lg:text-3xl font-bold text-white leading-tight">{activeLesson.title}</h2>
                                                <div className="text-sm lg:text-base text-gray-400 leading-relaxed max-w-3xl prose prose-invert">
                                                    {/* Show Lesson Description OR Course Description as fallback */}
                                                    {activeLesson.description ? (
                                                        <p>{activeLesson.description}</p>
                                                    ) : (
                                                        <div className="opacity-80">
                                                            <p className="text-xs font-bold uppercase tracking-wider mb-2 text-gray-500">Descripción del Curso</p>
                                                            <p>{course.description || "Sin descripción disponible."}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <Button
                                                onClick={() => handleToggleComplete(activeLesson.id, activeLesson.completed)}
                                                variant={activeLesson.completed ? "outline" : "default"}
                                                size="lg"
                                                className={cn(
                                                    "shrink-0 gap-2 transition-all font-bold h-12 px-6 rounded-xl border-2",
                                                    activeLesson.completed
                                                        ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                                                        : "bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white border-transparent shadow-lg shadow-indigo-500/20"
                                                )}
                                            >
                                                {activeLesson.completed ? (
                                                    <>
                                                        <CheckCircle size={20} className="fill-current" />
                                                        Completada
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle size={20} />
                                                        Marcar como Vista
                                                    </>
                                                )}
                                            </Button>
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
                    "fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#0E1016] border-l border-gray-800/50 shadow-2xl transform transition-transform duration-300 lg:relative lg:transform-none lg:w-[400px] lg:flex lg:flex-col lg:z-auto flex flex-col",
                    mobileMenuOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
                )}>
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="lg:hidden absolute top-4 right-4 z-50 p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700"
                    >
                        <X size={20} />
                    </button>

                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-gray-800/50 bg-[#0E1016]">
                        <h3 className="font-bold text-white text-lg mb-4">Contenido del Curso</h3>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-semibold uppercase tracking-wide">
                                <span className="text-gray-400">Tu Progreso</span>
                                <span className={cn(progress === 100 ? "text-emerald-400" : "text-[#5D5CDE]")}>
                                    {progress}%
                                </span>
                            </div>
                            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className={cn("h-full rounded-full transition-all duration-500", progress === 100 ? "bg-emerald-500" : "bg-[#5D5CDE]")}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {progress === 100 && (
                            <div className="mt-6 animate-in fade-in slide-in-from-top-2">
                                <Button
                                    onClick={() => {
                                        if (!hasUserReviewed) {
                                            setIsRatingOpen(true);
                                        } else {
                                            setIsCertificateOpen(true);
                                        }
                                    }}
                                    className="w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-bold h-10 gap-2 shadow-lg shadow-amber-500/20 border-0"
                                >
                                    <Trophy size={16} />
                                    {hasUserReviewed ? "Ver Certificado" : "Reclamar Certificado"}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Lesson List */}
                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                        {localModules.map((module, i) => (
                            <div key={i} className="border-b border-gray-800/30">
                                <div className="bg-[#090b10] px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest sticky top-0 z-10 backdrop-blur-md bg-opacity-90">
                                    {module.title}
                                </div>
                                <div>
                                    {module.lessons.map((lesson) => {
                                        const isLocked = !isAccess && lesson.id !== course.modules[0].lessons[0].id;
                                        const isActive = activeLessonId === lesson.id;

                                        return (
                                            <button
                                                key={lesson.id}
                                                onClick={() => {
                                                    if (!isLocked) {
                                                        setActiveLessonId(lesson.id);
                                                        setMobileMenuOpen(false);
                                                    }
                                                }}
                                                disabled={isLocked}
                                                className={cn(
                                                    "w-full text-left flex items-start gap-4 px-6 py-4 transition-all relative group",
                                                    isActive
                                                        ? "bg-[#1F2937]/30"
                                                        : "hover:bg-gray-800/30",
                                                    isLocked && "opacity-50 cursor-not-allowed"
                                                )}
                                            >
                                                {/* Active Indicator Line */}
                                                {isActive && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#5D5CDE] shadow-[0_0_10px_rgba(93,92,222,0.5)]" />
                                                )}

                                                {/* Icon State */}
                                                <div className="mt-0.5 shrink-0">
                                                    {lesson.completed ? (
                                                        <div className="bg-emerald-500/10 text-emerald-500 rounded-full p-0.5">
                                                            <CheckCircle size={16} />
                                                        </div>
                                                    ) : isLocked ? (
                                                        <Lock size={16} className="text-gray-600" />
                                                    ) : isActive ? (
                                                        <div className="bg-[#5D5CDE] text-white rounded-full p-1 animate-pulse">
                                                            <Play size={10} fill="currentColor" />
                                                        </div>
                                                    ) : (
                                                        <div className="border-2 border-gray-600 rounded-full w-4 h-4" />
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className={cn(
                                                        "text-sm font-medium leading-snug mb-1 transition-colors",
                                                        isActive ? "text-white" : "text-gray-400 group-hover:text-gray-200"
                                                    )}>
                                                        {lesson.title}
                                                    </p>
                                                    <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                                                        <span className="flex items-center gap-1">
                                                            <MonitorPlay size={10} />
                                                            {lesson.duration || "10 min"}
                                                        </span>
                                                        {lesson.lastPlayedTime && lesson.lastPlayedTime > 0 && !lesson.completed && (
                                                            <span className="text-[#5D5CDE]">
                                                                Continuar
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Rating Modal */}
            <RatingModal
                isOpen={isRatingOpen}
                onClose={() => setIsRatingOpen(false)}
                onSuccess={() => {
                    setHasUserReviewed(true);
                    setIsRatingOpen(false);
                    setIsCertificateOpen(true);
                }}
                courseId={course.id}
                courseName={course.title}
            />

            {/* Certificate Modal */}
            <CertificateModal
                isOpen={isCertificateOpen}
                onClose={() => setIsCertificateOpen(false)}
                courseName={course.title}
                studentName={studentName}
                date={completionDate}
            />

            {/* Reward Modal */}
            <RewardModal
                isOpen={rewardModalOpen}
                onClose={() => {
                    setRewardModalOpen(false);
                    // Hook to trigger Tripwire Modal for specific course
                    if (course.id === 'cl_camino_inversor') {
                        setTripwireModalOpen(true);
                    }
                }}
                couponCode="LANZAMIENTO10"
            />

            {/* Tripwire Modal */}
            <TripwireModal
                isOpen={tripwireModalOpen}
                onClose={() => setTripwireModalOpen(false)}
            />
        </div>
    );
}
