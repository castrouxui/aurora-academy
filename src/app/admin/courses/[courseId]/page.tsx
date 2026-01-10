"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Video, Trash2, Edit, Save, PlusCircle, LayoutList, ChevronUp, ChevronDown, Check, X, GripVertical, MoreVertical, FileVideo, UploadCloud, FolderPlus, EyeOff, Loader2, LinkIcon, File, ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

interface Lesson {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    published: boolean;
    position: number;
    resources: { id: string; title: string; url: string; type: string }[];
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
    const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
    const [lessonTitle, setLessonTitle] = useState("");
    const [lessonUrl, setLessonUrl] = useState("");
    const [lessonDesc, setLessonDesc] = useState("");
    const [isSubmittingLesson, setIsSubmittingLesson] = useState(false);

    // Resource State
    const [resourceTitle, setResourceTitle] = useState("");
    const [resourceUrl, setResourceUrl] = useState("");
    const [isAddingResource, setIsAddingResource] = useState(false);

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
                        moduleId: activeModuleId
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

    const handleResourceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
                setResourceUrl(data.url);
                if (!resourceTitle) {
                    setResourceTitle(file.name);
                }
            }
        } catch (error) {
            console.error("Resource upload failed", error);
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
        setActiveLessonId(null);
        setLessonTitle("");
        setLessonUrl("");
        setLessonDesc("");
        setIsAddLessonOpen(true);
    };

    const openEditLesson = (lesson: Lesson, moduleId: string) => {
        setActiveModuleId(moduleId);
        setActiveLessonId(lesson.id);
        setLessonTitle(lesson.title);
        setLessonUrl(lesson.videoUrl || "");
        setLessonDesc(lesson.description || "");
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
                        <DialogContent className="bg-[#0f111a] border border-gray-800 text-white sm:max-w-[600px] shadow-2xl p-0 overflow-hidden rounded-2xl">
                            {/* Premium Header */}
                            <DialogHeader className="px-6 py-5 border-b border-gray-800 bg-[#141824]/50 backdrop-blur-sm">
                                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                    {activeLessonId ? "Editar Contenido" : "Nueva Clase"}
                                </DialogTitle>
                                <p className="text-xs text-gray-500 mt-1">
                                    {activeLessonId ? "Administra el contenido y los recursos de esta lección." : "Agrega una nueva lección al módulo."}
                                </p>
                            </DialogHeader>

                            <form onSubmit={handleAddLesson} className="flex flex-col max-h-[85vh]">
                                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

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

                                        <div className={`relative group border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 ease-out 
                                            ${lessonUrl ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-gray-700 bg-[#1a1f2e]/30 hover:bg-[#1a1f2e] hover:border-[#5D5CDE]/50'}`}>

                                            {isUploading ? (
                                                <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                                                    <div className="relative">
                                                        <div className="h-12 w-12 rounded-full border-4 border-gray-700"></div>
                                                        <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-[#5D5CDE] border-t-transparent animate-spin"></div>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-sm font-medium text-white">Subiendo tu video...</p>
                                                        <p className="text-xs text-gray-500 mt-1">Esto puede tardar unos segundos</p>
                                                    </div>
                                                </div>
                                            ) : lessonUrl ? (
                                                <div className="w-full flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                    <div className="h-16 w-16 rounded-2xl bg-[#0f1118] flex items-center justify-center border border-gray-700 shadow-lg">
                                                        <FileVideo size={32} className="text-emerald-400" />
                                                    </div>
                                                    <div className="text-center w-full px-4">
                                                        <p className="text-sm text-gray-300 font-medium truncate max-w-full block">{lessonUrl}</p>
                                                        <p className="text-xs text-gray-500 mt-1 mb-4">Listo para reproducir</p>
                                                        <label htmlFor="file-upload" className="inline-flex items-center gap-2 text-xs font-medium text-[#5D5CDE] bg-[#5D5CDE]/10 px-3 py-1.5 rounded-lg hover:bg-[#5D5CDE]/20 cursor-pointer transition-colors">
                                                            <UploadCloud size={12} />
                                                            Reemplazar video
                                                        </label>
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
                                                        MP4, WebM • Max 500MB
                                                    </span>
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

                                        {/* URL fallback */}
                                        <div className="relative mt-2">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <LinkIcon size={14} className="text-gray-500" />
                                            </div>
                                            <Input
                                                value={lessonUrl}
                                                onChange={(e) => setLessonUrl(e.target.value)}
                                                className="bg-[#1a1f2e] border-gray-800 text-xs pl-9 h-9 placeholder:text-gray-600 focus:border-[#5D5CDE] transition-colors rounded-lg"
                                                placeholder="O pega una URL directa (YouTube/Vimeo)"
                                            />
                                        </div>
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

                                    {/* Resources Section - Collapsible or distinct */}
                                    {activeLessonId && (
                                        <div className="pt-6 border-t border-gray-800">
                                            <div className="flex items-center justify-between mb-4">
                                                <Label className="text-sm font-medium text-white flex items-center gap-2">
                                                    <FolderPlus size={16} className="text-[#5D5CDE]" />
                                                    Recursos Adicionales
                                                </Label>
                                                <span className="text-[10px] text-gray-500 bg-[#1a1f2e] px-2 py-0.5 rounded border border-gray-800">
                                                    Archivos descargables
                                                </span>
                                            </div>

                                            <div className="bg-[#0b0e14] rounded-xl border border-gray-800 p-1 space-y-1 mb-4">
                                                {course?.modules
                                                    .find(m => m.id === activeModuleId)
                                                    ?.lessons.find(l => l.id === activeLessonId)
                                                    ?.resources.length === 0 && (
                                                        <div className="text-center py-6">
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
                                                                    <File size={14} />
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
                                    )}

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
                                                    <div
                                                        key={lesson.id}
                                                        onClick={() => openEditLesson(lesson, module.id)}
                                                        className="flex items-center gap-3 p-3 pl-12 hover:bg-[#2D3748]/30 transition-colors cursor-pointer group"
                                                    >
                                                        <Video size={16} className="text-gray-500 group-hover:text-[#5D5CDE]" />
                                                        <span className="text-sm text-gray-300 flex-1 group-hover:text-white">{lesson.title}</span>
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
        </div >
    );
}
