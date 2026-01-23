import { Container } from "@/components/layout/Container";
import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
            <Container className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 text-[#5D5CDE] animate-spin" />
                <p className="text-gray-400 text-sm animate-pulse">Cargando...</p>
            </Container>
        </div>
    );
}
