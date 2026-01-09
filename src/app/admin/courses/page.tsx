"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    const fetchCourses = async () => {
        try {
            const res = await fetch("/api/courses");
            const data = await res.json();
            setCourses(data);
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
                body: JSON.stringify({ title, description, price, imageUrl }),
            });

            if (res.ok) {
                const newCourse = await res.json();
                setIsCreateOpen(false);
                setTitle("");
                setDescription("");
                setPrice("");
                setImageUrl("");
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
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
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-[#5D5CDE]" />
                </div>
            ) : courses.length === 0 ? (
                <div className="text-center py-20 bg-[#1F2937]/50 rounded-xl border border-dashed border-gray-700">
                    <p className="text-gray-400">No hay cursos creados aún.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <Card key={course.id} className="bg-[#1F2937] border-gray-700 flex flex-col overflow-hidden hover:border-[#5D5CDE]/50 transition-colors">
                            {course.imageUrl && (
                                <div className="h-40 w-full overflow-hidden">
                                    <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
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
                                <Link href={`/admin/courses/${course.id}`} className="w-full">
                                    <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 gap-2">
                                        <Pencil size={14} />
                                        Editar / Agregar Clases
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
