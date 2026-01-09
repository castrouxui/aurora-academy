import { Container } from "@/components/layout/Container";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#0B0F19]">
            <Navbar />
            <div className="pt-32 pb-16">
                <Container>
                    <h1 className="text-3xl font-bold text-white mb-8">Términos y Condiciones</h1>
                    <div className="prose prose-invert max-w-none text-gray-300">
                        <p>Bienvenido a Aurora Academy. Al acceder a nuestro sitio web, aceptas estar sujeto a estos términos de servicio, a todas las leyes y regulaciones aplicables, y aceptas que eres responsable del cumplimiento de las leyes locales aplicables.</p>

                        <h2 className="text-xl font-bold text-white mt-8 mb-4">Licencia de Uso</h2>
                        <p>Se concede permiso para descargar temporalmente una copia de los materiales (información o software) en el sitio web de Aurora Academy para visualización transitoria personal y no comercial. Esta es la concesión de una licencia, no una transferencia de título.</p>

                        <h2 className="text-xl font-bold text-white mt-8 mb-4">Renuncia</h2>
                        <p>Los materiales en el sitio web de Aurora Academy se proporcionan "tal cual". Aurora Academy no ofrece garantías, expresas o implícitas, y por la presente renuncia y niega todas las otras garantías incluyendo, sin limitación, garantías implícitas o condiciones de comerciabilidad.</p>

                        <h2 className="text-xl font-bold text-white mt-8 mb-4">Limitaciones</h2>
                        <p>En ningún caso Aurora Academy o sus proveedores serán responsables de ningún daño (incluyendo, sin limitación, daños por pérdida de datos o beneficios, o debido a la interrupción del negocio) que surjan del uso o la imposibilidad de usar los materiales en el sitio web de Aurora Academy.</p>
                    </div>
                </Container>
            </div>
            <Footer />
        </main>
    );
}
