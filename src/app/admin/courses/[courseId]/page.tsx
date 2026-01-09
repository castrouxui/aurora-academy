"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Plus, Video, Eye, EyeOff, FolderPlus, UploadCloud, FileVideo } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

interface Lesson {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    published: boolean;
    position: number;
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
    price: string;
    published: boolean;
    modules: Module[];
}

export default function CourseEditorPage() {
    const params = useParams();
    const courseId = params?.courseId as string;
    const router = useRouter();

    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Add Module State
    const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
    const [moduleTitle, setModuleTitle] = useState("");
    const [isSubmittingModule, setIsSubmittingModule] = useState(false);

    // Add Lesson State
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
    const [lessonTitle, setLessonTitle] = useState("");
    const [lessonUrl, setLessonUrl] = useState("");
    const [lessonDesc, setLessonDesc] = useState("");
    const [isSubmittingLesson, setIsSubmittingLesson] = useState(false);

    // Upload State
    const [isUploading, setIsUploading] = useState(false);

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
        if (!activeModuleId) return;

        setIsSubmittingLesson(true);
        try {
            const res = await fetch(`/api/courses/${courseId}/lessons`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: lessonTitle,
                    videoUrl: lessonUrl,
                    description: lessonDesc,
                    moduleId: activeModuleId
                }),
            });

            if (res.ok) {
                setIsAddLessonOpen(false);
                setLessonTitle("");
                setLessonUrl("");
                setLessonDesc("");
                fetchCourse();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmittingLesson(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setLessonUrl(data.url);
            }
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
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

    const openAddLesson = (moduleId: string) => {
        setActiveModuleId(moduleId);
        setIsAddLessonOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#5D5CDE]" />
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/admin/courses">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                        <ArrowLeft size={20} />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white max-w-2xl truncate">{course.title}</h1>
                    <p className="text-sm text-gray-400">
                        {course.modules?.length || 0} Módulos • {course.published ? "Publicado" : "Borrador"}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={togglePublish}
                        variant={course.published ? "secondary" : "default"}
                        className={course.published ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" : "bg-[#5D5CDE] text-white hover:bg-[#4B4AC0]"}
                    >
                        {course.published ? (
                            <><Eye size={16} className="mr-2" /> Publicado</>
                        ) : (
                            <><EyeOff size={16} className="mr-2" /> Publicar</>
                        )}
                    </Button>
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
                        <DialogContent className="bg-[#1F2937] border-gray-700 text-white">
                            <DialogHeader>
                                <DialogTitle>Agregar Clase</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAddLesson} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Título de la Clase</Label>
                                    <Input
                                        value={lessonTitle}
                                        onChange={(e) => setLessonTitle(e.target.value)}
                                        className="bg-[#121620] border-gray-600"
                                        placeholder="Ej: Análisis Fundamental"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Video</Label>
                                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center bg-[#121620]/50 hover:bg-[#121620] transition-colors cursor-pointer relative">
                                        {isUploading ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <Loader2 className="h-8 w-8 animate-spin text-[#5D5CDE]" />
                                                <span className="text-xs text-gray-400">Subiendo video...</span>
                                            </div>
                                        ) : lessonUrl ? (
                                            <div className="flex flex-col items-center gap-2 w-full">
                                                <div className="w-full bg-black/50 p-2 rounded flex items-center gap-2 overflow-hidden">
                                                    <FileVideo size={16} className="text-[#5D5CDE] flex-shrink-0" />
                                                    <span className="text-xs text-gray-300 truncate">{lessonUrl}</span>
                                                </div>
                                                <label htmlFor="file-upload" className="text-xs text-[#5D5CDE] hover:underline cursor-pointer mt-2">
                                                    Cambiar archivo
                                                </label>
                                            </div>
                                        ) : (
                                            <>
                                                <UploadCloud className="h-10 w-10 text-gray-500 mb-2" />
                                                <p className="text-sm text-gray-400 text-center">
                                                    <span className="text-[#5D5CDE] font-bold">Haz clic para subir</span> o arrastra el video aquí
                                                </p>
                                                <p className="text-xs text-gray-600 mt-1">MP4, WebM (Max 100MB prueba)</p>
                                            </>
                                        )}
                                        <input
                                            id="file-upload"
                                            type="file"
                                            accept="video/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleFileUpload}
                                            disabled={isUploading}
                                        />
                                    </div>
                                    <div className="mt-2 text-center">
                                        <span className="text-xs text-gray-500">O ingresa una URL externa (YouTube/Vimeo)</span>
                                    </div>
                                    <Input
                                        value={lessonUrl}
                                        onChange={(e) => setLessonUrl(e.target.value)}
                                        className="bg-[#121620] border-gray-600 text-xs"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Descripción (Opcional)</Label>
                                    <Textarea
                                        value={lessonDesc}
                                        onChange={(e) => setLessonDesc(e.target.value)}
                                        className="bg-[#121620] border-gray-600"
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={isSubmittingLesson || isUploading} className="bg-[#5D5CDE] text-white w-full">
                                        {isSubmittingLesson ? <Loader2 className="animate-spin" /> : "Guardar Clase"}
                                    </Button>
                                </DialogFooter>
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
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-400 hover:text-white h-8"
                                            onClick={() => openAddLesson(module.id)}
                                        >
                                            <Plus size={14} className="mr-1" /> Clase
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {module.lessons && module.lessons.length > 0 ? (
                                            <div className="divide-y divide-gray-700">
                                                {module.lessons.map((lesson) => (
                                                    <div key={lesson.id} className="flex items-center gap-3 p-3 pl-12 hover:bg-[#2D3748]/30 transition-colors">
                                                        <Video size={16} className="text-gray-500" />
                                                        <span className="text-sm text-gray-300 flex-1">{lesson.title}</span>
                                                        {lesson.videoUrl && (
                                                            <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700 truncate max-w-[150px]">
                                                                {lesson.videoUrl.startsWith('/uploads') ? 'Archivo Local' : 'Enlace Externo'}
                                                            </span>
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
            </div>
        </div>
    );
}
