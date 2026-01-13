"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Trash, UploadCloud, ImageIcon, Eye, EyeOff, Loader2, Package, Search } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useUploadThing } from "@/lib/uploadthing";

export default function BundleEditorPage() {
    const params = useParams();
    const router = useRouter();
    const bundleId = params?.bundleId as string;

    const [bundle, setBundle] = useState<any>(null);
    const [allCourses, setAllCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [selectedCourseIds, setSelectedCourseIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Bundle
                const bundleRes = await fetch(`/api/bundles/${bundleId}`);
                if (!bundleRes.ok) throw new Error("Bundle not found");
                const bundleData = await bundleRes.json();

                // Fetch All Courses
                const coursesRes = await fetch("/api/courses");
                const coursesData = await coursesRes.json();

                setBundle(bundleData);
                setAllCourses(coursesData);

                // Set Initial State
                setTitle(bundleData.title);
                setDescription(bundleData.description || "");
                setPrice(bundleData.price.toString());
                setImageUrl(bundleData.imageUrl || "");

                // Set Selected Courses
                const currentIds = new Set(bundleData.courses.map((c: any) => c.id));
                setSelectedCourseIds(currentIds as Set<string>);

            } catch (error) {
                console.error(error);
                toast.error("Error cargando datos");
            } finally {
                setIsLoading(false);
            }
        };

        if (bundleId) fetchData();
    }, [bundleId]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/bundles/${bundleId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    price,
                    imageUrl,
                    courseIds: Array.from(selectedCourseIds)
                }),
            });

            if (res.ok) {
                toast.success("Paquete actualizado correctamente");
                router.refresh();
            } else {
                toast.error("Error al guardar cambios");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar cambios");
        } finally {
            setIsSaving(false);
        }
    };

    const togglePublish = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/bundles/${bundleId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ published: !bundle.published }),
            });
            if (res.ok) {
                setBundle({ ...bundle, published: !bundle.published });
                toast.success(bundle.published ? "Paquete ocultado" : "Paquete publicado");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de eliminar este paquete?")) return;
        try {
            const res = await fetch(`/api/bundles/${bundleId}`, { method: "DELETE" });
            if (res.ok) router.push("/admin/bundles");
        } catch (error) {
            console.error(error);
        }
    };

    const { startUpload } = useUploadThing("courseImage", {
        onClientUploadComplete: (res) => {
            if (res && res[0]) {
                setImageUrl(res[0].url);
                setIsUploading(false);
                toast.success("Imagen subida");
            }
        },
        onUploadError: (error) => {
            console.error(error);
            setIsUploading(false);
            toast.error("Error al subir imagen");
        }
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        await startUpload([file]);
    };

    const toggleCourse = (courseId: string) => {
        const newSelected = new Set(selectedCourseIds);
        if (newSelected.has(courseId)) {
            newSelected.delete(courseId);
        } else {
            newSelected.add(courseId);
        }
        setSelectedCourseIds(newSelected);
    };

    const filteredCourses = allCourses.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#5D5CDE]" />
            </div>
        );
    }

    if (!bundle) return <div>Paquete no encontrado</div>;

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/bundles">
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5 rounded-xl">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <Badge variant="outline" className={`${bundle.published ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                                    {bundle.published ? 'Publicado' : 'Borrador'}
                                </Badge>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Package size={12} /> Paquete
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">{title || "Sin Título"}</h1>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={togglePublish}
                            disabled={isSaving}
                            variant="outline"
                            className="border-gray-700 text-gray-300 hover:text-white hover:bg-white/5 gap-2"
                        >
                            {bundle.published ? <EyeOff size={16} /> : <Eye size={16} />}
                            {bundle.published ? "Ocultar" : "Publicar"}
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-[#5D5CDE] text-white hover:bg-[#4B4AC0] shadow-lg shadow-[#5D5CDE]/20 gap-2"
                        >
                            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                            Guardar Cambios
                        </Button>
                        <Button
                            onClick={handleDelete}
                            variant="destructive"
                            size="icon"
                            className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
                        >
                            <Trash size={16} />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Details */}
                <div className="space-y-6">
                    <div className="space-y-4 bg-[#1F2937]/30 border border-gray-800 p-6 rounded-2xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Detalles del Paquete</h3>

                        <div className="space-y-2">
                            <Label>Título</Label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-[#121620] border-gray-600"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Descripción</Label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="bg-[#121620] border-gray-600 min-h-[100px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Precio (ARS)</Label>
                            <Input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="bg-[#121620] border-gray-600"
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="bg-[#1F2937]/30 border border-gray-800 p-6 rounded-2xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Imagen de Portada</h3>
                        <div className="aspect-video relative rounded-xl overflow-hidden bg-[#0f1118] border border-gray-700 group mb-4">
                            {imageUrl ? (
                                <img src={imageUrl} alt="Bundle cover" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                                    <ImageIcon size={40} className="opacity-50" />
                                    <span className="text-xs font-medium">Sin imagen</span>
                                </div>
                            )}
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                                    <Loader2 className="animate-spin text-white h-8 w-8" />
                                </div>
                            )}
                        </div>
                        <label className="cursor-pointer bg-[#5D5CDE] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4B4AC0] transition-colors flex items-center justify-center gap-2 w-full">
                            <UploadCloud size={16} /> Subir Imagen
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                        </label>
                    </div>
                </div>

                {/* Right Column: Course Selection */}
                <div className="bg-[#1F2937]/30 border border-gray-800 p-6 rounded-2xl flex flex-col h-[600px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Cursos Incluidos</h3>
                        <Badge variant="secondary" className="bg-[#5D5CDE]/20 text-[#5D5CDE]">
                            {selectedCourseIds.size} seleccionados
                        </Badge>
                    </div>

                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <Input
                            placeholder="Buscar cursos..."
                            className="bg-[#121620] border-gray-600 pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                        {filteredCourses.map((course) => {
                            const isSelected = selectedCourseIds.has(course.id);
                            return (
                                <div
                                    key={course.id}
                                    onClick={() => toggleCourse(course.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isSelected
                                            ? "bg-[#5D5CDE]/10 border-[#5D5CDE] shadow-[0_0_10px_rgba(93,92,222,0.1)]"
                                            : "bg-[#121620]/50 border-gray-700 hover:border-gray-500"
                                        }`}
                                >
                                    <Checkbox
                                        checked={isSelected}
                                        readOnly
                                        className={isSelected ? "border-[#5D5CDE] text-[#5D5CDE]" : "border-gray-500"}
                                    />
                                    <div className="flex-1">
                                        <p className={`text-sm font-medium ${isSelected ? "text-white" : "text-gray-300"}`}>
                                            {course.title}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(course.price)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        {filteredCourses.length === 0 && (
                            <p className="text-center text-gray-500 py-8 text-sm">No se encontraron cursos.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
