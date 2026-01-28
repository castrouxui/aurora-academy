"use client";

import { useSession } from "next-auth/react";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Award, Download, Share2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CertificateModal } from "@/components/certificates/CertificateModal";



export default function CertificatesPage() {
    const { data: session } = useSession();
    const [completedCourses, setCompletedCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
    const [isCertModalOpen, setIsCertModalOpen] = useState(false);

    useEffect(() => {
        async function fetchCourses() {
            try {
                const res = await fetch("/api/my-courses");
                if (res.ok) {
                    const data = await res.json();
                    const completed = data.filter((c: any) => c.progress === 100);
                    setCompletedCourses(completed);
                } else {
                    setCompletedCourses([]);
                }
            } catch (err) {
                console.error("Failed to fetch courses for certificates", err);
                setCompletedCourses([]);
            }
        }

        if (session?.user) {
            fetchCourses();
        }
    }, [session]);

    const handleOpenCert = (course: any) => {
        // Ensure user name is present for certificate
        if (!session?.user?.name) return;

        setSelectedCourse({
            courseName: course.title,
            studentName: session.user.name,
            completionDate: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
        });
        setIsCertModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Mis Certificados</h1>
                    <p className="text-gray-400">Descarga y comparte tus logros académicos.</p>
                </div>

                {completedCourses.length === 0 ? (
                    <div className="text-center py-20 bg-[#1F2937]/30 rounded-xl border border-dashed border-gray-700">
                        <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Aún no tienes certificados</h3>
                        <p className="text-gray-400 mb-6 max-w-md mx-auto">
                            Completa el 100% de las lecciones de un curso para desbloquear tu certificado oficial.
                        </p>
                        <Link href="/dashboard/courses">
                            <Button className="bg-primary hover:bg-primary/90">Ir a Mis Cursos</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {completedCourses.map((course) => (
                            <Card key={course.id} className="bg-[#1F2937] border-gray-700 overflow-hidden hover:border-primary/50 transition-colors group">
                                <div className="h-3 bg-gradient-to-r from-primary to-purple-600 w-full" />
                                <CardHeader>
                                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-3 text-primary">
                                        <GraduationCap size={20} />
                                    </div>
                                    <CardTitle className="text-white text-lg leading-tight">
                                        Certificado de Finalización
                                    </CardTitle>
                                    <CardDescription className="text-gray-400">
                                        {course.title}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-gray-500">
                                        Otorgado a: <span className="text-white font-medium">{session?.user?.name || "Estudiante"}</span>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        Estado: <span className="text-green-400 font-medium">Verificado</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0">
                                    <Button
                                        onClick={() => handleOpenCert(course)}
                                        className="w-full bg-[#121620] hover:bg-white text-white hover:text-black border border-gray-600 transition-colors gap-2"
                                    >
                                        <Download size={16} />
                                        Ver Certificado
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {selectedCourse && (
                <CertificateModal
                    isOpen={isCertModalOpen}
                    onClose={() => setIsCertModalOpen(false)}
                    studentName={selectedCourse.studentName}
                    courseName={selectedCourse.courseName}
                    date={selectedCourse.completionDate}
                />
            )}
        </div>
    );
}
