"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Loader2, Trash, Package, Layers } from "lucide-react";
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

export default function AdminBundlesPage() {
    const [bundles, setBundles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    const fetchBundles = async () => {
        try {
            const res = await fetch("/api/bundles");
            const data = await res.json();
            setBundles(data);
        } catch (error) {
            console.error("Error fetching bundles:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBundles();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/bundles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, price }),
            });

            if (res.ok) {
                const newBundle = await res.json();
                setIsCreateOpen(false);
                setTitle("");
                setDescription("");
                setPrice("");
                router.push(`/admin/bundles/${newBundle.id}`);
            } else {
                alert("Error creando paquete");
            }
        } catch (error) {
            console.error("Error creating bundle:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (bundleId: string) => {
        try {
            const res = await fetch(`/api/bundles/${bundleId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setBundles((prev) => prev.filter((b) => b.id !== bundleId));
            } else {
                alert("Error al eliminar el paquete");
            }
        } catch (error) {
            console.error("Error deleting bundle:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <Package size={28} className="text-[#5D5CDE]" />
                    <h1 className="text-3xl font-bold text-white">Gestionar Membresías</h1>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white gap-2">
                            <Plus size={16} />
                            Nueva Membresía
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1F2937] border-gray-700 text-white">
                        <DialogHeader>
                            <DialogTitle>Crear Nueva Membresía</DialogTitle>
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

                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting} className="bg-[#5D5CDE] hover:bg-[#4B4AC0] w-full mt-4">
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Crear y Configurar"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-[#1F2937] border border-gray-700 rounded-lg overflow-hidden h-[250px] animate-pulse">
                            <Skeleton className="h-full w-full bg-gray-800" />
                        </div>
                    ))}
                </div>
            ) : bundles.length === 0 ? (
                <div className="text-center py-20 bg-[#1F2937]/50 rounded-xl border border-dashed border-gray-700">
                    <p className="text-gray-400">No hay membresías creadas aún.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {bundles.map((bundle: any) => (
                        <Card key={bundle.id} className="group relative bg-[#1F2937] border-gray-700 flex flex-col overflow-hidden hover:border-[#5D5CDE]/50 transition-colors">
                            <div className="absolute top-3 right-3 z-10">
                                <Badge variant={bundle.published ? "success" : "warning"} className={bundle.published ? "bg-emerald-500/10 text-emerald-500" : "bg-yellow-500/10 text-yellow-500"}>
                                    {bundle.published ? "Publicado" : "Borrador"}
                                </Badge>
                            </div>

                            <div className="h-32 bg-gray-800 flex items-center justify-center relative">
                                {bundle.imageUrl ? (
                                    <img src={bundle.imageUrl} alt={bundle.title} className="w-full h-full object-cover" />
                                ) : (
                                    <Package size={48} className="text-gray-600" />
                                )}
                            </div>

                            <CardHeader>
                                <CardTitle className="text-white text-lg line-clamp-2">{bundle.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{bundle.description || "Sin descripción"}</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-[#5D5CDE] font-bold text-lg">
                                        {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(bundle.price)}
                                    </p>
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Layers size={12} /> {bundle.courses?.length || 0} Cursos
                                    </span>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0">
                                <div className="flex gap-2 w-full mt-auto">
                                    <Link href={`/admin/bundles/${bundle.id}`} className="flex-1">
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
                                                <AlertDialogTitle>¿Eliminar membresía?</AlertDialogTitle>
                                                <AlertDialogDescription className="text-gray-400">
                                                    Esta acción es irreversible. Se borrará la membresía pero NO los cursos que contiene.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="bg-transparent border-gray-600 text-white hover:bg-gray-700">Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(bundle.id)} className="bg-red-600 hover:bg-red-700 text-white border-0">
                                                    Eliminar
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
