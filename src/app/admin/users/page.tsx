"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, Shield, User as UserIcon, Calendar, Loader2 } from "lucide-react";

interface User {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: string;
    _count: {
        purchases: number;
    };
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<'all' | 'students' | 'registered' | 'admins'>('all');

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch("/api/users");
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data);
                }
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()));

        if (!matchesSearch) return false;

        if (filter === 'admins') return user.role === 'ADMIN';
        if (filter === 'students') return user.role !== 'ADMIN' && user._count.purchases > 0;
        if (filter === 'registered') return user.role !== 'ADMIN' && user._count.purchases === 0;

        return true; // 'all'
    });

    const getUserStatus = (user: User) => {
        if (user.role === 'ADMIN') return { label: 'Admin', color: 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30' };
        if (user._count.purchases > 0) return { label: 'Estudiante', color: 'bg-green-500/20 text-green-300 hover:bg-green-500/30' };
        return { label: 'Registrado', color: 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' };
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Usuarios</h1>
                    <p className="text-gray-400 mt-1">Gestión de estudiantes y administradores</p>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                        placeholder="Buscar usuario..."
                        className="pl-9 bg-[#1F2937] border-gray-700 text-white placeholder:text-gray-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilter('all')}
                    className={filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-transparent border-gray-700 text-gray-300 hover:text-white'}
                >
                    Todos
                </Button>
                <Button
                    variant={filter === 'students' ? 'default' : 'outline'}
                    onClick={() => setFilter('students')}
                    className={filter === 'students' ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' : 'bg-transparent border-gray-700 text-gray-300 hover:text-green-400 hover:border-green-400/50'}
                >
                    Estudiantes
                </Button>
                <Button
                    variant={filter === 'registered' ? 'default' : 'outline'}
                    onClick={() => setFilter('registered')}
                    className={filter === 'registered' ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'bg-transparent border-gray-700 text-gray-300 hover:text-blue-400 hover:border-blue-400/50'}
                >
                    Registrados
                </Button>
                <Button
                    variant={filter === 'admins' ? 'default' : 'outline'}
                    onClick={() => setFilter('admins')}
                    className={filter === 'admins' ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700' : 'bg-transparent border-gray-700 text-gray-300 hover:text-purple-400 hover:border-purple-400/50'}
                >
                    Admins
                </Button>
            </div>

            <Card className="bg-[#1F2937] border-gray-700">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Base de Usuarios ({filteredUsers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="animate-spin text-primary h-8 w-8" />
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No se encontraron usuarios con el filtro seleccionado.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredUsers.map((user) => {
                                const status = getUserStatus(user);
                                return (
                                    <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-[#111827] border border-gray-800 hover:border-gray-700 transition-colors gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <img
                                                    src={user.image || `https://ui-avatars.com/api/?name=${user.name || "User"}&background=random`}
                                                    alt={user.name || "User"}
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-700"
                                                />
                                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#111827] ${user.role === 'ADMIN' ? 'bg-purple-500' : user._count.purchases > 0 ? 'bg-green-500' : 'bg-blue-500'}`} />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-medium">{user.name || "Sin nombre"}</h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <Mail size={12} className="shrink-0" />
                                                    <span className="truncate max-w-[200px] sm:max-w-xs">{user.email}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 sm:gap-8 w-full sm:w-auto justify-between sm:justify-end">
                                            <div className="hidden sm:flex flex-col items-end">
                                                <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Cursos</span>
                                                <span className="text-white font-mono">{user._count.purchases}</span>
                                            </div>
                                            <Badge variant="secondary" className={status.color}>
                                                {user.role === 'ADMIN' ? <Shield size={10} className="mr-1" /> : <UserIcon size={10} className="mr-1" />}
                                                {status.label}
                                            </Badge>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
