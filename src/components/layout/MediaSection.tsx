"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { MediaModal } from "./MediaModal";

interface MediaItem {
    id: number;
    name: string;
    url: string;
    imageUrl?: string;
    keepOriginal?: boolean;
}

const MEDIA_ITEMS: MediaItem[] = [
    {
        id: 1,
        name: "La Capital",
        url: "https://www.lacapital.com.ar/economia/los-inversores-ponen-fichas-los-bancos-y-las-energeticas-n1533425.html",
        imageUrl: "/logos/lacapital.svg"
    },
    {
        id: 2,
        name: "Clarín",
        url: "https://www.clarin.com/economia/acciones-impulsaran-nuevo-bolsa-ano_0_S1TWMmt7f.html",
        // imageUrl: "https://www.clarin.com/img/Clarin_logotag.png"
    },
    {
        id: 3,
        name: "Puntal",
        url: "https://www.puntal.com.ar/la-bolsa-cayo-83-arrastrada-las-companias-energeticas-y-los-bancos-n12860",
        // imageUrl: "https://www.puntal.com.ar/assets/img/270/logo.svg"
    },
    {
        id: 4,
        name: "Ámbito",
        url: "https://www.ambito.com/economia/ypf/los-adrs-argentinos-cotizan-peor-que-antes-del-acuerdo-n5125634",
        // imageUrl: "https://framerusercontent.com/images/ps358zmTTaElane2Q4iCcme0M.png"
    },
    {
        id: 5,
        name: "BAE Negocios",
        url: "https://www.baenegocios.com/personas/Francisco-Castro-0",
        // imageUrl: "https://assets.baenegocios.com/__export/1506700689000/sites/cronica/arte/diariobae/logos/LogoBAE.svg"
    },
    {
        id: 6,
        name: "Perfil",
        url: "https://www.perfil.com/noticias/economia/dolar-en-alza-los-factores-politicos-y-economicos-que-inciden-en-la-suba-del-blue.phtml",
        imageUrl: "/logos/perfil.png"
    },
    {
        id: 7,
        name: "Diario de Cuyo",
        url: "https://www.diariodecuyo.com.ar/argentina/El-Merval-espera-el-impulso-del-sector-energetico-20180101-0091.html",
        imageUrl: "/logos/diariodecuyo_custom.png",
        keepOriginal: true
    },
    {
        id: 8,
        name: "YouTube",
        url: "https://www.youtube.com/watch?v=SqX-AdWFXmA",
        imageUrl: "/logos/youtube_custom.png",
        keepOriginal: true
    },
];

export function MediaSection() {
    const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleItemClick = (e: React.MouseEvent, item: MediaItem) => {
        // Check if we are on desktop (md breakpoint is usually 768px)
        if (window.innerWidth >= 768) {
            e.preventDefault();
            setSelectedItem(item);
            setIsModalOpen(true);
        }
    };

    return (
        <section className="py-24 bg-[#0B0F19]">
            <Container>
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Nosotros en los medios
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Francisco Castro ha sido consultado por diversos medios de comunicación sobre la actualidad económica y bursátil del país.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {MEDIA_ITEMS.map((item) => (
                        <Link
                            key={item.id}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => handleItemClick(e, item)}
                            className="group relative flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                        >
                            <div className="h-16 w-full relative flex items-center justify-center mb-4">
                                {item.imageUrl ? (
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className={`object-contain transition-all duration-300 ${item.keepOriginal
                                            ? "opacity-40 group-hover:opacity-100"
                                            : "filter brightness-0 invert opacity-40 group-hover:opacity-100"
                                            }`}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                ) : (
                                    <span className="text-xl font-bold text-gray-400 group-hover:text-white transition-colors">
                                        {item.name}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span>Leer nota</span>
                                <ExternalLink size={14} />
                            </div>
                        </Link>
                    ))}
                </div>
            </Container>

            <MediaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={selectedItem}
            />
        </section>
    );
}
