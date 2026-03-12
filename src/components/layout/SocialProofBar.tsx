"use client";

import { useState, useEffect } from "react";
import { Container } from "./Container";
import { Users, ShieldCheck, CreditCard } from "lucide-react";
import { getRegisteredUserCount } from "@/actions/user";

export function SocialProofBar() {
    const [userCount, setUserCount] = useState<number | null>(null);

    useEffect(() => {
        getRegisteredUserCount().then(count => {
            setUserCount(count);
        });
    }, []);

    const items = [
        {
            icon: <Users size={18} className="text-primary" />,
            text: `+${userCount !== null ? userCount : "..."} estudiantes activos`,
        },
        {
            icon: <ShieldCheck size={18} className="text-primary" />,
            text: "Garantía 7 días",
        },
        {
            icon: <CreditCard size={18} className="text-primary" />,
            text: "Hasta 6 cuotas sin interés",
        },
    ];

    return (
        <div className="w-full py-5 border-y border-border/50">
            <Container>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2.5">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                {item.icon}
                            </div>
                            <span className="text-sm font-normal text-text-secondary">
                                {item.text}
                            </span>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}
