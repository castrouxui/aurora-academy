"use client";

import { useEffect, useState } from "react";
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

    const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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

            <Card className="bg-[#1F2937] border-gray-700">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Base de Usuarios ({users.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="animate-spin text-primary h-8 w-8" />
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No se encontraron usuarios.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredUsers.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-[#111827] border border-gray-800 hover:border-gray-700 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img
                                                src={user.image || `https://ui-avatars.com/api/?name=${user.name || "User"}&background=random`}
                                                alt={user.name || "User"}
                                                className="w-10 h-10 rounded-full object-cover border border-gray-700"
                                            />
                                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#111827] ${user.role === 'ADMIN' ? 'bg-purple-500' : 'bg-emerald-500'}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-medium">{user.name || "Sin nombre"}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Mail size={12} />
                                                <span>{user.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 sm:gap-8">
                                        <div className="hidden sm:flex flex-col items-end">
                                            <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Cursos</span>
                                            <span className="text-white font-mono">{user._count.purchases}</span>
                                        </div>
                                        <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className={user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30' : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'}>
                                            {user.role === 'ADMIN' ? <Shield size={10} className="mr-1" /> : <UserIcon size={10} className="mr-1" />}
                                            {user.role}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
