"use client";

import { useState, useEffect } from "react";
import { Container } from "./Container";
import { Users, CreditCard, ShieldCheck } from "lucide-react";
import { getRegisteredUserCount } from "@/actions/user";

export function TrustBar() {
    const [userCount, setUserCount] = useState<number | null>(null);

    useEffect(() => {
        getRegisteredUserCount().then(setUserCount);
    }, []);

    const items = [
        { icon: <Users size={14} />, text: `+${userCount ?? '...'} Estudiantes Activos` },
        { icon: <CreditCard size={14} />, text: "3 Cuotas Sin Interés" },
        { icon: <ShieldCheck size={14} />, text: "Garantía 7 días" },
    ];

    return (
        <div className="border-y border-white/6 py-4 bg-[#0B0F19]">
            <Container>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
                    {items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-gray-500">
                            <span className="text-[#5D5CDE]">{item.icon}</span>
                            <span className="text-sm font-medium">{item.text}</span>
                            {i < items.length - 1 && <span className="hidden sm:block ml-10 w-px h-3 bg-white/10" />}
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}
