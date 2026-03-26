"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { getRegisteredUserCount } from "@/actions/user";

export function ExitIntentModal() {
    const pathname = usePathname();
    const isMembershipsPage = pathname === "/membresias";

    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [hasTriggered, setHasTriggered] = useState(false);
    const [userCount, setUserCount] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        getRegisteredUserCount().then(count => setUserCount(count));
    }, []);

    // 3 days cooldown
    const COOLDOWN_DAYS = 3;
    const STORAGE_KEY = "aurora_exit_intent_seen";

    const checkShouldShow = useCallback(() => {
        // If already open or triggered in this session, don't show again immediatey unless logic allows (here we block re-trigger)
        if (hasTriggered) return false;

        // Check localStorage persistence
        const lastSeen = localStorage.getItem(STORAGE_KEY);
        if (!lastSeen) return true;

        const lastSeenDate = new Date(parseInt(lastSeen));
        const now = new Date();
        // Calculate difference in days
        const diffTime = Math.abs(now.getTime() - lastSeenDate.getTime());
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        return diffDays > COOLDOWN_DAYS;
    }, [hasTriggered, COOLDOWN_DAYS, STORAGE_KEY]);

    const showModal = useCallback(() => {
        if (checkShouldShow()) {
            setIsVisible(true);
            setHasTriggered(true);
        }
    }, [checkShouldShow]);

    const handleCopy = () => {
        navigator.clipboard.writeText("LANZAMIENTO10");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClose = () => {
        setIsVisible(false);
        // Set cooldown when user manually closes
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
    };

    useEffect(() => {
        // Only run on client side
        if (typeof window === "undefined") return;

        // Desktop Trigger: Mouse Leave Viewport
        const handleMouseLeave = (e: MouseEvent) => {
            // e.clientY <= 0 means mouse left from the top of the browser window
            if (e.clientY <= 0) {
                showModal();
            }
        };

        // Mobile Trigger: Scroll Depth
        const handleScroll = () => {
            const scrollPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
            // Trigger if scrolled > 90%
            if (scrollPercentage > 0.9) {
                showModal();
                // Remove this listener to prevent repeated checks if desired, but checkShouldShow handles logic
            }
        };

        // Mobile Trigger: Inactivity Timer (20s)
        let timerId: NodeJS.Timeout;

        // Check device type roughly
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

        if (isMobile) {
            window.addEventListener("scroll", handleScroll);
            timerId = setTimeout(() => {
                showModal();
            }, 20000); // 20 seconds
        } else {
            document.addEventListener("mouseleave", handleMouseLeave);
        }

        return () => {
            document.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("scroll", handleScroll);
            if (timerId) clearTimeout(timerId);
        };
    }, [showModal]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");

        try {
            const res = await fetch("/api/capture-lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setStatus("success");
                // Set cooldown on success
                localStorage.setItem(STORAGE_KEY, Date.now().toString());

                // Auto close after success message
                setTimeout(() => {
                    setIsVisible(false);
                    setStatus("idle");
                    setEmail("");
                }, 3000);
            } else {
                setStatus("error");
            }
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
                    {/* Backdrop Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="relative w-full max-w-[480px] overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F19] p-6 sm:p-8 shadow-2xl shadow-purple-500/10"
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute right-4 top-4 p-1 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* ── Memberships page: discount CTA ── */}
                        {isMembershipsPage ? (
                            <div className="text-center space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                                    <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Oferta exclusiva</span>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                                    Antes de irte — 10% OFF en tu primer mes
                                </h2>
                                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                                    Válido para membresías mensuales, cursos, mentorías y micro-cursos. <span className="text-gray-500">No aplica en planes anuales.</span>
                                </p>
                                {/* Cupón destacado */}
                                <button
                                    onClick={handleCopy}
                                    className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-xl py-3 px-4 flex items-center justify-between gap-3 transition-colors group"
                                >
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">Tu cupón — tocá para copiar</p>
                                        <p className="text-lg font-black text-white font-mono tracking-widest">LANZAMIENTO10</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-lg px-3 py-2 text-center">
                                            <p className="text-emerald-400 font-black text-xl leading-none">10%</p>
                                            <p className="text-emerald-500 text-[10px] font-bold">OFF</p>
                                        </div>
                                        <div className="text-gray-500 group-hover:text-gray-300 transition-colors">
                                            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                                        </div>
                                    </div>
                                </button>
                                {copied && (
                                    <p className="text-center text-xs text-emerald-400 font-semibold animate-in fade-in duration-200">
                                        ¡Cupón copiado!
                                    </p>
                                )}
                                <div className="space-y-2 pt-1">
                                    <Link href="/membresias?billing=monthly#precios" onClick={handleClose} className="block">
                                        <Button className="w-full h-12 text-sm sm:text-base font-black bg-[#5D5CDE] hover:bg-[#4b4ac0] text-white shadow-lg shadow-purple-500/25 active:scale-95 transition-all">
                                            Quiero mi 10% off →
                                        </Button>
                                    </Link>
                                    <button onClick={handleClose} className="text-xs text-gray-600 hover:text-gray-500 transition-colors w-full py-1">
                                        No gracias, prefiero pagar precio completo
                                    </button>
                                </div>
                                <p className="text-xs text-gray-600">🛡️ Garantía de 7 días — sin riesgo</p>
                            </div>
                        ) : status === "success" ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
                                <div className="mb-6 rounded-full bg-green-500/10 p-4 text-green-500">
                                    <CheckCircle className="h-12 w-12" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">¡Felicitaciones!</h3>
                                <p className="text-gray-400">
                                    Revisá tu bandeja de entrada. El acceso a <strong>"El camino del inversor"</strong> ya está en camino.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-3 mb-8 text-center sm:text-left">
                                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                                        ¿Todavía no estás listo para dar el paso?
                                    </h2>
                                    <p className="text-gray-400 text-base leading-relaxed">
                                        No te vayas con las manos vacías. Unite a los <span className="text-purple-400 font-semibold">+{userCount !== null ? userCount : '...'} alumnos</span> que ya están transformando su relación con el dinero.
                                    </p>
                                    <p className="text-white font-medium bg-white/5 p-3 rounded-lg border border-white/5 inline-block w-full text-center sm:text-left">
                                        🎁 Accedé gratis a "El camino del inversor"
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Input
                                            type="email"
                                            placeholder="Tu mejor email..."
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={status === "loading"}
                                            className="h-12 border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20 text-base"
                                        />
                                    </div>

                                    {status === "error" && (
                                        <p className="text-sm text-red-500 text-center bg-red-500/10 p-2 rounded">
                                            Algo salió mal. Por favor intentá nuevamente.
                                        </p>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="w-full h-12 text-base font-medium bg-[#5D5CDE] hover:bg-[#4b4ac0] text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.02] active:scale-95"
                                    >
                                        {status === "loading" ? (
                                            <div className="flex items-center gap-2 justify-center">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                                                <span>Procesando...</span>
                                            </div>
                                        ) : (
                                            "Quiero mi acceso gratuito"
                                        )}
                                    </Button>

                                    <p className="text-xs text-center text-gray-500 mt-4">
                                        🔒 Tus datos están 100% seguros y libres de spam.
                                    </p>
                                </form>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
