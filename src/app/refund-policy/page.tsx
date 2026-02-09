import { Container } from "@/components/layout/Container";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function RefundPolicyPage() {
    return (
        <main className="min-h-screen bg-[#0B0F19]">
            <Navbar />
            <div className="pt-32 pb-16">
                <Container>
                    <h1 className="text-3xl font-bold text-white mb-8">Política de Reembolso</h1>
                    <div className="prose prose-invert max-w-none text-gray-300">
                        <p>En Aurora Academy, queremos que esté completamente satisfecho con su compra. Si por alguna razón no está contento con un curso, ofrecemos una política de reembolso bajo las siguientes condiciones:</p>

                        <h2 className="text-xl font-bold text-white mt-8 mb-4">Garantía de 7 días</h2>
                        <p>Tiene derecho a solicitar un reembolso completo dentro de los 7 días posteriores a su compra, siempre y cuando no haya completado más del 30% del contenido del curso.</p>

                        <h2 className="text-xl font-bold text-white mt-8 mb-4">Proceso de Reembolso</h2>
                        <p>Para solicitar un reembolso, envíe un correo electrónico a soporte@auroraacademy.com con los detalles de su compra y el motivo de la solicitud. Procesaremos su reembolso dentro de los 5-10 días hábiles posteriores a la aprobación.</p>
                    </div>
                </Container>
            </div>
            <Footer />
        </main>
    );
}
