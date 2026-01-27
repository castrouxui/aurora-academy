"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowLeft, CheckCircle2, MonitorPlay, Layers, ShieldCheck, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/layout/Container";
import { PaymentModal } from "@/components/checkout/PaymentModal";
import { useSession } from "next-auth/react";

interface BundleClientProps {
    bundle: any;
}

export function BundleClient({ bundle }: BundleClientProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    const handleBuyClick = () => {
        if (!session) {
            router.push(`/login?callbackUrl=/bundles/${bundle.id}`);
            return;
        }
        setIsPaymentOpen(true);
    };

    if (!bundle) {
        return (
            <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center gap-4">
                <p>Paquete no encontrado</p>
                <Link href="/courses">
                    <Button variant="outline">Volver al catálogo</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0F19]">
            <Navbar />

            <div className="pt-32 pb-20">
                <Container>
                    <Link href="/cursos" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Volver a Carreras
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="space-y-4">
                                <Badge className="bg-[#5D5CDE]/20 text-[#bebeff] hover:bg-[#5D5CDE]/30 border-0 px-4 py-1 text-sm">
                                    Pack de Cursos
                                </Badge>
                                <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                                    {bundle.title}
                                </h1>
                                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                                    {bundle.description}
                                </p>
                            </div>

                            {/* What you get */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                                <h2 className="text-2xl font-bold text-white mb-6">Qué incluye este pack</h2>
                                <div className="grid gap-4">
                                    {bundle.courses?.map((course: any) => (
                                        <Link key={course.id} href={`/courses/${course.id}`} className="block group">
                                            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10">
                                                <div className="w-12 h-12 rounded-lg bg-[#5D5CDE]/20 flex items-center justify-center shrink-0">
                                                    <MonitorPlay size={20} className="text-[#5D5CDE]" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white group-hover:text-[#5D5CDE] transition-colors">{course.title}</h3>
                                                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">{course.description || "Sin descripción corta"}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Badge variant="outline" className="border-gray-700 text-gray-400 text-[10px]">{course.level || "General"}</Badge>
                                                        <span className="text-xs text-gray-500 font-medium line-through">
                                                            {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(course.price)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}

                                    {/* Membership Items */}
                                    {bundle.items?.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-white/10">
                                            <h3 className="text-lg font-semibold text-white mb-4">Beneficios Extra</h3>
                                            <div className="grid gap-3">
                                                {bundle.items.map((item: any) => (
                                                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-[#5D5CDE]/10 border border-[#5D5CDE]/20">
                                                        <div className="w-10 h-10 rounded-lg bg-[#5D5CDE]/20 flex items-center justify-center shrink-0">
                                                            {item.type === 'LINK' ? <LinkIcon size={18} className="text-[#5D5CDE]" /> : <CheckCircle2 size={18} className="text-[#5D5CDE]" />}
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium">{item.name}</p>
                                                            <p className="text-sm text-gray-400">
                                                                {item.type === 'LINK' ? 'Acceso exclusivo al comprar' : 'Incluido en la membresía'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-32 space-y-6">
                                <Card className="bg-[#121620] border-gray-800 shadow-2xl overflow-hidden">
                                    <div className="aspect-video relative bg-gray-800">
                                        {bundle.imageUrl ? (
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={bundle.imageUrl}
                                                    alt={bundle.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                    priority
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                <Layers size={48} />
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-6 space-y-6">
                                        <div>
                                            <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wide">Precio del Pack</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-bold text-white">
                                                    {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(bundle.price)}
                                                </span>
                                                <span className="text-gray-500 font-medium">ARS</span>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleBuyClick}
                                            className="w-full h-14 bg-[#5D5CDE] hover:bg-[#4B4AC0] text-lg font-bold shadow-lg shadow-[#5D5CDE]/20"
                                        >
                                            Comprar Pack Ahora
                                        </Button>

                                        <div className="space-y-4 pt-4 border-t border-gray-800">
                                            <div className="flex items-center gap-3 text-gray-300 text-sm">
                                                <CheckCircle2 size={16} className="text-green-500" />
                                                <span>Acceso inmediato a {bundle.courses?.length} cursos</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-300 text-sm">
                                                <CheckCircle2 size={16} className="text-green-500" />
                                                <span>Contenido siempre actualizado</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-300 text-sm">
                                                <ShieldCheck size={16} className="text-green-500" />
                                                <span>Garantía de satisfacción</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                courseTitle={bundle.title}
                coursePrice={bundle.price.toString()}
                bundleId={bundle.id}
                userId={session?.user?.id}
            />
        </div>
    );
}
