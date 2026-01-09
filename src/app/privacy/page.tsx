import { Container } from "@/components/layout/Container";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[#0B0F19]">
            <Navbar />
            <div className="pt-32 pb-16">
                <Container>
                    <h1 className="text-3xl font-bold text-white mb-8">Política de Privacidad</h1>
                    <div className="prose prose-invert max-w-none text-gray-300">
                        <p>Su privacidad es importante para nosotros. Es política de Aurora Academy respetar su privacidad con respecto a cualquier información que podamos recopilar de usted a través de nuestro sitio web.</p>

                        <h2 className="text-xl font-bold text-white mt-8 mb-4">Información que recopilamos</h2>
                        <p>Solo solicitamos información personal cuando realmente la necesitamos para brindarle un servicio. La recopilamos por medios justos y legales, con su conocimiento y consentimiento.</p>

                        <h2 className="text-xl font-bold text-white mt-8 mb-4">Uso de la información</h2>
                        <p>No compartimos ninguna información de identificación personal públicamente o con terceros, excepto cuando lo exige la ley.</p>

                        <h2 className="text-xl font-bold text-white mt-8 mb-4">Cookies</h2>
                        <p>Utilizamos cookies para mejorar su experiencia de navegación y analizar nuestro tráfico. Al navegar por nuestro sitio, acepta nuestra política de cookies.</p>
                    </div>
                </Container>
            </div>
            <Footer />
        </main>
    );
}
