"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, Award, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StudentDashboard() {
    const { data: session } = useSession();

    // Mock Stats for UI Demo
    const stats = [
        {
            title: "Cursos en Progreso",
            value: "2",
            description: "Continúa donde dejaste",
            icon: BookOpen,
            color: "text-blue-500",
        },
        {
            title: "Certificados",
            value: "0",
            description: "Completados hasta ahora",
            icon: Award,
            color: "text-purple-500",
        },
        {
            title: "Horas Aprendidas",
            value: "12.5",
            description: "+2.5h esta semana",
            icon: Clock,
            color: "text-green-500",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                    Hola, {session?.user?.name?.split(" ")[0]} 👋
                </h1>
                <p className="text-gray-400">
                    Bienvenido a tu panel de aprendizaje. Aquí tienes un resumen de tu progreso.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.title} className="bg-[#111827] border-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-200">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <p className="text-xs text-gray-500">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity / Continue Learning */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-[#111827] border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-white">Continuar Aprendiendo</CardTitle>
                        <CardDescription className="text-gray-400">
                            Tus cursos visitados recientemente
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Placeholder for recent course */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-[#1F2937]/50 border border-gray-700/50">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded bg-[#5D5CDE]/20 flex items-center justify-center text-[#5D5CDE]">
                                    <BookOpen size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Introducción a Crypto</p>
                                    <p className="text-xs text-gray-500">Módulo 2 • Lección 3</p>
                                </div>
                            </div>
                            <Link href="/my-courses">
                                <Button size="sm" variant="ghost" className="text-[#5D5CDE] hover:text-[#5D5CDE] hover:bg-[#5D5CDE]/10">
                                    <ArrowRight size={16} />
                                </Button>
                            </Link>
                        </div>
                        <div className="mt-4">
                            <Link href="/my-courses">
                                <Button className="w-full bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white">
                                    Ir a Mis Cursos
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#111827] border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-white">Logros Recientes</CardTitle>
                        <CardDescription className="text-gray-400">
                            Medallas y certificados obtenidos
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                        <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center text-gray-600">
                            <Award size={32} />
                        </div>
                        <p className="text-sm text-gray-400">Aún no tienes certificados.</p>
                        <p className="text-xs text-gray-500">¡Completa tu primer curso para ganar uno!</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
