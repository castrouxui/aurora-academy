"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, LogOut, BookOpen, Settings } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function UserMenu() {
    const { data: session } = useSession();

    if (!session?.user) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full ring-2 ring-border/50 hover:ring-primary/50 transition-all outline-none">
                    <Image
                        src={session.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.name || 'User')}&background=random`}
                        alt={session.user.name || "User avatar"}
                        width={36}
                        height={36}
                        className="rounded-full object-cover"
                    />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl border-border bg-card shadow-xl shadow-black/5 p-2">
                <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-bold leading-none">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                </div>

                <DropdownMenuSeparator className="bg-border" />

                {session.user.role === "ADMIN" ? (
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2 focus:bg-primary/10 focus:text-primary">
                        <Link href="/admin">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Panel de Administración</span>
                        </Link>
                    </DropdownMenuItem>
                ) : null}

                <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2 focus:bg-primary/10 focus:text-primary">
                    <Link href="/dashboard/cursos">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Ir a mis cursos</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-border" />

                <DropdownMenuItem
                    className="rounded-xl cursor-pointer py-2 text-red-600 focus:bg-red-50 focus:text-red-700"
                    onClick={() => signOut({ callbackUrl: "/" })}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
