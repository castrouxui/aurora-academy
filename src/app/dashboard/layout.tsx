"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, BookOpen, Users, LogOut, Settings, GraduationCap, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { useSession, signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
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

    if (!session) return null;

    const isAdmin = session.user.role === "ADMIN";

    // Navigation Config
    const adminNav = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Ventas", href: "/dashboard/admin/sales", icon: ShoppingCart },
        { name: "Cursos", href: "/dashboard/admin/courses", icon: BookOpen },
        { name: "Usuarios", href: "/dashboard/admin/users", icon: Users },
    ];

    const studentNav = [
        { name: "Mis Cursos", href: "/dashboard/courses", icon: BookOpen },
        { name: "Explorar", href: "/courses", icon: Compass },
        // Placeholder for future features
        { name: "Certificados", href: "/dashboard/certificates", icon: GraduationCap },
    ];

    const navigation = isAdmin ? adminNav : studentNav;

    return (
        <div className="min-h-screen bg-[#0B0F19] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#111827] border-r border-[#1F2937] flex flex-col fixed h-full z-10 hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-[#1F2937]">
                    <Logo />
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                    <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        {isAdmin ? "Administración" : "Mi Aprendizaje"}
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
                            Cuenta
                        </p>
                        <nav className="space-y-1">
                            <Link
                                href="/dashboard/settings"
                                className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-400 hover:bg-[#1F2937] hover:text-white transition-colors"
                            >
                                <Settings size={20} />
                                Configuración
                            </Link>
                        </nav>
                    </div>
                </div>

                <div className="p-4 border-t border-[#1F2937]">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <img
                            src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=random`}
                            alt={session.user.name || "User"}
                            className="w-10 h-10 rounded-full border border-gray-700"
                        />
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                        </div>
                    </div>
                    <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full">
                        <Button variant="outline" className="w-full gap-2 border-[#1F2937] text-gray-400 hover:text-white hover:bg-[#1F2937]">
                            <LogOut size={16} />
                            Cerrar sesión
                        </Button>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
