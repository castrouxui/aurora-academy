import React from "react";

export const PLANS = [
    {
        // 1. Inversor Inicial
        title: "Inversor Inicial",
        price: "$54.900",
        description: "El escalón de entrada para dominar los conceptos base.",
        features: [
            "Introducción al Mercado de Capitales",
            "Renta Fija / Bonos",
            "Valuación de Bonos: TIR, Paridad",
            "Valor Tiempo del Dinero: TNA, TEA"
        ],
        excludedFeatures: [
            "Acceso a Comunidad de Inversores",
            "Acceso al Canal de Aurora Academy"
        ],
        tag: null,
        isRecommended: false
    },
    {
        // 2. Trader de Elite
        title: "Trader de Elite",
        price: "$89.900",
        description: "Para quienes operan activamente y buscan actualización constante.",
        features: [
            "Todo lo del Plan Inversor Inicial",
            <span key="new-course" className="inline-flex items-center gap-2 font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                <span>🔥</span> 1 curso nuevo cada 15 días
            </span>,
            "Curso de Opciones Financieras",
            "Domina el Stop Loss en 15 minutos",
            "Análisis Técnico & Price Action",
            "Futuros Financieros",
            "Acceso al Canal de Aurora Academy"
        ],
        excludedFeatures: [
            "Acceso a Comunidad de Inversores"
        ],
        tag: "EL MÁS BUSCADO",
        isRecommended: true
    },
    {
        // 3. Portfolio Manager
        title: "Portfolio Manager",
        price: "$149.900",
        description: "La experiencia completa con networking profesional y acceso exclusivo a la comunidad de inversores.",
        features: [
            "Todo lo del Plan Trader de Elite",
            <span key="new-course-pm" className="inline-flex items-center gap-2 font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                <span>🔥</span> 1 curso nuevo cada 15 días
            </span>,
            "Curso de IA para Inversores",
            "Análisis Fundamental & Cartera",
            "Dominando el Riesgo: Volatilidad",
            "Valuación Real: Beneficio vs. Caja",
            "Acceso al Canal de Aurora Academy"
        ],
        tag: null,
        isRecommended: false,
        // Special highlight for High Ticket
        specialFeature: {
            title: "Acceso a Comunidad de Inversores",
            description: "Networking profesional con otros inversores."
        }
    }
];
