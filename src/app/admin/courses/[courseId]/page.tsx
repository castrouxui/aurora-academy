"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, X, Plus, GripVertical, Trash2, ChevronDown, ChevronRight, Video, FileText, MoreVertical, Link as LinkIcon, Image as ImageIcon, CheckCircle, AlertCircle, Loader2, FolderPlus, ArrowLeft, Layers, Globe, Eye, EyeOff, UploadCloud, BarChart, Tag, DollarSign, FileVideo, File as FileIcon, Save, Send, BrainCircuit, Check, Circle } from "lucide-react";

import { toast } from "sonner";

import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useUploadThing } from "@/lib/uploadthing";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

interface Lesson {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    duration: number;
    published: boolean;
    position: number;
    resources: { id: string; title: string; url: string; type: string }[];
    quiz?: { id: string; question: string; options: string[]; correctOption: number } | null;
}

interface Module {
    id: string;
    title: string;
    position: number;
    lessons: Lesson[];
}

interface Course {
    id: string;
    title: string;
    description: string;
    shortDescription?: string;
    price: number;
    imageUrl: string;
    category: string;
    level: string;
    learningOutcomes?: string;
    published: boolean;
    modules: Module[];
}

export default function CourseEditorPage() {
    const params = useParams();
    const courseId = params?.courseId as string;
    const router = useRouter();

    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isAnnouncing, setIsAnnouncing] = useState(false);

    // Add Module State
    const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
    const [moduleTitle, setModuleTitle] = useState("");
    const [isSubmittingModule, setIsSubmittingModule] = useState(false);

    // Add Lesson State
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
    const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
    const [lessonTitle, setLessonTitle] = useState("");
    const [lessonUrl, setLessonUrl] = useState("");
    const [lessonDesc, setLessonDesc] = useState("");
    const [lessonDuration, setLessonDuration] = useState(0);
    const [isSubmittingLesson, setIsSubmittingLesson] = useState(false);

    // Resource State
    const [resourceTitle, setResourceTitle] = useState("");
    const [resourceUrl, setResourceUrl] = useState("");
    const [isAddingResource, setIsAddingResource] = useState(false);

    // Quiz State
    const [quizQuestion, setQuizQuestion] = useState("");
    const [quizOptions, setQuizOptions] = useState<string[]>(["", "", "", ""]);
    const [quizCorrectOption, setQuizCorrectOption] = useState(0);
    const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

    // Upload State
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadSpeed, setUploadSpeed] = useState("");
    const [timeRemaining, setTimeRemaining] = useState("");

    // Refs for calculation
    const lastUploadTime = useRef<number>(0);
    const lastUploadBytes = useRef<number>(0);

    // Price Local State
    const [priceInput, setPriceInput] = useState("");

    const fetchCourse = async () => {
        try {
            const res = await fetch(`/api/courses/${courseId}`);
            if (!res.ok) throw new Error("Course not found");
            const data = await res.json();
            setCourse(data);
        } catch (error) {
            console.error(error);
            // router.push("/admin/courses");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (courseId) {
            fetchCourse();
        }
    }, [courseId]);

    const [titleInput, setTitleInput] = useState("");

    // Sync input when course loads
    useEffect(() => {
        if (course) {
            setPriceInput(course.price.toString());
            setTitleInput(course.title);
        }
    }, [course]);

    const handleSaveCourse = async () => {
        if (!course) return;
        setIsSaving(true);
        try {
            const price = priceInput === "" ? 0 : parseFloat(priceInput);

            const res = await fetch(`/api/courses/${courseId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: titleInput,
                    description: course.description,
                    shortDescription: course.shortDescription,
                    price: price,
                    category: course.category,
                    level: course.level,
                    imageUrl: course.imageUrl,
                    // published is handled separately, but we could include it if we wanted strict sync
                }),
            });

            if (res.ok) {
                toast.success("Curso guardado correctamente");
                // Optional: Update explicitly if backend sanitizes something, but usually not needed for simple fields
                fetchCourse();
            } else {
                toast.error("Error al guardar los cambios");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar los cambios");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddModule = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingModule(true);
        try {
            const res = await fetch(`/api/courses/${courseId}/modules`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: moduleTitle }),
            });
            if (res.ok) {
                setIsAddModuleOpen(false);
                setModuleTitle("");
                fetchCourse();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmittingModule(false);
        }
    };

    const handleAddLesson = async (e: React.FormEvent) => {
        e.preventDefault();
        // If adding new, need activeModuleId. If editing, activeModuleId might be null if not updating module, but we set it in openEditLesson
        if (!activeModuleId && !activeLessonId) return;

        setIsSubmittingLesson(true);
        try {
            let res;
            if (activeLessonId) {
                // Update existing lesson
                res = await fetch(`/api/lessons/${activeLessonId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: lessonTitle,
                        videoUrl: lessonUrl,
                        description: lessonDesc,
                        duration: lessonDuration // Added
                    }),
                });
            } else {
                // Create new lesson
                res = await fetch(`/api/courses/${courseId}/lessons`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: lessonTitle,
                        videoUrl: lessonUrl,
                        description: lessonDesc,
                        moduleId: activeModuleId,
                        duration: lessonDuration // Added
                    }),
                });
            }

            if (res.ok) {
                if (!activeLessonId) {
                    // Only close and reset if creating new. If editing, maybe keep open or close? 
                    // Let's close for now to be consistent
                    setIsAddLessonOpen(false);
                    setLessonTitle("");
                    setLessonUrl("");
                    setLessonDesc("");
                } else {
                    // Refetch to update UI but maybe keep dialog open?
                    // The user might want to add resources immediately after editing details.
                    // But for "Guardar Clase", usually expects close.
                    setIsAddLessonOpen(false);
                }
                fetchCourse();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmittingLesson(false);
        }
    };

    const handleDeleteLesson = async () => {
        if (!activeLessonId) return;
        if (!confirm("¿Estás seguro de eliminar esta clase? Esta acción no se puede deshacer.")) return;

        setIsSubmittingLesson(true);
        try {
            const res = await fetch(`/api/lessons/${activeLessonId}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setIsAddLessonOpen(false);
                fetchCourse();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmittingLesson(false);
        }
    };

    const handleDeleteModule = async (moduleId: string) => {
        if (!confirm("¿Estás seguro de eliminar este módulo? Se eliminaran todas las clases que contiene.")) return;

        try {
            const res = await fetch(`/api/courses/${courseId}/modules/${moduleId}`, {
                method: "DELETE"
            });
            if (res.ok) {
                toast.success("Módulo eliminado");
                fetchCourse();
            } else {
                toast.error("Error al eliminar el módulo");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al eliminar el módulo");
        }
    };

    // UploadThing Hooks
    // We need 'file' in scope for calculation, but it's not available here. 
    // We'll store the 'activeFile' in a ref or state when upload starts to calculate speed.
    const activeFileRef = useRef<File | null>(null);

    const { startUpload: startVideoUpload } = useUploadThing("chapterVideo", {
        onClientUploadComplete: (res) => {
            if (res && res[0]) {
                const uploadedUrl = res[0].url;
                setLessonUrl(uploadedUrl);
                setIsUploading(false);
                toast.success("Video subido correctamente");
                setLessonDuration(0); // Reset duration so new video is re-detected

                // Auto-save if editing an existing lesson
                if (activeLessonId) {
                    toast.loading("Guardando video...", { id: "autosave-video" });
                    fetch(`/api/lessons/${activeLessonId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            videoUrl: uploadedUrl,
                        }),
                    }).then(async (response) => {
                        if (response.ok) {
                            toast.success("Video guardado y vinculado a la clase", { id: "autosave-video" });
                            // Refresh course data to ensure everything is synced
                            fetchCourse();
                        } else {
                            toast.error("Error al guardar el video en la base de datos", { id: "autosave-video" });
                        }
                    }).catch(err => {
                        console.error("Auto-save error:", err);
                        toast.error("Error de conexión al guardar", { id: "autosave-video" });
                    });
                }
            }
        },
        onUploadError: (error) => {
            console.error(error);
            setIsUploading(false);
            toast.error(`Error uploading video: ${error.message}`);
        },
        onUploadProgress: (progress) => {
            setUploadProgress(progress);

            // Calculate Speed and ETA if we have the file ref
            if (activeFileRef.current) {
                const now = Date.now();
                const timeDiff = (now - lastUploadTime.current) / 1000; // seconds

                if (timeDiff >= 1) { // Update every second
                    const fileSize = activeFileRef.current.size;
                    const currentBytes = (progress / 100) * fileSize;
                    const bytesDiff = currentBytes - lastUploadBytes.current;

                    if (bytesDiff > 0) {
                        const speed = bytesDiff / timeDiff; // bytes/sec

                        // Speed to MB/s
                        const speedMB = (speed / (1024 * 1024)).toFixed(2);
                        setUploadSpeed(`${speedMB} MB/s`);

                        // Remaining Time
                        const remainingBytes = fileSize - currentBytes;
                        const secondsLeft = remainingBytes / speed;

                        if (isFinite(secondsLeft)) {
                            if (secondsLeft < 60) {
                                setTimeRemaining(`${Math.ceil(secondsLeft)} seg`);
                            } else {
                                const mins = Math.floor(secondsLeft / 60);
                                const secs = Math.ceil(secondsLeft % 60);
                                setTimeRemaining(`${mins} min ${secs} seg`);
                            }
                        }

                        lastUploadTime.current = now;
                        lastUploadBytes.current = currentBytes;
                    }
                }
            }
        }
    });

    const { startUpload: startResourceUpload } = useUploadThing("courseAttachment", {
        onClientUploadComplete: (res) => {
            if (res && res[0]) {
                setResourceUrl(res[0].url);
                if (!resourceTitle) {
                    setResourceTitle(res[0].name);
                }
                setIsUploading(false);
            }
        },
        onUploadError: (error) => {
            console.error(error);
            setIsUploading(false);
            alert(`Error uploading resource: ${error.message}`);
        }
    });

    const { startUpload: startImageUpload } = useUploadThing("courseImage", {
        onClientUploadComplete: async (res) => {
            if (res && res[0] && course) {
                const newImageUrl = res[0].url;
                // Optimistic Update
                setCourse({ ...course, imageUrl: newImageUrl });
                setIsUploading(false);

                // Persist
                try {
                    await fetch(`/api/courses/${courseId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ imageUrl: newImageUrl }),
                    });
                } catch (e) {
                    console.error(e);
                }
            }
        },
        onUploadError: (error) => {
            console.error(error);
            setIsUploading(false);
            alert(`Error uploading image: ${error.message}`);
        }
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        // Validations
        if (file.size > 2 * 1024 * 1024 * 1024) {
            toast.error("El archivo excede el límite de 2GB");
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setUploadSpeed("Calculando...");
        setTimeRemaining("Calculando...");
        lastUploadTime.current = Date.now();
        lastUploadBytes.current = 0;
        activeFileRef.current = file;

        try {
            await startVideoUpload([file]);

            // Note: Success handling is done in onClientUploadComplete

        } catch (error: any) {
            console.error("Upload setup error:", error);
            // Error handling is also done in onUploadError callback of useUploadThing
            setIsUploading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation: 8MB limit
        if (file.size > 8 * 1024 * 1024) {
            toast.error("La imagen no puede superar los 8MB");
            return;
        }

        setIsUploading(true);
        try {
            await startImageUpload([file]);
        } catch (error) {
            console.error("Image upload failed", error);
            setIsUploading(false);
            // toast.error is handled by onUploadError, but double check
        }
    };

    const handleResourceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            await startResourceUpload([file]);
        } catch (error) {
            console.error("Resource upload failed", error);
            setIsUploading(false);
        }
    };

    const togglePublish = async () => {
        if (!course) return;
        try {
            const res = await fetch(`/api/courses/${courseId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ published: !course.published }),
            });
            if (res.ok) fetchCourse();
        } catch (error) {
            console.error(error);
        }
    };

    const handleAnnounce = async () => {
        if (!course) return;
        if (!confirm(`¿Querés anunciar el curso "${course.title}" en Telegram?`)) return;

        setIsAnnouncing(true);
        try {
            const message = `🚀 <b>¡Nuevo Curso Lanzado!</b>\n\n<b>${course.title}</b>\n\n${course.shortDescription || course.description || ""}\n\n👉 <a href="${window.location.origin}/cursos/${course.id}">¡Miralos ahora!</a>`;

            const res = await fetch("/api/admin/telegram/broadcast", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

            if (res.ok) {
                toast.success("Anuncio enviado correctamente");
            } else {
                toast.error("Error al enviar el anuncio");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error de conexión");
        } finally {
            setIsAnnouncing(false);
        }
    };

    const openAddLesson = (moduleId: string) => {
        setActiveModuleId(moduleId);
        setActiveLessonId(null);
        setLessonTitle("");
        setLessonUrl("");
        setLessonDesc("");
        setResourceTitle("");
        setResourceUrl("");
        // Clear Quiz
        setQuizQuestion("");
        setQuizOptions(["", "", "", ""]);
        setQuizCorrectOption(0);
        setIsAddLessonOpen(true);
    };

    const openEditLesson = (lesson: Lesson, moduleId: string) => {
        setActiveModuleId(moduleId);
        setActiveLessonId(lesson.id);
        setLessonTitle(lesson.title);
        setLessonUrl(lesson.videoUrl || "");
        setLessonDesc(lesson.description || "");
        setResourceTitle("");
        setResourceUrl("");

        // Set Quiz
        if (lesson.quiz) {
            setQuizQuestion(lesson.quiz.question);
            setQuizOptions(lesson.quiz.options.length >= 2 ? lesson.quiz.options : ["", "", "", ""]);
            setQuizCorrectOption(lesson.quiz.correctOption);
        } else {
            setQuizQuestion("");
            setQuizOptions(["", "", "", ""]);
            setQuizCorrectOption(0);
        }
        setIsAddLessonOpen(true);
    };

    const handleAddResource = async () => {
        if (!activeLessonId || !resourceTitle || !resourceUrl) return;
        setIsAddingResource(true);
        try {
            const res = await fetch("/api/resources", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: resourceTitle,
                    url: resourceUrl,
                    lessonId: activeLessonId
                })
            });
            if (res.ok) {
                setResourceTitle("");
                setResourceUrl("");
                fetchCourse();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsAddingResource(false);
        }
    };

    const handleDeleteResource = async (resourceId: string) => {
        try {
            const res = await fetch(`/api/resources/${resourceId}`, {
                method: "DELETE"
            });
            if (res.ok) fetchCourse();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveQuiz = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeLessonId) return;

        // Validation
        if (!quizQuestion.trim()) return toast.error("La pregunta es requerida");
        if (quizOptions.some(opt => !opt.trim())) return toast.error("Completa todas las opciones");

        setIsSubmittingQuiz(true);
        try {
            const res = await fetch(`/api/lessons/${activeLessonId}/quiz`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question: quizQuestion,
                    options: quizOptions,
                    correctOption: quizCorrectOption
                })
            });

            if (res.ok) {
                toast.success("Quiz guardado correctamente");
                fetchCourse();
            } else {
                toast.error("Error al guardar el quiz");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar el quiz");
        } finally {
            setIsSubmittingQuiz(false);
        }
    };

    const handleDeleteQuiz = async () => {
        if (!activeLessonId) return;
        if (!confirm("¿Eliminar la pregunta de esta clase?")) return;

        setIsSubmittingQuiz(true);
        try {
            const res = await fetch(`/api/lessons/${activeLessonId}/quiz`, {
                method: "DELETE"
            });
            if (res.ok) {
                toast.success("Quiz eliminado");
                setQuizQuestion("");
                setQuizOptions(["", "", "", ""]);
                setQuizCorrectOption(0);
                fetchCourse();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmittingQuiz(false);
        }
    };

    // Rendering
    if (!course) return null;

    return (
        <div className="space-y-6 pb-20">
            {/* Header Section */}
            <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                        <Link href="/admin/courses">
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5 rounded-xl">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <Badge variant="outline" className={`${course.published ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                                    {course.published ? 'Publicado' : 'Borrador'}
                                </Badge>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Layers size={12} /> {course.modules?.length || 0} Módulos
                                </span>
                            </div>
                            <Input
                                value={titleInput}
                                onChange={(e) => setTitleInput(e.target.value)}
                                className="text-3xl font-bold text-white tracking-tight bg-transparent border-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-600 w-full"
                                placeholder="Título del Curso"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={handleSaveCourse}
                            disabled={isSaving}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 border border-emerald-500/20 gap-2"
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Guardar Cambios
                        </Button>

                        <Link href={`/learn/${course.id}`} target="_blank">
                            <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white hover:bg-white/5 gap-2">
                                <Globe size={16} />
                                Ver Curso
                            </Button>
                        </Link>

                        {course.published && (
                            <Button
                                onClick={handleAnnounce}
                                disabled={isAnnouncing}
                                className="bg-sky-500 hover:bg-sky-600 text-white gap-2 shadow-lg shadow-sky-500/20 border-transparent"
                            >
                                {isAnnouncing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                Anunciar en Telegram
                            </Button>
                        )}

                        <Button
                            onClick={togglePublish}
                            className={course.published
                                ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/20"
                                : "bg-[#5D5CDE] text-white hover:bg-[#4B4AC0] shadow-lg shadow-[#5D5CDE]/20"}
                        >
                            {course.published ? (
                                <><EyeOff size={16} className="mr-2" /> Pausar Curso</>
                            ) : (
                                <><Eye size={16} className="mr-2" /> Publicar Curso</>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Course Cover Image */}
                <div className="bg-[#1F2937]/30 border border-gray-800 p-6 rounded-2xl">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-full md:w-1/3 aspect-video relative rounded-xl overflow-hidden bg-[#0f1118] border border-gray-700 shadow-2xl group">
                            {course.imageUrl ? (
                                <>
                                    <img
                                        src={course.imageUrl}
                                        alt="Course cover"
                                        className="w-full h-full object-cover transition-opacity group-hover:opacity-50"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <label className="cursor-pointer bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors flex items-center gap-2">
                                            <UploadCloud size={16} /> Cambiar Portada
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                                        </label>
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                                    <ImageIcon size={40} className="opacity-50" />
                                    <span className="text-xs font-medium">Sin imagen</span>
                                    <label className="mt-2 cursor-pointer bg-[#5D5CDE]/10 text-[#5D5CDE] px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#5D5CDE]/20 transition-colors">
                                        Subir Imagen
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                                    </label>
                                </div>
                            )}
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                                    <Loader2 className="animate-spin text-white h-8 w-8" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                    <ImageIcon size={20} className="text-[#5D5CDE]" /> Portada del Curso
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Esta imagen se mostrará en el listado de cursos y en la cabecera de la página del curso.
                                    <br />Recomendado: 1920x1080px (16:9). Formatos: PNG, JPG, WebP.
                                </p>
                            </div>

                            {!course.imageUrl && (
                                <div className="flex gap-4">
                                    <label className="cursor-pointer bg-[#5D5CDE] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#4B4AC0] transition-colors shadow-lg shadow-[#5D5CDE]/20 flex items-center gap-2">
                                        <UploadCloud size={18} /> Subir Portada
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Metadata Controls Bar */}
                <div className="bg-[#1F2937]/50 border border-gray-800 p-6 rounded-2xl space-y-3">
                    <Label className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <FileText size={16} /> Bajada del Curso (Resumen)
                    </Label>
                    <p className="text-xs text-gray-500">Breve descripción que aparecerá en la tarjeta y encabezado del curso (Hero).</p>
                    <Textarea
                        value={course.shortDescription || ""}
                        onChange={(e) => setCourse({ ...course, shortDescription: e.target.value })}
                        onBlur={async () => {
                            if (!course) return;
                            try {
                                await fetch(`/api/courses/${courseId}`, {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ shortDescription: course.shortDescription }),
                                });
                                toast.success("Bajada guardada");
                            } catch (error) {
                                console.error(error);
                                toast.error("Error al guardar la bajada");
                            }
                        }}
                        className="bg-[#0b0e14] border-gray-700 focus:border-[#5D5CDE] min-h-[80px] text-base text-gray-300 rounded-xl resize-none p-4 leading-relaxed"
                        placeholder="Resumen corto e impactante..."
                    />
                </div>

                <div className="bg-[#1F2937]/50 border border-gray-800 p-6 rounded-2xl space-y-3">
                    <Label className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <FileText size={16} /> Descripción del Curso
                    </Label>
                    <Textarea
                        value={course.description || ""}
                        onChange={(e) => setCourse({ ...course, description: e.target.value })}
                        onBlur={async () => {
                            if (!course) return;
                            try {
                                await fetch(`/api/courses/${courseId}`, {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ description: course.description }),
                                });
                                toast.success("Descripción guardada");
                            } catch (error) {
                                console.error(error);
                                toast.error("Error al guardar la descripción");
                            }
                        }}
                        className="bg-[#0b0e14] border-gray-700 focus:border-[#5D5CDE] min-h-[120px] text-base text-gray-300 rounded-xl resize-none p-4 leading-relaxed"
                        placeholder="Escribe una descripción completa del curso..."
                    />
                </div>

                {/* Metadata Controls Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Category Selector */}
                    <div className="bg-[#1F2937]/50 border border-gray-800 p-3 rounded-xl flex items-center justify-between group hover:border-gray-700 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-[#5D5CDE]/10 flex items-center justify-center text-[#5D5CDE]">
                                <Tag size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Categoría</p>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="text-sm font-medium text-white flex items-center gap-1 hover:text-[#5D5CDE] transition-colors focus:outline-none">
                                            {course.category || "Seleccionar"} <ChevronDown size={14} className="opacity-50" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="bg-[#1F2937] border-gray-700 text-white">
                                        <DropdownMenuLabel>Seleccionar Categoría</DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-gray-700" />
                                        {["General", "Trading", "Crypto", "Finanzas", "Psicología"].map((cat) => (
                                            <DropdownMenuItem
                                                key={cat}
                                                onClick={async () => {
                                                    setCourse({ ...course, category: cat });
                                                    try {
                                                        await fetch(`/api/courses/${courseId}`, {
                                                            method: "PATCH",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({ category: cat }),
                                                        });
                                                    } catch (e) {
                                                        console.error(e);
                                                    }
                                                }}
                                                className="hover:bg-white/10 cursor-pointer"
                                            >
                                                {cat}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>

                    {/* Level Selector */}
                    <div className="bg-[#1F2937]/50 border border-gray-800 p-3 rounded-xl flex items-center justify-between group hover:border-gray-700 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <BarChart size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Nivel</p>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="text-sm font-medium text-white flex items-center gap-1 hover:text-emerald-500 transition-colors focus:outline-none">
                                            {course.level || "Seleccionar"} <ChevronDown size={14} className="opacity-50" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="bg-[#1F2937] border-gray-700 text-white">
                                        {["Todos los niveles", "Principiante", "Intermedio", "Avanzado"].map((lvl) => (
                                            <DropdownMenuItem
                                                key={lvl}
                                                onClick={async () => {
                                                    setCourse({ ...course, level: lvl });
                                                    try {
                                                        await fetch(`/api/courses/${courseId}`, {
                                                            method: "PATCH",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({ level: lvl }),
                                                        });
                                                    } catch (e) { console.error(e); }
                                                }}
                                                className="hover:bg-white/10 cursor-pointer"
                                            >
                                                {lvl}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>

                    {/* Price Input */}
                    <div className="bg-[#1F2937]/50 border border-gray-800 p-3 rounded-xl flex items-center justify-between group hover:border-gray-700 transition-colors">
                        <div className="flex items-center gap-3 w-full">
                            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                                <DollarSign size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Precio (ARS)</p>
                                <div className="flex items-center gap-1">
                                    <span className="text-gray-400 font-medium">$</span>
                                    <input
                                        type="number"
                                        value={priceInput}
                                        onChange={(e) => setPriceInput(e.target.value)}
                                        onBlur={async () => {
                                            if (!course) return;
                                            const newPrice = priceInput === "" ? 0 : parseFloat(priceInput);

                                            // Optimistic UI update
                                            setCourse({ ...course, price: newPrice });

                                            try {
                                                await fetch(`/api/courses/${courseId}`, {
                                                    method: "PATCH",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ price: newPrice }),
                                                });
                                            } catch (error) { console.error(error); }
                                        }}
                                        className="bg-transparent text-white font-medium border-none p-0 focus:ring-0 w-full h-auto text-sm placeholder:text-gray-600 appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-1">
                {/* Course Content Area */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-white">Contenido del Curso</h2>

                        <Dialog open={isAddModuleOpen} onOpenChange={setIsAddModuleOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#1F2937] hover:bg-gray-700 text-white gap-2 border border-gray-700">
                                    <FolderPlus size={16} />
                                    Nuevo Módulo
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#1F2937] border-gray-700 text-white">
                                <DialogHeader>
                                    <DialogTitle>Crear Nuevo Módulo</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddModule} className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Título del Módulo</Label>
                                        <Input
                                            value={moduleTitle}
                                            onChange={(e) => setModuleTitle(e.target.value)}
                                            className="bg-[#121620] border-gray-600"
                                            placeholder="Ej: Módulo 1: Introducción"
                                            required
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={isSubmittingModule} className="bg-[#5D5CDE] text-white w-full">
                                            {isSubmittingModule ? <Loader2 className="animate-spin" /> : "Crear Módulo"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Add Lesson Dialog (Shared) */}
                    <Dialog open={isAddLessonOpen} onOpenChange={setIsAddLessonOpen}>
                        <DialogContent className="bg-[#0f111a] border border-gray-800 text-white sm:max-w-[600px] shadow-2xl p-0 overflow-hidden rounded-2xl">
                            <form onSubmit={handleAddLesson} className="flex flex-col h-[85vh]">
                                <DialogHeader className="px-6 py-5 border-b border-gray-800 bg-[#141824]/50 backdrop-blur-sm">
                                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                        {activeLessonId ? "Editar Contenido" : "Nueva Clase"}
                                    </DialogTitle>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {activeLessonId ? "Administra el contenido y los recursos de esta lección." : "Agrega una nueva lección al módulo."}
                                    </p>
                                </DialogHeader>

                                <Tabs defaultValue="content" className="flex-1 flex flex-col overflow-hidden">
                                    <div className="px-6 border-b border-gray-800 bg-[#1a1f2e]/50">
                                        <TabsList className="bg-transparent h-12 p-0 w-full justify-start gap-6">
                                            <TabsTrigger
                                                value="content"
                                                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-[#5D5CDE] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 text-gray-400 data-[state=active]:text-white font-medium bg-transparent"
                                            >
                                                Contenido
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="resources"
                                                disabled={!activeLessonId}
                                                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-[#5D5CDE] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 text-gray-400 data-[state=active]:text-white font-medium bg-transparent disabled:opacity-30"
                                            >
                                                Recursos Adicionales
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="quiz"
                                                disabled={!activeLessonId}
                                                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-[#5D5CDE] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 text-gray-400 data-[state=active]:text-white font-medium bg-transparent disabled:opacity-30"
                                            >
                                                Cuestionario (Quiz)
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>

                                    <div className="flex-1 overflow-y-auto bg-[#0f111a]">
                                        <TabsContent value="content" className="p-6 space-y-6 mt-0">
                                            {/* Title Section */}
                                            <div className="space-y-3">
                                                <Label className="text-sm font-medium text-gray-300">Título de la Clase</Label>
                                                <div className="relative group">
                                                    <Input
                                                        value={lessonTitle}
                                                        onChange={(e) => setLessonTitle(e.target.value)}
                                                        className="bg-[#1a1f2e] border-gray-700 focus:border-[#5D5CDE] text-white h-12 rounded-xl transition-all pl-4 text-base shadow-sm group-hover:border-gray-600"
                                                        placeholder="Ej: Introducción a Velas Japonesas"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Video Upload Section */}
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-sm font-medium text-gray-300">Video de la Clase</Label>
                                                    {lessonUrl && (
                                                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                                            Video cargado
                                                        </span>
                                                    )}
                                                </div>

                                                <Tabs defaultValue="url" className="w-full">
                                                    <TabsList className="grid w-full grid-cols-2 mb-4 bg-[#1a1f2e] border border-gray-800">
                                                        <TabsTrigger value="upload" className="data-[state=active]:bg-[#5D5CDE] data-[state=active]:text-white text-gray-400">
                                                            <UploadCloud size={16} className="mr-2" /> Subir Archivo
                                                        </TabsTrigger>
                                                        <TabsTrigger value="url" className="data-[state=active]:bg-[#5D5CDE] data-[state=active]:text-white text-gray-400">
                                                            <LinkIcon size={16} className="mr-2" /> URL Externa
                                                        </TabsTrigger>
                                                    </TabsList>

                                                    <TabsContent value="upload" className="mt-0">
                                                        <div className={`relative group border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 ease-out
                                                            ${lessonUrl && !getYouTubeId(lessonUrl) ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-gray-700 bg-[#1a1f2e]/30 hover:bg-[#1a1f2e] hover:border-[#5D5CDE]/50'}`}>

                                                            {isUploading ? (
                                                                <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300 w-full max-w-xs">
                                                                    <div className="w-full space-y-2">
                                                                        <div className="flex justify-between text-xs text-gray-300">
                                                                            <span className="font-medium">Subiendo video...</span>
                                                                            <span>{uploadProgress}%</span>
                                                                        </div>
                                                                        <Progress value={uploadProgress} className="h-2 bg-gray-700" />
                                                                        <div className="flex justify-between text-[10px] text-gray-500">
                                                                            <span>{uploadSpeed || "Calculando..."}</span>
                                                                            <span>ETA: {timeRemaining || "..."}</span>
                                                                        </div>
                                                                    </div>

                                                                </div>

                                                            ) : lessonUrl && !getYouTubeId(lessonUrl) ? (
                                                                <div className="w-full flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                                    <div className="h-16 w-16 rounded-2xl bg-[#0f1118] flex items-center justify-center border border-gray-700 shadow-lg">
                                                                        <FileVideo size={32} className="text-emerald-400" />
                                                                    </div>
                                                                    <div className="text-center w-full px-4">
                                                                        <p className="text-sm text-gray-300 font-medium truncate max-w-full block mb-2">Video cargado exitosamente</p>
                                                                        <p className="text-xs text-gray-500 mb-4 break-all opacity-60">{lessonUrl}</p>

                                                                        <div className="flex gap-2 justify-center">
                                                                            <label htmlFor="file-upload" className="relative z-50 inline-flex items-center gap-2 text-xs font-medium text-[#5D5CDE] bg-[#5D5CDE]/10 px-3 py-1.5 rounded-lg hover:bg-[#5D5CDE]/20 cursor-pointer transition-colors">
                                                                                <UploadCloud size={12} />
                                                                                Reemplazar video
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <div className="h-14 w-14 rounded-2xl bg-[#1a1f2e] group-hover:bg-[#5D5CDE] transition-colors flex items-center justify-center mb-4 shadow-xl border border-gray-700 group-hover:border-[#5D5CDE]">
                                                                        <UploadCloud className="h-7 w-7 text-gray-400 group-hover:text-white transition-colors" />
                                                                    </div>
                                                                    <p className="text-sm text-gray-300 font-medium mb-1">
                                                                        Arrastra tu video aquí
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 mb-4">
                                                                        o haz clic para explorar tus archivos
                                                                    </p>
                                                                    <span className="text-[10px] text-gray-600 bg-gray-900 px-2 py-1 rounded border border-gray-800">
                                                                        MP4, WebM • Max 2GB
                                                                    </span>
                                                                </>
                                                            )}
                                                            <input
                                                                id="file-upload"
                                                                type="file"
                                                                accept="video/*"
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                                                                onChange={handleFileUpload}
                                                                disabled={isUploading}
                                                            />
                                                        </div>
                                                    </TabsContent>

                                                    <TabsContent value="url" className="mt-0">
                                                        <div className="space-y-4 p-6 bg-[#1a1f2e]/30 rounded-2xl border border-gray-700">
                                                            <div className="space-y-2">
                                                                <Label className="text-xs text-gray-400">Enlace del video (YouTube, Vimeo)</Label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <LinkIcon size={14} className="text-gray-500" />
                                                                    </div>
                                                                    <Input
                                                                        value={lessonUrl}
                                                                        onChange={(e) => setLessonUrl(e.target.value)}
                                                                        className="bg-[#0b0e14] border-gray-800 text-sm pl-9 h-10 placeholder:text-gray-600 focus:border-[#5D5CDE] transition-colors rounded-xl"
                                                                        placeholder="https://youtu.be/..."
                                                                    />
                                                                </div>
                                                                <p className="text-[10px] text-gray-500">
                                                                    Tip: Para videos privados de YouTube, usa la opción &quot;No listado&quot; (Unlisted).
                                                                </p>
                                                            </div>

                                                            {getYouTubeId(lessonUrl) && (
                                                                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-gray-700 shadow-lg group/preview">
                                                                    <img
                                                                        src={`https://img.youtube.com/vi/${getYouTubeId(lessonUrl)}/hqdefault.jpg`}
                                                                        alt="Video Preview"
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${getYouTubeId(lessonUrl)}/0.jpg`;
                                                                        }}
                                                                    />
                                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover/preview:bg-black/20 transition-all">
                                                                        <FileVideo size={48} className="text-white opacity-90 drop-shadow-lg" />
                                                                    </div>
                                                                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-2 py-1 rounded">
                                                                        Vista Previa
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TabsContent>
                                                </Tabs>

                                                {/* Hidden Player for Duration Detection */}
                                                {lessonUrl && (
                                                    <div className="absolute opacity-0 pointer-events-none select-none -z-50" style={{ width: 1, height: 1, overflow: 'hidden' }}>
                                                        <ReactPlayer
                                                            url={lessonUrl}
                                                            onDuration={(d: number) => {
                                                                console.log("Duration detected:", d);
                                                                setLessonDuration(d);
                                                            }}
                                                            playing={false}
                                                            muted={true}
                                                            width="1px"
                                                            height="1px"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Description */}
                                            <div className="space-y-3">
                                                <Label className="text-sm font-medium text-gray-300">Descripción</Label>
                                                <Textarea
                                                    value={lessonDesc}
                                                    onChange={(e) => setLessonDesc(e.target.value)}
                                                    className="bg-[#1a1f2e] border-gray-700 focus:border-[#5D5CDE] min-h-[100px] text-sm text-gray-300 rounded-xl resize-none p-4"
                                                    placeholder="¿De qué trata esta clase?"
                                                />
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="resources" className="p-6 space-y-6 mt-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <h3 className="text-sm font-medium text-white mb-1">Recursos de la Clase</h3>
                                                    <p className="text-xs text-gray-500">Archivos PDF, imágenes o enlaces complementarios.</p>
                                                </div>
                                                <span className="text-[10px] text-gray-500 bg-[#1a1f2e] px-2 py-0.5 rounded border border-gray-800">
                                                    Archivos descargables
                                                </span>
                                            </div>

                                            {/* Existing Resources List */}
                                            <div className="bg-[#0b0e14] rounded-xl border border-gray-800 p-1 space-y-1">
                                                {course?.modules
                                                    .find(m => m.id === activeModuleId)
                                                    ?.lessons.find(l => l.id === activeLessonId)
                                                    ?.resources.length === 0 && (
                                                        <div className="text-center py-8">
                                                            <FolderPlus className="mx-auto h-8 w-8 text-gray-700 mb-2" />
                                                            <p className="text-xs text-gray-500 italic">No hay recursos agregados aún.</p>
                                                        </div>
                                                    )}

                                                {course?.modules
                                                    .find(m => m.id === activeModuleId)
                                                    ?.lessons.find(l => l.id === activeLessonId)
                                                    ?.resources.map(resource => (
                                                        <div key={resource.id} className="group flex items-center justify-between p-3 rounded-lg hover:bg-[#1a1f2e] transition-colors border border-transparent hover:border-gray-800">
                                                            <div className="flex items-center gap-3 overflow-hidden">
                                                                <div className="h-8 w-8 rounded bg-[#5D5CDE]/10 flex items-center justify-center text-[#5D5CDE]">
                                                                    <FileIcon size={14} />
                                                                </div>
                                                                <div className="flex flex-col min-w-0">
                                                                    <span className="text-xs text-gray-200 font-medium truncate">{resource.title}</span>
                                                                    <a href={resource.url} target="_blank" className="text-[10px] text-gray-500 hover:text-[#5D5CDE] truncate transition-colors">Abrir recurso</a>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 text-gray-600 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all rounded-md"
                                                                onClick={() => handleDeleteResource(resource.id)}
                                                            >
                                                                <Trash2 size={12} />
                                                            </Button>
                                                        </div>
                                                    ))
                                                }
                                            </div>

                                            {/* Add New Resource Form */}
                                            <div className="pt-4 border-t border-gray-800">
                                                <Label className="text-xs font-medium text-gray-400 mb-3 block">Nuevo Recurso</Label>
                                                <div className="flex gap-2 p-3 bg-[#1a1f2e]/50 rounded-xl border border-gray-800 items-start">
                                                    <div className="flex-1 space-y-2">
                                                        <Input
                                                            value={resourceTitle}
                                                            onChange={(e) => setResourceTitle(e.target.value)}
                                                            placeholder="Nombre del archivo (Ej: PDF Resumen)"
                                                            className="h-9 bg-[#0b0e14] border-gray-700 text-xs focus:ring-1 focus:ring-[#5D5CDE]"
                                                        />
                                                        <div className="flex gap-2">
                                                            <div className="relative flex-1">
                                                                <Input
                                                                    value={resourceUrl}
                                                                    onChange={(e) => setResourceUrl(e.target.value)}
                                                                    placeholder="URL o subir archivo..."
                                                                    className="h-9 bg-[#0b0e14] border-gray-700 text-xs pl-8 focus:ring-1 focus:ring-[#5D5CDE]"
                                                                />
                                                                <LinkIcon size={12} className="absolute top-2.5 left-2.5 text-gray-600" />
                                                            </div>
                                                            <label className={`cursor-pointer h-9 w-9 flex items-center justify-center rounded-lg bg-[#1F2937] hover:bg-gray-700 border border-gray-600 transition-colors ${isUploading ? 'opacity-50' : ''}`}>
                                                                {isUploading ? <Loader2 size={14} className="animate-spin text-gray-400" /> : <UploadCloud size={14} className="text-gray-300" />}
                                                                <input type="file" className="hidden" onChange={handleResourceUpload} disabled={isUploading} />
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        onClick={handleAddResource}
                                                        disabled={!resourceTitle || !resourceUrl || isAddingResource}
                                                        className="h-[76px] w-12 bg-[#5D5CDE]/10 hover:bg-[#5D5CDE]/20 border border-[#5D5CDE]/20 text-[#5D5CDE] rounded-xl flex items-center justify-center"
                                                    >
                                                        {isAddingResource ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus size={20} />}
                                                    </Button>
                                                </div>
                                            </div>

                                        </TabsContent>

                                        <TabsContent value="quiz" className="p-6 space-y-6 mt-0">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="text-sm font-medium text-white mb-1">Pregunta de Repaso</h3>
                                                    <p className="text-xs text-gray-500">El alumno deberá responder esto para completar la clase.</p>
                                                </div>
                                                {/* Badge or Status */}
                                                {course?.modules
                                                    .find(m => m.id === activeModuleId)
                                                    ?.lessons.find(l => l.id === activeLessonId)
                                                    ?.quiz ? (
                                                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                        <BrainCircuit size={12} /> Quiz Activo
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] text-gray-500 bg-[#1a1f2e] px-2 py-0.5 rounded border border-gray-800">
                                                        Sin pregunta
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-4 bg-[#1a1f2e]/50 p-6 rounded-2xl border border-gray-800">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-medium text-gray-300">Pregunta</Label>
                                                    <Input
                                                        value={quizQuestion}
                                                        onChange={(e) => setQuizQuestion(e.target.value)}
                                                        placeholder="Ej: ¿Qué patrón de velas indica reversión alcista?"
                                                        className="bg-[#0b0e14] border-gray-700 focus:border-[#5D5CDE]"
                                                    />
                                                </div>

                                                <div className="space-y-3">
                                                    <Label className="text-xs font-medium text-gray-300">Opciones de Respuesta</Label>
                                                    <div className="space-y-2">
                                                        {quizOptions.map((opt, idx) => (
                                                            <div key={idx} className="flex items-center gap-3">
                                                                <div
                                                                    onClick={() => setQuizCorrectOption(idx)}
                                                                    className={`w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer transition-colors ${quizCorrectOption === idx ? 'border-[#5D5CDE] bg-[#5D5CDE]' : 'border-gray-600 hover:border-gray-500'}`}
                                                                >
                                                                    {quizCorrectOption === idx && <Check size={12} className="text-white" />}
                                                                </div>
                                                                <Input
                                                                    value={opt}
                                                                    onChange={(e) => {
                                                                        const newOpts = [...quizOptions];
                                                                        newOpts[idx] = e.target.value;
                                                                        setQuizOptions(newOpts);
                                                                    }}
                                                                    placeholder={`Opción ${idx + 1}`}
                                                                    className={`bg-[#0b0e14] border-gray-700 h-9 text-sm focus:border-[#5D5CDE] ${quizCorrectOption === idx ? 'ring-1 ring-[#5D5CDE] border-[#5D5CDE]' : ''}`}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 ml-8">* Marca la casilla de la opción correcta.</p>
                                                </div>

                                                <div className="pt-4 flex justify-between items-center border-t border-gray-700/50">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={!quizQuestion && !quizOptions.some(o => o)}
                                                        onClick={handleDeleteQuiz}
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10 text-xs h-8"
                                                    >
                                                        Eliminar Quiz
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        onClick={handleSaveQuiz}
                                                        disabled={isSubmittingQuiz}
                                                        className="bg-[#5D5CDE] hover:bg-[#4B4AC0] text-xs h-8"
                                                    >
                                                        {isSubmittingQuiz ? <Loader2 size={12} className="animate-spin mr-1" /> : <Save size={12} className="mr-1" />}
                                                        Guardar Quiz
                                                    </Button>
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </div>

                                    {/* Footer Actions */}
                                    <DialogFooter className="px-6 py-4 border-t border-gray-800 bg-[#141824]/50 backdrop-blur-sm gap-3">
                                        {activeLessonId && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                disabled={isSubmittingLesson}
                                                onClick={handleDeleteLesson}
                                                className="text-red-400 hover:text-red-300 hover:bg-red-400/10 mr-auto px-4"
                                            >
                                                <Trash2 size={16} className="mr-2" />
                                                Eliminar Clase
                                            </Button>
                                        )}
                                        <Button type="button" variant="outline" onClick={() => setIsAddLessonOpen(false)} className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSubmittingLesson || isUploading}
                                            className="bg-gradient-to-r from-[#5D5CDE] to-[#4B4AC0] hover:from-[#4B4AC0] hover:to-[#3e3db3] text-white shadow-lg shadow-[#5D5CDE]/25 px-8 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            {isSubmittingLesson ? (
                                                <>
                                                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                                    Guardando...
                                                </>
                                            ) : (
                                                activeLessonId ? "Guardar Cambios" : "Crear Clase"
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </Tabs>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Modules List */}
                    {!course.modules || course.modules.length === 0 ? (
                        <div className="text-center py-20 bg-[#1F2937]/30 rounded-xl border border-dashed border-gray-700">
                            <FolderPlus className="mx-auto h-12 w-12 text-gray-600 mb-3" />
                            <h3 className="text-lg font-medium text-white">Curso vacío</h3>
                            <p className="text-gray-400 mb-6">Comienza creando el primer módulo del curso.</p>
                            <Button onClick={() => setIsAddModuleOpen(true)} className="bg-[#5D5CDE] hover:bg-[#4B4AC0]">
                                Crear Primer Módulo
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {course.modules.map((module, index) => (
                                <Card key={module.id} className="bg-[#1F2937] border-gray-700 overflow-hidden">
                                    <CardHeader className="bg-[#2D3748]/50 py-3 px-4 flex flex-row items-center justify-between space-y-0">
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-6 w-6 items-center justify-center rounded bg-[#5D5CDE]/20 text-xs font-bold text-[#5D5CDE]">
                                                {index + 1}
                                            </span>
                                            <CardTitle className="text-base text-white">{module.title}</CardTitle>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-gray-400 hover:text-white h-8"
                                                onClick={() => openAddLesson(module.id)}
                                            >
                                                <Plus size={14} className="mr-1" /> Clase
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-[#1F2937] border-gray-700 text-white">
                                                    <DropdownMenuItem
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10 cursor-pointer"
                                                        onClick={() => handleDeleteModule(module.id)}
                                                    >
                                                        <Trash2 size={14} className="mr-2" />
                                                        Eliminar Módulo
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {module.lessons && module.lessons.length > 0 ? (
                                            <div className="divide-y divide-gray-700">
                                                {module.lessons.map((lesson) => (
                                                    <div
                                                        key={lesson.id}
                                                        onClick={() => openEditLesson(lesson, module.id)}
                                                        className="flex items-center gap-3 p-3 pl-12 hover:bg-[#2D3748]/30 transition-colors cursor-pointer group"
                                                    >
                                                        <Video size={16} className="text-gray-500 group-hover:text-[#5D5CDE]" />
                                                        <span className="text-sm text-gray-300 flex-1 group-hover:text-white">{lesson.title}</span>
                                                        {lesson.videoUrl && (
                                                            <code className="text-xs bg-gray-900 px-1 py-0.5 rounded text-gray-400 border border-gray-700">MP4, WebM • Max 2GB</code>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-4 text-center text-xs text-gray-500 italic">
                                                Sin clases en este módulo
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div >
        </div >
    );
}
