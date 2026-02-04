"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Package, ShoppingCart, Compass, GraduationCap, ShieldCheck, Building2, FileText, Users, DollarSign } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { useSession, signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { Sidebar } from "@/components/layout/Sidebar";
import { TelegramBlockingOverlay } from "@/components/dashboard/TelegramBlockingOverlay";

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

    const isMainAdmin = session.user.role === "ADMIN";
    const isCompanyAdmin = !!session.user.isCompanyAdmin;
    const canSeeAdmin = isMainAdmin;

    // Navigation Config
    const adminNav = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Ventas", href: "/admin/sales", icon: FileText },
        { name: "Cursos", href: "/admin/courses", icon: BookOpen },
        { name: "Membresías", href: "/admin/bundles", icon: Package },
        { name: "Usuarios", href: "/admin/users", icon: Users },
        { name: "Panel Financiero", href: "/dashboard/financial", icon: DollarSign },
    ];

    const studentNav = [
        { name: "Inicio", href: "/dashboard", icon: LayoutDashboard },
        { name: "Mis Cursos", href: "/dashboard/cursos", icon: BookOpen },
        { name: "Membresías", href: "/dashboard/membresias", icon: Package },
        { name: "Compras", href: "/dashboard/compras", icon: ShoppingCart },
        { name: "Explorar", href: "/dashboard/explorar", icon: Compass },
        { name: "Certificados", href: "/dashboard/certificados", icon: GraduationCap },
    ];

    if (isCompanyAdmin) {
        studentNav.splice(1, 0, { name: "Mi Empresa", href: "/dashboard/company", icon: Building2 });
        // If they are company admin but not main admin, give them access to finance too
        if (!isMainAdmin) {
            studentNav.push({ name: "Panel Financiero", href: "/dashboard/financial", icon: DollarSign });
        }
    }

    const navigation = isMainAdmin ? adminNav : studentNav;

    const isStudent = session.user.role === "ESTUDIANTE";
    const needsTelegram = false; // DISABLED GLOBAL FOR NOW

    return (
        <div className="min-h-screen bg-[#0B0F19] flex">
            {/* Mandatory Telegram Verification for Students */}
            {/* Desktop Sidebar - Now generic */}
            <Sidebar
                items={navigation}
                user={session.user}
                roleLabel={isMainAdmin ? "Administración" : "Mi Aprendizaje"}
            />

            {/* Mobile Header & Sidebar */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-[#111827] border-b border-[#1F2937] z-20 flex items-center px-4 md:hidden">
                <MobileSidebar
                    items={navigation.map(n => ({ ...n, icon: n.icon }))}
                    role={isMainAdmin ? "ADMIN" : "ESTUDIANTE"}
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
