"use client";

import { useMemo } from "react";
import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
        // Simple logic to pick a quote based on the current week number
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        const oneDay = 1000 * 60 * 60 * 24;
        const day = Math.floor(diff / oneDay);
        const week = Math.floor(day / 7);

        return QUOTES[week % QUOTES.length];
    }, []);

    return (
        <Card className="bg-gradient-to-r from-blue-900/20 to-[#5D5CDE]/10 border-[#5D5CDE]/20 mb-6">
            <CardContent className="p-4 flex items-start gap-3">
                <Quote className="text-[#5D5CDE] h-5 w-5 shrink-0 mt-1 opacity-80" />
                <div className="space-y-1">
                    <p className="text-gray-200 text-sm font-medium italic">
                        "{quote.text}"
                    </p>
                    <p className="text-[#5D5CDE] text-xs font-bold">
                        — {quote.author}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
