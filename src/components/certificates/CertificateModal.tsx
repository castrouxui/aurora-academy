"use client";

import { useRef, useState } from "react";
import { X, Award, Download, Linkedin, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";
import html2canvas from "html2canvas";

interface CertificateModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseName: string;
    studentName: string;
    date: string;
}

type CertificateFormat = 'landscape' | 'portrait' | 'social';

export function CertificateModal({ isOpen, onClose, courseName, studentName, date }: CertificateModalProps) {
    const certificateRef = useRef<HTMLDivElement>(null);
    const [format, setFormat] = useState<CertificateFormat>('landscape');
    const [isGenerating, setIsGenerating] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

    // Explicit Styles to avoid variable parsing issues
    const goldColor = "#D4AF37";
    const darkBg = "#1a1f2e";
    const white = "#ffffff";
    const gray300 = "#d1d5db";
    const gray400 = "#9ca3af";
    const gray500 = "#6b7280";

    const generateImageBlob = async (scale = 2): Promise<Blob | null> => {
        if (!certificateRef.current) return null;
        try {
            const canvas = await html2canvas(certificateRef.current, {
                scale: scale,
                backgroundColor: "#1a1f2e",
                logging: false,
                useCORS: true,
                allowTaint: true,
            });
            return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        } catch (error) {
            console.error(`Image generation failed at scale ${scale}:`, error);
            // Fallback for low memory devices
            if (scale > 1) {
                console.log("Retrying with lower resolution...");
                return generateImageBlob(1);
            }
            return null;
        }
    };

    const handleDownloadImage = async () => {
        setIsGenerating(true);
        try {
            const blob = await generateImageBlob();
            if (!blob) throw new Error("Failed to generate image");

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Certificado-${courseName.replace(/\s+/g, '-')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setFeedbackMessage("¡Imagen descargada!");
            setTimeout(() => setFeedbackMessage(null), 3000);
        } catch (error) {
            console.error("Download failed:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSocialShare = async (platform: 'linkedin' | 'twitter') => {
        if (navigator.share) {
            setIsGenerating(true);
            try {
                const blob = await generateImageBlob();
                if (blob) {
                    const file = new File([blob], "certificado-aurora.png", { type: "image/png" });
                    const shareData = {
                        title: 'Mi Certificado en Aurora Academy',
                        text: `¡Acabo de completar el curso "${courseName}" en Aurora Academy! 🚀`,
                        files: [file],
                        url: window.location.origin
                    };

                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        await navigator.share(shareData);
                        return;
                    }
                }
            } catch (error) {
                console.log("Native share failed");
            } finally {
                setIsGenerating(false);
            }
        }

        const text = `¡Acabo de completar el curso "${courseName}" en Aurora Academy! 🚀 
Aprende a invertir tú también en: ${window.location.origin}`;

        let url = '';
        if (platform === 'twitter') {
            url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        } else if (platform === 'linkedin') {
            url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
        }

        window.open(url, '_blank', 'noopener,noreferrer');
    };

    if (!isOpen) return null;

    // Dimensions
    const dimensions = {
        landscape: { width: 1000, height: 707 },
        portrait: { width: 707, height: 1000 },
        social: { width: 800, height: 1000 },
    };

    const currentDim = dimensions[format];

    // Typographic & Layout Configuration
    const styles = {
        landscape: {
            padding: "p-16",
            logoScale: "scale-[1.3] mb-8",
            titleSize: "text-5xl",
            labelSize: "text-2xl",
            studentSize: "text-5xl",
            courseSize: "text-3xl",
            signatureSize: "text-3xl",
            footerMargin: "mb-4",
            footerPadding: "px-8 pt-6",
            watermarkSize: "w-[70%] h-[70%]"
        },
        portrait: {
            padding: "p-12",
            logoScale: "scale-[1.1] mb-6",
            titleSize: "text-4xl",
            labelSize: "text-xl",
            studentSize: "text-4xl",
            courseSize: "text-2xl",
            signatureSize: "text-2xl",
            footerMargin: "mb-8",
            footerPadding: "px-4 pt-12",
            watermarkSize: "w-[90%] h-[90%]"
        },
        social: {
            padding: "p-10",
            logoScale: "scale-[1.0] mb-4",
            titleSize: "text-3xl",
            labelSize: "text-lg",
            studentSize: "text-3xl",
            courseSize: "text-xl",
            signatureSize: "text-xl",
            footerMargin: "mb-4",
            footerPadding: "px-2 pt-8",
            watermarkSize: "w-[85%] h-[85%]"
        }
    };

    const s = styles[format];
    const previewScaleClass = "scale-[0.32] min-[400px]:scale-[0.4] sm:scale-[0.55] md:scale-[0.7] lg:scale-[0.85] xl:scale-[0.8]";

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200 font-sans overflow-hidden">

            {/* Header Controls */}
            <div className="z-50 w-full px-4 py-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 bg-gradient-to-b from-black/80 to-transparent sticky top-0 shrink-0">
                <div className="hidden sm:block w-8"></div>

                <div className="flex items-center gap-2 bg-[#1F2937] p-1.5 rounded-full border border-gray-700 overflow-x-auto no-scrollbar max-w-full shadow-lg">
                    <button
                        onClick={() => setFormat('landscape')}
                        className={cn("px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap", format === 'landscape' ? "bg-primary text-white" : "text-gray-400 hover:text-white")}
                    >
                        Horizontal
                    </button>
                    <button
                        onClick={() => setFormat('portrait')}
                        className={cn("px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap", format === 'portrait' ? "bg-primary text-white" : "text-gray-400 hover:text-white")}
                    >
                        Vertical
                    </button>
                    <button
                        onClick={() => setFormat('social')}
                        className={cn("px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap", format === 'social' ? "bg-primary text-white" : "text-gray-400 hover:text-white")}
                    >
                        Redes (4:5)
                    </button>
                </div>

                <div className="absolute right-4 top-4 sm:static">
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 shrink-0 transition-colors">
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 w-full overflow-auto flex items-center justify-center relative p-4 scrollbar-hide py-12">
                <div className={cn("transition-transform duration-300 origin-center shrink-0", previewScaleClass)}>
                    <div
                        ref={certificateRef}
                        style={{
                            width: currentDim.width,
                            height: currentDim.height,
                            backgroundColor: "#0F1115", // Darker, cleaner background
                            backgroundImage: "radial-gradient(circle at center, #1a1f2e 0%, #0F1115 100%)",
                            color: white
                        }}
                        className={cn(
                            "relative shadow-2xl text-center flex flex-col items-center justify-between select-none font-sans shrink-0",
                            s.padding
                        )}
                    >
                        {/* Elegant Border */}
                        <div className="absolute inset-4 border border-[#D4AF37]/30 pointer-events-none" />
                        <div className="absolute inset-6 border border-[#D4AF37]/10 pointer-events-none" />

                        {/* Corner Accents */}
                        <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-[#D4AF37] pointer-events-none" />
                        <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-[#D4AF37] pointer-events-none" />
                        <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-[#D4AF37] pointer-events-none" />
                        <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-[#D4AF37] pointer-events-none" />


                        {/* Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                            <Logo />
                        </div>

                        <div className="relative z-10 flex flex-col items-center justify-between h-full w-full">
                            {/* Header */}
                            <div className="flex flex-col items-center w-full mt-8 flex-grow justify-start pt-10">
                                <div className={cn("origin-center mb-12", s.logoScale)}>
                                    <Logo />
                                </div>

                                <h2 style={{ color: "#D4AF37", fontFamily: "Playfair Display, serif" }} className={cn("mb-4 uppercase tracking-[0.2em] leading-none font-medium", s.titleSize)}>
                                    Certificado de Excelencia
                                </h2>

                                <p style={{ color: "#9ca3af" }} className={cn("font-light tracking-wide mb-8 text-sm uppercase", s.labelSize)}>
                                    Este documento certifica que
                                </p>

                                <h3 style={{ color: "#ffffff", fontFamily: "Playfair Display, serif" }} className={cn(
                                    "font-normal mb-8 pb-8 border-b border-[#D4AF37]/30 inline-block px-12 italic",
                                    s.studentSize
                                )}>
                                    {studentName}
                                </h3>

                                <p style={{ color: "#9ca3af" }} className={cn("font-light tracking-wide mb-6 text-sm uppercase", s.labelSize)}>
                                    Ha completado exitosamente el programa de
                                </p>

                                <h4 style={{ color: "#ffffff" }} className={cn("font-bold max-w-4xl leading-snug mb-4 px-4 uppercase tracking-wider", s.courseSize)}>
                                    {courseName}
                                </h4>
                            </div>

                            {/* Footer Content */}
                            <div className={cn(
                                "flex w-full justify-between items-end w-full pb-12 px-12",
                                s.footerMargin
                            )}>
                                <div className="text-center w-64">
                                    <div className="flex flex-col items-center justify-end h-auto mb-4">
                                        {/* Signature Image or Font */}
                                        <p style={{ color: "#D4AF37", fontFamily: "cursive" }} className={cn("text-2xl whitespace-nowrap mb-2")}>Francisco Castro</p>
                                    </div>
                                    <div className="h-px w-full bg-[#D4AF37]/30 mx-auto"></div>
                                    <p style={{ color: "#6b7280" }} className="mt-3 text-[10px] uppercase tracking-[0.2em] font-medium">
                                        CEO & Founder
                                    </p>
                                </div>

                                <div className="shrink-0 px-4 pb-2 opacity-80">
                                    {/* Seal */}
                                    <div className="w-24 h-24 rounded-full border-2 border-[#D4AF37] flex items-center justify-center relative">
                                        <div className="absolute inset-1 border border-[#D4AF37]/30 rounded-full" />
                                        <Award style={{ color: "#D4AF37" }} className="w-10 h-10" />
                                        <div className="absolute inset-0 rounded-full flex items-center justify-center">
                                            <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                                                <path id="curve" d="M 50 50 m -38 0 a 38 38 0 1 1 76 0 a 38 38 0 1 1 -76 0" fill="transparent" />
                                                <text width="500">
                                                    <textPath href="#curve" className="text-[10px] uppercase tracking-[0.18em] fill-[#D4AF37]">
                                                        Aurora Academy • Aurora Academy •
                                                    </textPath>
                                                </text>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center w-64">
                                    <div className="flex flex-col items-center justify-end h-auto mb-4">
                                        <p style={{ color: "#ffffff" }} className="text-xl font-light">{date}</p>
                                    </div>
                                    <div className="h-px w-full bg-[#D4AF37]/30 mx-auto"></div>
                                    <p style={{ color: "#6b7280" }} className="mt-3 text-[10px] uppercase tracking-[0.2em] font-medium">
                                        Fecha de Emisión
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="w-full bg-[#0B0F19]/90 backdrop-blur-md border-t border-gray-800 p-4 z-50 shrink-0">
                <div className="flex gap-4 flex-wrap justify-center items-center max-w-4xl mx-auto">
                    <Button
                        onClick={handleDownloadImage}
                        disabled={isGenerating}
                        className="gap-2 bg-[#D4AF37] text-black hover:bg-[#b5952f] font-bold min-w-[160px] font-sans h-12 text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                        {isGenerating ? (
                            <>Procesando...</>
                        ) : feedbackMessage ? (
                            <><CheckCircle2 className="text-green-800" /> {feedbackMessage}</>
                        ) : (
                            <>
                                <Download />
                                Descargar Imagen
                            </>
                        )}
                    </Button>

                    <div className="h-8 w-px bg-gray-700 mx-2 hidden sm:block"></div>

                    <div className="flex gap-3">
                        <Button
                            onClick={() => handleSocialShare('twitter')}
                            variant="outline"
                            size="icon"
                            disabled={isGenerating}
                            className="bg-transparent border-gray-600 text-gray-400 hover:bg-black hover:text-white hover:border-black w-12 h-12 rounded-full transition-all"
                            title="Compartir en X"
                        >
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </Button>
                        <Button
                            onClick={() => handleSocialShare('linkedin')}
                            variant="outline"
                            size="icon"
                            disabled={isGenerating}
                            className="bg-transparent border-gray-600 text-gray-400 hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] w-12 h-12 rounded-full transition-all"
                            title="Compartir en LinkedIn"
                        >
                            <Linkedin size={22} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
