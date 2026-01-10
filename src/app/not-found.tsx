import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft, Ghost } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
            <div className="text-center space-y-8 max-w-lg mx-auto">

                {/* Illustration container */}
                <div className="relative flex justify-center">
                    <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                    <div className="relative bg-[#1F2937]/50 p-8 rounded-full border border-gray-800 backdrop-blur-sm animate-float">
                        <Ghost size={80} className="text-gray-400" />
                    </div>
                </div>

                <div className="space-y-4 relative z-10">
                    <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">
                        404
                    </h1>
                    <h2 className="text-2xl font-bold text-white">
                        Página no encontrada
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Parece que te has perdido en el espacio. La página que buscas no existe o ha sido movida a otra dimensión.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
                    <Link href="/">
                        <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-white min-w-[200px]">
                            <MoveLeft size={18} />
                            Volver al Inicio
                        </Button>
                    </Link>
                    <Link href="/courses">
                        <Button size="lg" variant="outline" className="min-w-[200px] border-gray-700 hover:bg-gray-800 text-gray-300">
                            Explorar Cursos
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    );
}
