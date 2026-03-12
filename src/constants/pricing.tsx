import React from "react";

export const PLANS = [
    {
        // 1. Inversor Inicial
        title: "Inversor Inicial",
        price: "54900",
        description: "Ideal para dar tus primeros pasos. El escalón de entrada para dominar los conceptos base.",
        features: [
            "Los 7 Pilares del Éxito en Bolsa",
            "El camino del inversor",
            "Finanzas Personales",
            "Introducción al Mercado de Capitales",
            "TNA, TEA y el Verdadero Rendimiento (TIR)",
            "Manejo de TradingView",
            "Acceso al Canal de Aurora Academy",
        ],
        excludedFeatures: [
            "1 nuevo curso cada 15 días",
            "Comunidad VIP en Telegram",
            "Mentorías personalizadas",
        ],
        tag: null,
        isRecommended: false
    },
    {
        // 2. Trader de Elite
        title: "Trader de Elite",
        price: "89900",
        description: "Para traders que buscan consistencia. Operá activamente con actualización constante.",
        features: [
            "1 nuevo curso cada 15 días",
            "Fondos Comunes de Inversión",
            "Opciones Financieras",
            "Domina el Stop Loss en 15 minutos",
            "Price Action",
            "Arbitraje Estadístico y Precisión con VWAP",
            "Análisis Técnico",
            "Renta Fija",
            "Futuros Financieros",
            "Valuación de Bonos: TIR, Paridad y Escenarios de Salida",
        ],
        excludedFeatures: [],
        tag: "El más elegido",
        isRecommended: true
    },
    {
        // 3. Portfolio Manager
        title: "Portfolio Manager",
        price: "149900",
        description: "La experiencia definitiva para profesionales. Networking de alto nivel y visión macro.",
        features: [
            "1 nuevo curso cada 15 días",
            "Machine Learning e IA",
            "Mentoría Análisis Técnico",
            "Mentoría Gestión de Cartera",
            "Análisis Fundamental",
            "Beneficio vs. Caja: Valuación Real",
            "IA en Inversiones",
            "Dominando el Riesgo: De la Volatilidad a la Estabilidad",
            "Testing con IA",
        ],
        excludedFeatures: [],
        tag: null,
        isRecommended: false
    }
];
