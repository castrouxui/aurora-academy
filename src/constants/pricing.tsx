import React from "react";

// Fallback estático usado cuando la DB local no tiene bundles.
// En producción se calcula dinámicamente desde los precios reales.
export const PLAN_COURSE_VALUES_FALLBACK = [235_000, 800_000, 1_740_000];

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
            "Acceso a Canal de Aurora Academy"
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
            <span key="new-course" className="inline-flex items-center gap-2 font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                <span>🔥</span> 1 curso nuevo cada 15 días
            </span>,
            "Curso de Opciones Financieras",
            "Domina el Stop Loss en 15 minutos",
            "Análisis Técnico & Price Action",
            "Futuros Financieros",
            "Acceso a Canal de Aurora Academy"
        ],
        excludedFeatures: [],
        tag: "EL MÁS BUSCADO",
        isRecommended: true
    },
    {
        // 3. Portfolio Manager
        title: "Portfolio Manager",
        price: "$149.900",
        description: "La experiencia completa con networking profesional.",
        features: [
            "Todo lo del Plan Trader de Elite",
            <span key="new-course-pm" className="inline-flex items-center gap-2 font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                <span>🔥</span> 1 curso nuevo cada 15 días
            </span>,
            "Curso de IA para Inversores",
            "Análisis Fundamental & Cartera",
            "Dominando el Riesgo: Volatilidad",
            "Valuación Real: Beneficio vs. Caja",
            "Acceso a Canal de Aurora Academy"
        ],
        tag: null,
        isRecommended: false
    }
];
