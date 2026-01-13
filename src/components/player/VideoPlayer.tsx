"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Play, Pause, Volume2, VolumeX, Loader2, Settings, Lock, AlertCircle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, getYouTubeId } from '@/lib/utils';


// Dynamic import to avoid SSR issues with ReactPlayer. 
// Using main entry point to ensure compatibility.
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;

interface VideoPlayerProps {
    url: string;
    thumbnail?: string;
    title?: string;
    isLocked: boolean;
    previewMode: boolean;
    courseId?: string;
    onComplete?: () => void;
    onPurchase?: () => void;
}

export function VideoPlayer({ url, thumbnail, title, isLocked, previewMode, courseId, onComplete, onPurchase }: VideoPlayerProps) {
    console.log('[VideoPlayer] Received URL:', url);
    const playerRef = useRef<any>(null); // ReactPlayer ref
    const [hasWindow, setHasWindow] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [duration, setDuration] = useState(0);
    const [progress, setProgress] = useState(0);

    const youtubeId = getYouTubeId(url);
    console.log('[VideoPlayer] Computed YouTube ID:', youtubeId);

    // Ensure client-side rendering
    useEffect(() => {
        setHasWindow(true);
    }, []);

    const handlePlay = () => {
        setIsPlaying(true);
    };

    const handleError = (e: any) => {
        console.error("Video Error:", e);
        setHasError(true);
        setIsLoading(false);
    };

    if (!hasWindow) return null;

    if (isLocked) {
        return (
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-gray-800 flex items-center justify-center">
                {thumbnail && (
                    <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${thumbnail})` }}></div>
                )}
                <div className="z-10 text-center p-4">
                    <Lock className="w-12 h-12 text-white/50 mx-auto mb-2" />
                    <p className="text-white font-bold">Contenido Bloqueado</p>
                    {onPurchase && (
                        <Button variant="link" onClick={onPurchase} className="text-[#5D5CDE] mt-2">
                            Desbloquear
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    if (youtubeId) {
        return (
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-gray-800 group">
                <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${isPlaying ? 1 : 0}&rel=0&modestbranding=1`}
                    title="YouTube video player"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    onLoad={() => setIsLoading(false)}
                />
                {!isPlaying && (
                    <div
                        className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 cursor-pointer"
                        onClick={handlePlay}
                    >
                        {thumbnail && (
                            <img src={thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
                        )}
                        <div className="w-16 h-16 rounded-full bg-[#5D5CDE] flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110">
                            <Play fill="currentColor" className="w-6 h-6 ml-1" />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden group border border-gray-800">
            {hasWindow && (
                <ReactPlayer
                    key={url}
                    ref={playerRef}
                    url={url}
                    width="100%"
                    height="100%"
                    playing={isPlaying}
                    onProgress={(state: any) => {
                        setProgress(state.played);
                    }}
                    config={{
                        // Cast config to any to avoid generic type issues if package types are mismatched
                        youtube: {
                            playerVars: {
                                showinfo: 0,
                                rel: 0,
                                modestbranding: 1
                            }
                        }
                    } as any}
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    playsinline={true}
                    onError={handleError}
                    onReady={() => {
                        setIsLoading(false);
                        if (playerRef.current) {
                            setDuration(playerRef.current.getDuration());
                        }
                    }}
                    onStart={() => setIsLoading(false)}
                />
            )}

            {/* Error Overlay */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-20">
                    <div className="text-center p-6">
                        <p className="text-red-400 font-bold mb-2">Error al cargar el video</p>
                        <p className="text-xs text-gray-500 max-w-[200px] mx-auto">
                            Verifica que el link sea válido y que el video no sea "Privado". Usa "No Listado" para YouTube.
                        </p>
                    </div>
                </div>
            )}

            {/* Loading Spinner */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/10">
                    <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}
