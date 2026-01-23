"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, BookOpen, Users, LogOut, Settings, GraduationCap, Compass, Receipt, Package } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { useSession, signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { Sidebar } from "@/components/layout/Sidebar";

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
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Ventas", href: "/admin/sales", icon: Receipt }, // Updated to /admin/sales to match verification
        { name: "Cursos", href: "/admin/courses", icon: BookOpen },
        { name: "Membresías", href: "/admin/bundles", icon: Package },
        { name: "Usuarios", href: "/admin/users", icon: Users },
    ];

    const studentNav = [
        { name: "Inicio", href: "/dashboard", icon: LayoutDashboard },
        { name: "Mis Cursos", href: "/dashboard/courses", icon: BookOpen },
        { name: "Membresías", href: "/dashboard/memberships", icon: Package },
        { name: "Explorar", href: "/dashboard/explore", icon: Compass },
        { name: "Certificados", href: "/dashboard/certificates", icon: GraduationCap },
    ];

    const navigation = isAdmin ? adminNav : studentNav;

    return (
        <div className="min-h-screen bg-[#0B0F19] flex">
            {/* Desktop Sidebar - Now generic */}
            <Sidebar
                items={navigation}
                user={session.user}
                roleLabel={isAdmin ? "Administración" : "Mi Aprendizaje"}
            />

            {/* Mobile Header & Sidebar */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-[#111827] border-b border-[#1F2937] z-20 flex items-center px-4 md:hidden">
                <MobileSidebar
                    items={navigation.map(n => ({ ...n, icon: n.icon }))}
                    role={isAdmin ? "ADMIN" : "ESTUDIANTE"}
                    user={session.user}
                />
                <div className="ml-4">
                    <Logo />
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 w-full overflow-x-hidden">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
