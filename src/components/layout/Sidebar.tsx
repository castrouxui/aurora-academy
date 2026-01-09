"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { LogOut, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

interface NavItem {
    name: string;
    href: string;
    icon: any;
}

interface SidebarProps {
    items: NavItem[];
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
    roleLabel: string;
}

export function Sidebar({ items, user, roleLabel }: SidebarProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside className={cn(
            "bg-[#111827] border-r border-[#1F2937] flex-col sticky top-0 h-screen shrink-0 hidden md:flex transition-all duration-300 z-10",
            isCollapsed ? "w-20" : "w-64"
        )}>
            {/* Header */}
            <div className={cn(
                "h-16 flex items-center border-b border-[#1F2937] relative",
                isCollapsed ? "justify-center px-0" : "px-6"
            )}>
                {isCollapsed ? (
                    <div className="scale-75 origin-center">
                        <Logo iconOnly />
                    </div>
                ) : (
                    <Logo />
                )}

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 bg-[#1F2937] border border-gray-700 text-gray-400 hover:text-white rounded-full p-1 shadow-lg z-50"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            {/* Navigation */}
            <div className="p-4 flex-1 overflow-y-auto overflow-x-hidden">
                {!isCollapsed && (
                    <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 animate-in fade-in duration-300">
                        {roleLabel}
                    </p>
                )}

                <nav className="space-y-1">
                    {items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                title={isCollapsed ? item.name : undefined}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                    isActive
                                        ? "bg-[#5D5CDE]/10 text-[#5D5CDE]"
                                        : "text-gray-400 hover:bg-[#1F2937] hover:text-white",
                                    isCollapsed && "justify-center px-2"
                                )}
                            >
                                <item.icon size={20} className="shrink-0" />
                                {!isCollapsed && <span className="truncate">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-8">
                    {!isCollapsed && (
                        <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 animate-in fade-in duration-300">
                            Cuenta
                        </p>
                    )}
                    <nav className="space-y-1">
                        <Link
                            href="/dashboard/settings"
                            title={isCollapsed ? "Configuración" : undefined}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-400 hover:bg-[#1F2937] hover:text-white transition-colors",
                                isCollapsed && "justify-center px-2"
                            )}
                        >
                            <Settings size={20} className="shrink-0" />
                            {!isCollapsed && <span className="truncate">Configuración</span>}
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-[#1F2937]">
                {!isCollapsed ? (
                    <>
                        <div className="flex items-center gap-3 px-2 mb-4 animate-in fade-in duration-300">
                            <img
                                src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                alt={user.name || "User"}
                                className="w-10 h-10 rounded-full border border-gray-700 shrink-0"
                            />
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            variant="outline"
                            className="w-full gap-2 border-[#1F2937] text-gray-400 hover:text-white hover:bg-[#1F2937]"
                        >
                            <LogOut size={16} />
                            Cerrar sesión
                        </Button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <img
                            src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                            alt={user.name || "User"}
                            className="w-8 h-8 rounded-full border border-gray-700"
                            title={user.name || ""}
                        />
                        <Button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-white hover:bg-[#1F2937]"
                            title="Cerrar sesión"
                        >
                            <LogOut size={18} />
                        </Button>
                    </div>
                )}
            </div>
        </aside>
    );
}
