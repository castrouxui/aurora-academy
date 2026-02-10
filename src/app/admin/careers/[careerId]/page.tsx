"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAdminCareerById, getAllCourses, updateCareerMilestones } from "@/actions/admin-career";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Save, GripVertical, Trash2, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- Components ---

function SortableItem({ id, milestone, onRemove }: { id: string, milestone: any, onRemove: (id: string) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className={cn("bg-[#1F2937] border border-gray-700 rounded-lg p-4 flex items-center gap-4 mb-2 group hover:border-[#5D5CDE]/50 transition-colors", isDragging && "border-[#5D5CDE] shadow-lg shadow-[#5D5CDE]/20")}>
            <div {...attributes} {...listeners} className="cursor-grab hover:text-[#5D5CDE] text-gray-500">
                <GripVertical size={20} />
            </div>

            <div className="flex-1">
                {milestone.type === 'COURSE' ? (
                    <div className="flex items-center gap-3">
                        {milestone.course?.imageUrl && (
                            <img src={milestone.course.imageUrl} alt="" className="w-10 h-10 rounded object-cover" />
                        )}
                        <div>
                            <p className="font-medium text-white text-sm">{milestone.course?.title || "Curso no encontrado"}</p>
                            <p className="text-xs text-gray-400">Curso • ${milestone.course?.price}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-[#5D5CDE]/20 flex items-center justify-center text-[#5D5CDE]">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <p className="font-medium text-white text-sm">Suscripción Aurora</p>
                            <p className="text-xs text-gray-400">Membresía • Acceso Total</p>
                        </div>
                    </div>
                )}
            </div>

            <Button variant="ghost" size="icon" onClick={() => onRemove(id)} className="text-gray-500 hover:text-red-500 hover:bg-red-500/10">
                <Trash2 size={16} />
            </Button>
        </div>
    );
}

export default function CareerEditorPage() {
    const params = useParams();
    const router = useRouter();
    const careerId = params.careerId as string;

    const [milestones, setMilestones] = useState<any[]>([]);
    const [availableCourses, setAvailableCourses] = useState<any[]>([]);
    const [career, setCareer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        const loadData = async () => {
            try {
                const [careerData, coursesData] = await Promise.all([
                    getAdminCareerById(careerId),
                    getAllCourses()
                ]);

                if (!careerData) {
                    toast.error("Carrera no encontrada");
                    router.push("/admin/careers");
                    return;
                }

                setCareer(careerData);
                // Assign unique IDs to milestones for dnd-kit
                setMilestones(careerData.milestones.map((m: any) => ({
                    uid: `ms-${m.position}-${Date.now()}-${Math.random()}`, // client-side unique ID
                    ...m
                })));
                setAvailableCourses(coursesData);
            } catch (error) {
                console.error(error);
                toast.error("Error al cargar datos");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [careerId, router]);

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setMilestones((items) => {
                const oldIndex = items.findIndex((i) => i.uid === active.id);
                const newIndex = items.findIndex((i) => i.uid === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const addCourse = (course: any) => {
        const newMilestone = {
            uid: `new-${Date.now()}`,
            type: 'COURSE',
            courseId: course.id,
            course: course
        };
        setMilestones([...milestones, newMilestone]);
    };

    const addSubscription = () => {
        const newMilestone = {
            uid: `new-sub-${Date.now()}`,
            type: 'SUBSCRIPTION',
            courseId: null
        };
        setMilestones([...milestones, newMilestone]);
    };

    const removeMilestone = (uid: string) => {
        setMilestones(milestones.filter(m => m.uid !== uid));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Re-map to server expected format
            const payload = milestones.map((m, index) => ({
                type: m.type,
                courseId: m.courseId,
                position: index
            }));

            await updateCareerMilestones(careerId, payload);
            toast.success("Hoja de ruta actualizada correctamente");
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar cambios");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-white" /></div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-100px)]">
            {/* Left Column: Available Items */}
            <div className="lg:col-span-1 space-y-4 flex flex-col h-full">
                <h2 className="text-xl font-bold text-white">Elementos Disponibles</h2>
                <Card className="bg-[#1F2937] border-gray-700 flex-1 flex flex-col overflow-hidden">
                    <CardContent className="p-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                        {/* Special Item: Subscription */}
                        <div
                            onClick={addSubscription}
                            className="bg-[#0B0F19] border border-gray-600 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:border-[#5D5CDE] transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-[#5D5CDE]/20 flex items-center justify-center text-[#5D5CDE]">
                                    <Sparkles size={16} />
                                </div>
                                <span className="text-white font-medium text-sm">Suscripción Aurora</span>
                            </div>
                            <Plus size={16} className="text-gray-400 group-hover:text-[#5D5CDE]" />
                        </div>

                        <div className="h-px bg-gray-700 my-2"></div>

                        {/* Available Courses */}
                        {availableCourses.map(course => (
                            <div
                                key={course.id}
                                onClick={() => addCourse(course)}
                                className="bg-[#0B0F19] border border-gray-600 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:border-[#5D5CDE] transition-colors group"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {course.imageUrl && (
                                        <img src={course.imageUrl} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
                                    )}
                                    <div className="truncate">
                                        <p className="text-white font-medium text-sm truncate">{course.title}</p>
                                        <p className="text-xs text-gray-500">${course.price}</p>
                                    </div>
                                </div>
                                <Plus size={16} className="text-gray-400 group-hover:text-[#5D5CDE]" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Roadmap Editor */}
            <div className="lg:col-span-2 space-y-4 flex flex-col h-full">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">{career.name}</h1>
                        <p className="text-gray-400 text-sm">Arrastra los elementos para reordenarlos. Guarda para aplicar cambios.</p>
                    </div>
                    <Button onClick={handleSave} disabled={saving} className="bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white gap-2">
                        {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        Guardar Cambios
                    </Button>
                </div>

                <Card className="bg-[#0B0F19] border-gray-700 flex-1 flex flex-col overflow-hidden">
                    <CardContent className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={milestones.map(m => m.uid)}
                                strategy={verticalListSortingStrategy}
                            >
                                {milestones.length === 0 ? (
                                    <div className="text-center py-20 border-2 border-dashed border-gray-700 rounded-xl">
                                        <p className="text-gray-500">La hoja de ruta está vacía.</p>
                                        <p className="text-sm text-gray-600 mt-2">Agrega cursos desde el panel izquierdo.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {milestones.map((milestone, index) => (
                                            <div key={milestone.uid} className="relative">
                                                <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-gray-600 font-bold text-sm w-6 text-right">
                                                    {index + 1}
                                                </div>
                                                <SortableItem
                                                    id={milestone.uid}
                                                    milestone={milestone}
                                                    onRemove={removeMilestone}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </SortableContext>
                        </DndContext>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
