"use client";

import { useMemo } from "react";

const QUOTES = [
    { text: "El riesgo viene de no saber lo que estás haciendo.", author: "Warren Buffett" },
    { text: "No trabajes por dinero, haz que el dinero trabaje por ti.", author: "Robert Kiyosaki" },
    { text: "La inversión en conocimiento paga el mejor interés.", author: "Benjamin Franklin" },
    { text: "El mercado de valores es un mecanismo para transferir dinero del impaciente al paciente.", author: "Warren Buffett" },
    { text: "Cuidado con los pequeños gastos; un pequeño agujero hunde un barco.", author: "Benjamin Franklin" },
    { text: "El dinero es un buen sirviente pero un mal amo.", author: "Francis Bacon" },
    { text: "No ahorres lo que te queda después de gastar, gasta lo que te queda después de ahorrar.", author: "Warren Buffett" },
    { text: "La riqueza no consiste en tener grandes posesiones, sino en tener pocas necesidades.", author: "Epicteto" },
    { text: "Gana todo lo que puedas, ahorra todo lo que puedas, da todo lo que puedas.", author: "John Wesley" },
    { text: "El interés compuesto es la octava maravilla del mundo. Quien lo entiende, lo gana; quien no, lo paga.", author: "Albert Einstein" }
];

export function QuoteOfTheWeek() {
    const quote = useMemo(() => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        const oneDay = 1000 * 60 * 60 * 24;
        const day = Math.floor(diff / oneDay);
        const week = Math.floor(day / 7);

        return QUOTES[week % QUOTES.length];
    }, []);

    return (
        <div className="py-6 relative mb-6">
            <span className="absolute -top-2 -left-1 text-5xl text-[#5D5CDE]/15 font-serif select-none leading-none">"</span>
            <div className="pl-4 space-y-2">
                <p className="text-base font-light italic text-gray-300 leading-relaxed">
                    "{quote.text}"
                </p>
                <p className="text-sm font-medium text-[#5D5CDE]/60 tracking-wide">
                    — {quote.author}
                </p>
            </div>
        </div>
    );
}
