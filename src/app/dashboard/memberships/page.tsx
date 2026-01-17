"use client";

import { useSession } from "next-auth/react";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Package, MonitorPlay, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function MyMembershipsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [bundles, setBundles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    useEffect(() => {
        async function fetchBundles() {
            try {
                const res = await fetch("/api/my-bundles");
                if (res.ok) {
                    const data = await res.json();
                    setBundles(data);
                }
            } catch (error) {
                console.error("Fetch error", error);
            } finally {
                setLoading(false);
            }
        }

        if (session?.user) {
            fetchBundles();
        }
    }, [session]);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success("Link copiado al portapapeles");
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen pt-4 pb-12 bg-[#0B0F19]">
                <Container>
                    <Skeleton className="h-8 w-48 bg-gray-800 mb-8" />
                    <div className="grid gap-6">
                        {[1, 2].map((i) => (
                            <Skeleton key={i} className="h-40 w-full bg-gray-800 rounded-xl" />
                        ))}
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-4 pb-12 bg-[#0B0F19]">
            <Container>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Mis Membresías</h1>
                        <p className="text-gray-400">Accede a tus beneficios exclusivos y cursos.</p>
                    </div>
                </div>

                {bundles.length === 0 ? (
                    <div className="text-center py-20 bg-[#111827] rounded-xl border border-gray-800">
                        <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">
                            No tienes membresías activas
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Explora nuestros paquetes para acceder a beneficios exclusivos.
                        </p>
                        <Link href="/courses">
                            <Button className="bg-[#5D5CDE] hover:bg-[#4B4AC0]">Explorar Paquetes</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bundles.map((bundle) => (
                            <div key={bundle.id} className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden">
                                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Badge className="bg-[#5D5CDE]/20 text-[#bebeff] border-0">Activo</Badge>
                                            <h2 className="text-2xl font-bold text-white">{bundle.title}</h2>
                                        </div>
                                        <p className="text-gray-400">{bundle.description}</p>

                                        <div className="pt-4 flex flex-wrap gap-3">
                                            {/* Course Count */}
                                            <Link href="/dashboard/courses">
                                                <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white hover:bg-white/5 gap-2">
                                                    <MonitorPlay size={16} />
                                                    {bundle.courses.length} Cursos incluidos
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Actionable Items Section */}
                                    <div className="w-full md:w-[400px] bg-[#0B0F19] rounded-xl p-5 border border-gray-800">
                                        <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Tus Accesos</h3>
                                        <div className="space-y-3">
                                            {bundle.items && bundle.items.length > 0 ? (
                                                bundle.items.map((item: any) => (
                                                    <div key={item.id} className="flex flex-col gap-2 p-3 rounded-lg bg-[#1F2937] border border-gray-700">
                                                        <span className="font-medium text-white">{item.name}</span>
                                                        {item.type === 'LINK' ? (
                                                            <div className="flex gap-2">
                                                                <a
                                                                    href={item.content}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex-1"
                                                                >
                                                                    <Button size="sm" className="w-full bg-[#5D5CDE] hover:bg-[#4B4AC0] h-8 text-xs">
                                                                        <ExternalLink size={12} className="mr-2" />
                                                                        Abrir Link
                                                                    </Button>
                                                                </a>
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="h-8 w-8 text-gray-400 hover:text-white"
                                                                    onClick={() => handleCopy(item.content, item.id)}
                                                                >
                                                                    {copiedId === item.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <div className="bg-black/30 p-2 rounded text-sm text-gray-300 font-mono break-all flex items-center justify-between gap-2">
                                                                <span>{item.content}</span>
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="h-6 w-6 text-gray-500 hover:text-white shrink-0"
                                                                    onClick={() => handleCopy(item.content, item.id)}
                                                                >
                                                                    {copiedId === item.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-500 italic">No hay items extra en esta membresía.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}
