"use client";

import { useState, useEffect } from "react";
import { Bell, BellDot, X, Check, Trash2, ExternalLink } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Notification {
    id: string;
    title: string;
    content: string;
    read: boolean;
    type: string;
    url?: string;
    createdAt: string;
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications");
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
                setUnreadCount(data.filter((n: Notification) => !n.read).length);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 60 seconds
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id?: string) => {
        try {
            const res = await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(id ? { id, read: true } : { read: true })
            });

            if (res.ok) {
                if (id) {
                    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
                    setUnreadCount(prev => Math.max(0, prev - 1));
                } else {
                    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                    setUnreadCount(0);
                }
            }
        } catch (error) {
            toast.error("Error al marcar como leída");
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            const res = await fetch("/api/notifications", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });

            if (res.ok) {
                setNotifications(prev => prev.filter(n => n.id !== id));
                const wasUnread = notifications.find(n => n.id === id)?.read === false;
                if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
                toast.success("Notificación eliminada");
            }
        } catch (error) {
            toast.error("Error al eliminar notificación");
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white hover:bg-white/5 rounded-xl">
                    {unreadCount > 0 ? (
                        <>
                            <BellDot className="h-5 w-5 text-primary animate-pulse" />
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-[10px] font-bold border-2 border-[#0B0F19]">
                                {unreadCount}
                            </Badge>
                        </>
                    ) : (
                        <Bell className="h-5 w-5" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 md:w-96 p-0 bg-[#1F2937] border-gray-700 shadow-2xl rounded-2xl overflow-hidden" align="end">
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        Notificaciones
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="bg-primary/20 text-primary border-0 font-bold">
                                {unreadCount} nuevas
                            </Badge>
                        )}
                    </h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead()}
                            className="text-xs text-gray-400 hover:text-white hover:bg-white/5"
                        >
                            Marcar todo como leído
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-96">
                    {notifications.length > 0 ? (
                        <div className="p-2 space-y-1">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "p-3 rounded-xl transition-all duration-200 group relative",
                                        notification.read ? "hover:bg-white/5" : "bg-primary/5 hover:bg-primary/10 border-l-2 border-primary"
                                    )}
                                >
                                    <div className="flex gap-3">
                                        <div className="flex-1 min-w-0">
                                            <p className={cn("text-xs font-bold leading-tight mb-1", notification.read ? "text-gray-300" : "text-white")}>
                                                {notification.title}
                                            </p>
                                            <p className="text-[11px] text-gray-400 leading-normal line-clamp-2">
                                                {notification.content}
                                            </p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-[10px] text-gray-500">
                                                    {new Date(notification.createdAt).toLocaleDateString()}
                                                </span>
                                                {notification.url && (
                                                    <Link
                                                        href={notification.url}
                                                        onClick={() => {
                                                            markAsRead(notification.id);
                                                            setIsOpen(false);
                                                        }}
                                                        className="text-[10px] text-primary hover:underline flex items-center gap-1 font-bold"
                                                    >
                                                        Ver más <ExternalLink size={10} />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!notification.read && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="h-7 w-7 text-emerald-500 hover:bg-emerald-500/10"
                                                    title="Marcar como leída"
                                                >
                                                    <Check size={14} />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => deleteNotification(notification.id)}
                                                className="h-7 w-7 text-red-500 hover:bg-red-500/10"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">
                            <div className="bg-gray-800/50 p-4 rounded-full mb-4">
                                <Bell className="h-8 w-8 opacity-20" />
                            </div>
                            <p className="font-bold text-white/50">No hay notificaciones</p>
                            <p className="text-sm mt-1">Te avisaremos cuando pase algo interesante.</p>
                        </div>
                    )}
                </ScrollArea>

                <div className="p-3 border-t border-gray-700 bg-black/20 text-center">
                    <Link
                        href="/dashboard/configuracion"
                        onClick={() => setIsOpen(false)}
                        className="text-xs text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                        Configurar notificaciones
                    </Link>
                </div>
            </PopoverContent>
        </Popover>
    );
}
