"use client";

import { Container } from "../layout/Container";
import Image from "next/image";

const propFirms = [
    { name: "FTMO", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/FTMO_logo.svg?20240927150146" },
    { name: "Binance", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/Binance_logo.svg" },
    { name: "Bybit", logo: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Bybit_logo.svg?20230225134606" },
    { name: "MyForexFunds", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Forex_logo.png" }, // Placeholder, usually text or distinct logo. We use a placeholder concept.
    { name: "FundingPips", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Y_Combinator_logo.svg" }, // Placeholder
];

export function SocialProofSection() {
    return (
        <section className="py-16 md:py-24 bg-background border-y border-border/50 relative overflow-hidden">
            <Container>
                <div className="flex flex-col items-center justify-center text-center space-y-8">
                    <p className="text-sm md:text-base font-bold text-muted-foreground uppercase tracking-widest font-display">
                        Nuestros alumnos operan y gestionan capital en
                    </p>

                    {/* Logos Marquee / Grid */}
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {propFirms.map((firm, idx) => (
                            <div key={idx} className="relative w-24 h-8 md:w-32 md:h-10 hover:opacity-100 transition-opacity">
                                <Image
                                    src={firm.logo}
                                    alt={`Logo de ${firm.name}`}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}
