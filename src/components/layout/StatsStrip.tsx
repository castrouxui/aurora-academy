import { Container } from "@/components/layout/Container";
import { Users, Award, TrendingUp, ShieldCheck } from "lucide-react";

export function StatsStrip() {
    return (
        <section className="bg-black border-y border-white/10 py-10 relative z-20">
            <Container>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <StatItem
                        icon={<Users className="text-[#5D5CDE]" size={28} />}
                        value="+1.000"
                        label="Alumnos Activos"
                    />
                    <StatItem
                        icon={<Award className="text-[#5D5CDE]" size={28} />}
                        value="Certificaciones"
                        label="Oficiales"
                    />
                    <StatItem
                        icon={<ShieldCheck className="text-[#5D5CDE]" size={28} />}
                        value="Mentoria"
                        label="1 a 1 Garantizada"
                    />
                    <StatItem
                        icon={<TrendingUp className="text-[#5D5CDE]" size={28} />}
                        value="Y Combinator"
                        label="Backed Company"
                    />
                </div>
            </Container>
        </section>
    );
}

function StatItem({ icon, value, label }: { icon: any, value: string, label: string }) {
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-2 group hover:-translate-y-1 transition-transform duration-300">
            <div className="p-3 bg-white/5 rounded-2xl mb-1 group-hover:bg-[#5D5CDE]/20 transition-colors">
                {icon}
            </div>
            <div>
                <p className="text-2xl md:text-3xl font-black text-white tracking-tight">{value}</p>
                <p className="text-sm text-gray-400 font-medium uppercase tracking-wide">{label}</p>
            </div>
        </div>
    );
}
