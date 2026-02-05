"use client";

import { Container } from "./Container";
import { Users, CreditCard, ShieldCheck } from "lucide-react";

export function TrustBar() {
    const items = [
        {
            icon: <Users size={16} strokeWidth={1} className="text-gray-400" />,
            text: "+1000 Alumnos"
        },
        {
            icon: <CreditCard size={16} strokeWidth={1} className="text-gray-400" />,
            text: "4 Cuotas Fijas Sin Interés"
        },
        {
            icon: <ShieldCheck size={16} strokeWidth={1} className="text-gray-400" />,
            text: "Garantía 24hs"
        }
    ];

    return (
        <div className="w-full bg-[#0B0F19] border-y border-white/5 py-3 md:py-4">
            <Container>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 lg:gap-16">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 group transition-all duration-300">
                            <div className="shrink-0 transition-colors">
                                {item.icon}
                            </div>
                            <span className="text-xs md:text-sm font-medium text-gray-500 group-hover:text-white transition-colors tracking-tight uppercase">
                                [{item.text}]
                            </span>
                            {index < items.length - 1 && (
                                <div className="hidden md:block h-3 w-px bg-white/10 ml-8 lg:ml-12" />
                            )}
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}
