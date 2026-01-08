import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function AdminCoursesPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Cursos</h1>
                <Button className="bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white gap-2">
                    <Plus size={16} />
                    Nuevo Curso
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Placeholder for Course Cards */}
                <Card className="bg-[#1F2937] border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white">Curso Inicial</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-400 text-sm mb-4">Nivel Básico • $10</p>
                        <Button variant="outline" className="w-full border-gray-600 text-gray-300">
                            Editar Contenido
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
