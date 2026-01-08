import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSalesPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Ventas</h1>
            </div>

            <Card className="bg-[#1F2937] border-gray-700">
                <CardHeader>
                    <CardTitle className="text-white">Registro de Transacciones</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-gray-400">
                        La tabla de ventas se conectará con la base de datos próximamente.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
