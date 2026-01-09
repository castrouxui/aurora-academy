"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

interface MediaItem {
    id: number;
    name: string;
    url: string;
    imageUrl?: string;
    keepOriginal?: boolean;
}

interface MediaModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: MediaItem | null;
}

export function MediaModal({ isOpen, onClose, item }: MediaModalProps) {
    if (!item) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-[#1F2937] border-gray-800 text-white">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold mb-4">
                        Mención en {item.name}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center space-y-8 py-4">
                    <div className="relative h-24 w-full bg-white/5 rounded-xl p-4 flex items-center justify-center">
                        {item.imageUrl ? (
                            <Image
                                src={item.imageUrl}
                                alt={item.name}
                                className={`object-contain ${item.keepOriginal ? "" : "filter brightness-0 invert"}`}
                                fill
                                sizes="200px"
                            />
                        ) : (
                            <span className="text-2xl font-bold">{item.name}</span>
                        )}
                    </div>

                    <p className="text-center text-gray-300">
                        Has sido redirigido a la nota original en el sitio de <strong>{item.name}</strong>.
                    </p>

                    <div className="flex gap-4 w-full">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                        >
                            Cerrar
                        </Button>
                        <Button
                            className="flex-1 bg-primary text-black hover:bg-primary/90 font-bold"
                            onClick={() => window.open(item.url, '_blank')}
                        >
                            Leer Nota <ExternalLink size={16} className="ml-2" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
