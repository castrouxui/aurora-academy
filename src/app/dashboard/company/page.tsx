import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Users, Copy, Building2, BarChart3 } from "lucide-react";
import InviteLink from "@/components/company/InviteLink";

export default async function CompanyDashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.companyId || !session.user.isCompanyAdmin) {
        redirect("/dashboard");
    }

    const company = await prisma.company.findUnique({
        where: { id: session.user.companyId },
        include: {
            users: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    progress: true, // Only if we want to calculate stats
                    // createdAt: true // Commented out to fix Vercel Type build error
                },
                // orderBy: { createdAt: 'desc' }, // Commented out
                orderBy: { name: 'asc' }
            }
        }
    });

    if (!company) redirect("/dashboard");

    const usedSeats = company.users.length;
    const progressPercentage = (usedSeats / company.maxSeats) * 100;

    return (
        <div className="space-y-8 p-8">
            <DashboardHeader
                heading={company.name}
                text="Panel de Gestión de Equipo"
            />

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#1F2937]/30 border border-gray-800 p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Users size={64} className="text-[#5D5CDE]" />
                    </div>
                    <h3 className="text-gray-400 font-medium mb-2">Cupos Utilizados</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">{usedSeats}</span>
                        <span className="text-gray-500">/ {company.maxSeats}</span>
                    </div>
                    <div className="w-full bg-gray-700 h-2 rounded-full mt-4 overflow-hidden">
                        <div
                            className="bg-[#5D5CDE] h-full transition-all duration-500"
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        />
                    </div>
                </div>

                <div className="bg-[#1F2937]/30 border border-gray-800 p-6 rounded-2xl">
                    <h3 className="text-gray-400 font-medium mb-4">Link de Invitación</h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Compartí este link con tus colaboradores para que se unan al equipo.
                    </p>
                    <InviteLink accessCode={company.accessCode} />
                </div>

                <div className="bg-[#1F2937]/30 border border-gray-800 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                    <BarChart3 className="text-gray-600 mb-3" size={32} />
                    <h3 className="text-gray-400 font-medium">Reporte de Impacto</h3>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-tight">Próximamente disponible</p>
                </div>
            </div>

            {/* Employee List */}
            <div className="bg-[#1F2937]/30 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                    <h3 className="text-xl font-bold text-white">Colaboradores Activos</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#111827]">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Usuario</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha de Alta</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {company.users.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs overflow-hidden">
                                                {user.image ? (
                                                    <img src={user.image} alt={user.name || ""} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="font-bold">{user.name?.charAt(0) || "U"}</span>
                                                )}
                                            </div>
                                            <span className="text-white font-medium">{user.name || "Sin nombre"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                                        {/* {new Date(user.createdAt).toLocaleDateString()} */}
                                        -
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                                            Activo
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {company.users.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        Aún no hay colaboradores en el equipo.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
