import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { RefundButton } from "@/components/dashboard/RefundButton";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Package, CreditCard } from "lucide-react";

export default async function PurchasesPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    const purchases = await prisma.purchase.findMany({
        where: {
            userId: session.user.id,
            status: { in: ["approved", "refunded"] }
        },
        include: {
            course: true,
            bundle: true,
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return (
        <div className="space-y-8 p-8">
            <DashboardHeader
                heading="Historial de Compras"
                text="Gestiona tus recibos y reembolsos."
            />

            <div className="grid gap-4">
                {purchases.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 bg-[#1F2937]/30 rounded-xl border border-gray-800">
                        <CreditCard className="mx-auto h-12 w-12 mb-4 opacity-50" />
                        <p>No has realizado ninguna compra aún.</p>
                    </div>
                ) : (
                    purchases.map((purchase) => (
                        <div key={purchase.id} className="bg-[#1F2937]/30 border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-lg ${purchase.status === 'refunded' ? 'bg-red-500/10 text-red-500' : 'bg-[#5D5CDE]/10 text-[#5D5CDE]'}`}>
                                    <Package size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">
                                        {purchase.course?.title || purchase.bundle?.title || "Producto Desconocido"}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        Comprado el {format(new Date(purchase.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                                    </p>
                                    <p className="text-sm text-gray-500 font-mono mt-1">ID: {purchase.id}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="font-bold text-white text-xl">
                                    ${Number(purchase.amount).toLocaleString('es-AR')}
                                </div>
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${purchase.status === 'approved'
                                        ? 'bg-green-500/10 text-green-500'
                                        : 'bg-red-500/10 text-red-500'
                                    }`}>
                                    {purchase.status === 'approved' ? 'Aprobado' : 'Reembolsado'}
                                </div>
                                {purchase.status === 'approved' && (
                                    <RefundButton purchaseId={purchase.id} createdAt={purchase.createdAt.toISOString()} />
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
