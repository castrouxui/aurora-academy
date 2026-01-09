"use client";

import { X, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface CertificateModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentName: string;
    courseName: string;
    date: string;
}

export function CertificateModal({ isOpen, onClose, studentName, courseName, date }: CertificateModalProps) {
    const certificateRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    const handleDownload = () => {
        // Mock download functionality
        alert("Descarga de certificado simulada. En producción se generaría un PDF.");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl bg-white text-black text-center p-2 rounded-xl shadow-2xl overflow-hidden">
                {/* Controls */}
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-gray-200 rounded-full">
                        <X size={24} className="text-gray-600" />
                    </Button>
                </div>

                {/* Certificate Content */}
                <div ref={certificateRef} className="p-12 border-[20px] border-[#1F2937] h-full flex flex-col items-center justify-center bg-[#fdfbf7] relative">
                    {/* Background Pattern Mock */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                    />

                    <div className="mb-8">
                        <h2 className="text-5xl font-serif font-bold text-[#1F2937] mb-2 uppercase tracking-wider">Certificado</h2>
                        <p className="text-xl text-gray-500 uppercase tracking-[0.2em]">de Finalización</p>
                    </div>

                    <div className="my-8 w-full max-w-2xl">
                        <p className="text-lg text-gray-600 italic mb-4">Este documento certifica que</p>
                        <h3 className="text-4xl font-bold text-[#1F2937] border-b-2 border-gray-300 pb-4 mb-6 font-serif">
                            {studentName}
                        </h3>
                        <p className="text-lg text-gray-600 italic mb-2">ha completado satisfactoriamente el curso</p>
                        <h4 className="text-2xl font-bold text-primary mb-8">
                            {courseName}
                        </h4>
                    </div>

                    <div className="flex justify-between w-full max-w-3xl mt-12 px-12">
                        <div className="text-center">
                            <div className="w-40 border-b border-gray-400 mb-2"></div>
                            <p className="text-sm font-bold text-gray-700">Aurora Academy</p>
                            <p className="text-xs text-gray-500">Institución</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold text-[#1F2937]">{date}</p>
                            <div className="w-40 border-b border-gray-400 mt-2"></div>
                            <p className="text-xs text-gray-500 mt-2">Fecha de Emisión</p>
                        </div>
                    </div>

                    <div className="absolute bottom-4 left-0 right-0 text-center">
                        <p className="text-[10px] text-gray-400">ID de Certificado: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-gray-100 p-4 flex justify-center gap-4 border-t border-gray-200">
                    <Button onClick={handleDownload} className="bg-[#1F2937] hover:bg-[#374151] text-white">
                        <Download size={18} className="mr-2" /> Descargar PDF
                    </Button>
                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-white">
                        <Share2 size={18} className="mr-2" /> Compartir
                    </Button>
                </div>
            </div>
        </div>
    );
}
