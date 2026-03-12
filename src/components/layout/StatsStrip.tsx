import { Container } from "@/components/layout/Container";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MoveRight, Bitcoin, TrendingUp, DollarSign } from "lucide-react";
import { getRegisteredUserCount, getReviewAvatars } from "@/actions/user";

export async function StatsStrip() {
    const userCount = await getRegisteredUserCount();
    const avatars = await getReviewAvatars();
    const displayAvatars = avatars.slice(0, 4);

    return (
        <section className="bg-foreground border-y border-foreground/10 py-20 relative z-20 overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

            <Container>
                <div className="flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
                    {/* Left Side: Copy & CTA */}
                    <div className="flex flex-col items-center lg:items-start space-y-8 max-w-2xl text-center lg:text-left">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-background/20 bg-background/5 backdrop-blur-sm">
                            <span className="text-background text-sm font-medium">Comunidad Aurora</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-background leading-tight tracking-tight">
                            Estudia con traders de toda la región y crea vínculos para toda la vida
                        </h2>

                        <Button className="shiny-hover h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-lg transition-all hover:scale-105">
                            Unirme a la comunidad
                            <MoveRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>

                    {/* Right Side: Social Proof & Avatars */}
                    <div className="flex flex-col items-center lg:items-end gap-8">
                        {/* Avatar Group */}
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-4">
                                {displayAvatars.map((src, i) => (
                                    <div key={i} className="w-12 h-12 rounded-full border-2 border-foreground overflow-hidden relative bg-muted">
                                        <Image
                                            src={src}
                                            alt="Student"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-background font-bold text-lg leading-none">+{userCount}</span>
                                <span className="text-background/60 text-sm font-medium">Estudiantes Activos</span>
                            </div>
                        </div>

                        {/* Market Icons */}
                        <div className="flex items-center gap-6 p-4 bg-background/5 rounded-2xl border border-background/10 backdrop-blur-sm">
                            <span className="text-background/60 text-xs font-bold uppercase tracking-wider mr-2">Mercados:</span>
                            <div className="flex items-center gap-4 text-background/80">
                                <div className="flex items-center gap-2" title="Crypto">
                                    <Bitcoin size={24} className="text-orange-400" />
                                </div>
                                <div className="flex items-center gap-2" title="Forex">
                                    <DollarSign size={24} className="text-green-400" />
                                </div>
                                <div className="flex items-center gap-2" title="Stocks">
                                    <TrendingUp size={24} className="text-blue-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
