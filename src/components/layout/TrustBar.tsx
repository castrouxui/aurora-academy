"use client";

import { Container } from "./Container";
import { Users, CreditCard, ShieldCheck } from "lucide-react";

export function TrustBar() {
    const items = [
        {
            icon: <Users size={16} className="text-[#5D5CDE]" />,
            text: "+1000 Alumnos"
        },
        {
            icon: <CreditCard size={16} className="text-[#5D5CDE]" />,
            text: "4 Cuotas Sin Interés"
        },
        {
            icon: <ShieldCheck size={16} className="text-[#5D5CDE]" />,
            text: "Garantía de Satisfacción 24hs"
        }
    ];

    return (
        <div className="w-full bg-[#0B0F19] border-y border-white/5 py-4 md:py-6">
            <Container>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 lg:gap-20">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 group transition-all duration-300">
                            <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-[#5D5CDE]/30 group-hover:bg-[#5D5CDE]/5 transition-colors">
                                {item.icon}
                            </div>
                            <span className="text-sm md:text-base font-medium text-gray-400 group-hover:text-white transition-colors tracking-tight">
                                {item.text}
                            </span>
                            {index < items.length - 1 && (
                                <div className="hidden md:block h-4 w-px bg-white/10 ml-8 lg:ml-12" />
                            )}
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}
