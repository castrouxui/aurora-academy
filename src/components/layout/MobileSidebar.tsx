"use client";

import { Menu, X, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import { signOut } from "next-auth/react";
import { NotificationBell } from "@/components/layout/NotificationBell";

interface NavItem {
    name: string;
    href: string;
    icon: any;
}

interface MobileSidebarProps {
    items: NavItem[];
    role: "ADMIN" | "ESTUDIANTE";
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        telegramVerified?: boolean;
    };
}

export function MobileSidebar({ items, role, user }: MobileSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="md:hidden">
            {/* Toggle Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
                className="text-white hover:bg-gray-800"
            >
                <Menu size={24} />
            </Button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Drawer */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#111827] border-r border-[#1F2937] transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-[#1F2937]">
                    <Logo />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(false)}
                        className="text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </Button>
                </div>

                <div className="p-4 flex flex-col h-[calc(100%-4rem)]">
                    <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        {role === "ADMIN" ? "Administración" : "Mi Aprendizaje"}
                    </p>
                    <nav className="space-y-1 flex-1">
                        {items.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
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

                    {user && (
                        <div className="mt-auto border-t border-[#1F2937] pt-4">
                            <div className="flex items-center gap-3 px-2 mb-4">
                                <img
                                    src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                    alt={user.name || "User"}
                                    className="w-10 h-10 rounded-full border border-gray-700"
                                />
                                <div className="overflow-hidden">
                                    <p className="text-sm font-medium text-white truncate flex items-center gap-1">
                                        {user.name}
                                        {user.telegramVerified && (
                                            <ShieldCheck size={14} className="text-green-500 fill-green-500/20" />
                                        )}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 px-2 mb-4">
                                <Link href="/dashboard/settings" onClick={() => setIsOpen(false)}>
                                    <button className="w-full text-left px-3 py-2 text-sm font-medium text-gray-400 rounded-lg hover:bg-[#1F2937] hover:text-white transition-colors">
                                        Configuración
                                    </button>
                                </Link>
                                <NotificationBell />
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="w-full gap-2 border-[#1F2937] text-gray-400 hover:text-white hover:bg-[#1F2937]"
                            >
                                <LogOut size={16} />
                                Cerrar sesión
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
