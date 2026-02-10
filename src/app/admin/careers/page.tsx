"use client";

import { useEffect, useState } from "react";
import { getAdminCareers } from "@/actions/admin-career";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2, Map } from "lucide-react";

export default function AdminCareersPage() {
    const [careers, setCareers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAdminCareers()
            .then(setCareers)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Gestión de Hoja de Ruta</h1>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="animate-spin text-white" size={32} />
                </div>
            ) : careers.length === 0 ? (
                <div className="text-center py-20 bg-[#1F2937]/50 rounded-xl border border-dashed border-gray-700">
                    <p className="text-gray-400">No hay carreras creadas.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {careers.map((career) => (
                        <Card key={career.id} className="bg-[#1F2937] border-gray-700 hover:border-[#5D5CDE]/50 transition-all">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Map size={20} className="text-[#5D5CDE]" />
                                    {career.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <p className="text-gray-400 text-sm line-clamp-2">
                                        {career.description || "Sin descripción"}
                                    </p>

                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>{career.milestones.length} Pasos</span>
                                        <span>{career.published ? "Publicado" : "Borrador"}</span>
                                    </div>

                                    <Link href={`/admin/careers/${career.id}`} className="block">
                                        <Button className="w-full bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white gap-2">
                                            Gestionar Ruta
                                            <ArrowRight size={16} />
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
