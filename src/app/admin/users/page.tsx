import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminUsersPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Usuarios</h1>
            </div>

            <Card className="bg-[#1F2937] border-gray-700">
                <CardHeader>
                    <CardTitle className="text-white">Base de Estudiantes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-gray-400">
                        Aquí podrás gestionar los usuarios registrados y sus accesos.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
