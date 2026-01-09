"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, BookOpen, Users, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        if (!session || session.user.role !== "ADMIN") {
            router.push("/");
        }
    }, [session, status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#5D5CDE]" />
            </div>
        );
    }

    if (!session || session.user.role !== "ADMIN") {
        return null;
    }

    const navigation = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Ventas", href: "/admin/sales", icon: ShoppingCart },
        { name: "Cursos", href: "/admin/courses", icon: BookOpen },
        { name: "Usuarios", href: "/admin/users", icon: Users },
    ];

    return (
        <div className="min-h-screen bg-[#0B0F19] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#111827] border-r border-[#1F2937] flex flex-col fixed h-full z-10">
                <div className="h-16 flex items-center px-6 border-b border-[#1F2937]">
                    <Logo />
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                    <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        Administración
                    </p>
                    <nav className="space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                        ? "bg-[#5D5CDE]/10 text-[#5D5CDE]"
                                        : "text-gray-400 hover:bg-[#1F2937] hover:text-white"
                                        }`}
                                >
                                    <item.icon size={20} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-8">
                        <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            Sistema
                        </p>
                        <nav className="space-y-1">
                            <Link
                                href="/settings"
                                className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-400 hover:bg-[#1F2937] hover:text-white transition-colors"
                            >
                                <Settings size={20} />
                                Configuración
                            </Link>
                        </nav>
                    </div>
                </div>

                <div className="p-4 border-t border-[#1F2937]">
                    <Link href="/">
                        <Button variant="outline" className="w-full gap-2 border-[#1F2937] text-gray-400 hover:text-white hover:bg-[#1F2937]">
                            <LogOut size={16} />
                            Volver al Sitio
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
