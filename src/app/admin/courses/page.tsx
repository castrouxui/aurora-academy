"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Loader2, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getYouTubeId } from "@/lib/utils";

interface Course {
    id: string;
    title: string;
    description: string;
    price: string;
    imageUrl: string;
    published: boolean;
}

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [category, setCategory] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    const fetchCourses = async () => {
        try {
            const res = await fetch("/api/courses");
            const data = await res.json();

            // Process courses to extract videoUrl
            const processedCourses = data.map((course: any) => {
                const sortedModules = course.modules?.sort((a: any, b: any) => a.position - b.position) || [];
                const firstLessonWithVideo = sortedModules
                    .flatMap((m: any) => m.lessons?.sort((a: any, b: any) => a.position - b.position) || [])
                    .find((l: any) => l.videoUrl);

                return {
                    ...course,
                    videoUrl: firstLessonWithVideo?.videoUrl || null
                };
            });

            setCourses(processedCourses);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, price, imageUrl, category }),
            });

            if (res.ok) {
                const newCourse = await res.json();
                setIsCreateOpen(false);
                setTitle("");
                setDescription("");
                setPrice("");
                setImageUrl("");
                setCategory("");
                router.push(`/admin/courses/${newCourse.id}`);
            } else {
                const errorText = await res.text();
                alert(`Error al crear curso: ${res.status} ${errorText}`);
                console.error("Failed to create course:", res.status, errorText);
            }
        } catch (error) {
            console.error("Error creating course:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (courseId: string) => {
        try {
            const res = await fetch(`/api/courses/${courseId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setCourses((prev) => prev.filter((c) => c.id !== courseId));
            } else {
                alert("Error al eliminar el curso");
            }
        } catch (error) {
            console.error("Error deleting course:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-white">Gestionar Cursos</h1>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white gap-2">
                            <Plus size={16} />
                            Nuevo Curso
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1F2937] border-gray-700 text-white">
                        <DialogHeader>
                            <DialogTitle>Crear Nuevo Curso</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="bg-[#121620] border-gray-600 focus-visible:ring-[#5D5CDE]"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="desc">Descripción</Label>
                                <Textarea
                                    id="desc"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="bg-[#121620] border-gray-600 focus-visible:ring-[#5D5CDE]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Precio (ARS)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="bg-[#121620] border-gray-600 focus-visible:ring-[#5D5CDE]"
                                    placeholder="0"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image">URL de Imagen (Opcional)</Label>
                                <Input
                                    id="image"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="bg-[#121620] border-gray-600 focus-visible:ring-[#5D5CDE]"
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Categoría</Label>
                                <Input
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="bg-[#121620] border-gray-600 focus-visible:ring-[#5D5CDE]"
                                    placeholder="Ej: Trading, Forex, Crypto"
                                />
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting} className="bg-[#5D5CDE] hover:bg-[#4B4AC0] w-full mt-4">
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Guardar Curso"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-[#1F2937] border border-gray-700 rounded-lg overflow-hidden h-[300px]">
                            <Skeleton className="h-40 w-full bg-gray-800" />
                            <div className="p-6 space-y-4">
                                <Skeleton className="h-6 w-3/4 bg-gray-800" />
                                <Skeleton className="h-4 w-full bg-gray-800" />
                                <Skeleton className="h-4 w-1/2 bg-gray-800" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : courses.length === 0 ? (
                <div className="text-center py-20 bg-[#1F2937]/50 rounded-xl border border-dashed border-gray-700">
                    <p className="text-gray-400">No hay cursos creados aún.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course: any) => {
                        const youtubeId = course.videoUrl ? getYouTubeId(course.videoUrl) : null;
                        const displayImage = youtubeId
                            ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                            : course.imageUrl;

                        return (
                            <Card key={course.id} className="group relative bg-[#1F2937] border-gray-700 flex flex-col overflow-hidden hover:border-[#5D5CDE]/50 transition-colors">
                                <div className="absolute top-3 right-3 z-10">
                                    <Badge variant={course.published ? "success" : "warning"}>
                                        {course.published ? "Publicado" : "Borrador"}
                                    </Badge>
                                </div>
                                {displayImage && (
                                    <div className="h-40 w-full overflow-hidden">
                                        <img src={displayImage} alt={course.title} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="text-white text-lg line-clamp-2">{course.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description || "Sin descripción"}</p>
                                    <p className="text-[#5D5CDE] font-bold">${course.price}</p>
                                </CardContent>
                                <CardFooter className="pt-0">
                                    <div className="flex gap-2 w-full mt-auto">
                                        <Link href={`/admin/courses/${course.id}`} className="flex-1">
                                            <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 gap-2">
                                                <Pencil size={14} />
                                                Editar
                                            </Button>
                                        </Link>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="icon" className="shrink-0 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20">
                                                    <Trash size={14} />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-[#1F2937] border-gray-700 text-white">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>¿Eliminar curso?</AlertDialogTitle>
                                                    <AlertDialogDescription className="text-gray-400">
                                                        Esta acción es irreversible. Se borrará el curso y todas sus lecciones.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="bg-transparent border-gray-600 text-white hover:bg-gray-700">Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(course.id)} className="bg-red-600 hover:bg-red-700 text-white border-0">
                                                        Eliminar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
