"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Play, Pause, Volume2, VolumeX, Loader2, Settings, Lock, AlertCircle, Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, getYouTubeId } from '@/lib/utils';
import { CustomControls } from "./CustomControls";


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
    const playerRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hasWindow, setHasWindow] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Playback State
    const [volume, setVolume] = useState(0.8);
    const [muted, setMuted] = useState(false);
    const [played, setPlayed] = useState(0); // 0 to 1
    const [playedSeconds, setPlayedSeconds] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        setHasWindow(true);
        // Timeout fallback for loading state
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, [url]);

    // Fullscreen change listener
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume);
        setMuted(newVolume === 0);
    };

    const handleToggleMute = () => {
        setMuted(!muted);
    };

    const handleSeekChange = (newPlayed: number) => {
        setPlayed(newPlayed / 100);
        // We don't seek immediately to avoid stuttering, only on mouse up
    };

    const handleSeekMouseDown = () => {
        setIsSeeking(true);
    };

    const handleSeekMouseUp = (newPlayed: number) => {
        setIsSeeking(false);
        playerRef.current?.seekTo(newPlayed / 100);
    };

    const handleToggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const handleProgress = (state: { played: number; playedSeconds: number }) => {
        // We only update progress if not seeking
        if (!isSeeking) {
            setPlayed(state.played);
            setPlayedSeconds(state.playedSeconds);
        }
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

    return (
        <div
            ref={containerRef}
            className="relative aspect-video bg-black rounded-lg overflow-hidden group border border-gray-800 select-none"
            onContextMenu={(e) => e.preventDefault()} // Block context menu
        >
            {/* Click Overlay to toggle play/pause */}
            <div
                className="absolute inset-0 z-10 cursor-pointer"
                onClick={handlePlayPause}
            >
                {/* Prevent context menu on overlay too */}
            </div>

            <div className="absolute inset-0 z-0">
                <ReactPlayer
                    key={url}
                    ref={playerRef}
                    url={url}
                    width="100%"
                    height="100%"
                    playing={isPlaying}
                    volume={volume}
                    muted={muted}
                    onProgress={handleProgress}
                    onDuration={setDuration}
                    config={{
                        youtube: {
                            playerVars: {
                                showinfo: 0,
                                controls: 0,
                                modestbranding: 1,
                                rel: 0,
                                disablekb: 1,
                                iv_load_policy: 3,
                                fs: 0
                            }
                        },
                        file: {
                            attributes: {
                                controlsList: 'nodownload',
                                disablePictureInPicture: true,
                            }
                        }
                    } as any}
                    playsinline={true}
                    onError={handleError}
                    onReady={() => setIsLoading(false)}
                    onStart={() => setIsLoading(false)}
                    onEnded={onComplete}
                />
            </div>

            {/* Custom Controls */}
            <CustomControls
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                volume={volume}
                onVolumeChange={handleVolumeChange}
                muted={muted}
                onToggleMute={handleToggleMute}
                played={played}
                onSeek={handleSeekChange}
                onSeekMouseDown={handleSeekMouseDown}
                onSeekMouseUp={handleSeekMouseUp}
                duration={duration}
                playedSeconds={playedSeconds}
                isFullscreen={isFullscreen}
                onToggleFullscreen={handleToggleFullscreen}
            />

            {/* Big Play Button (Initial State or Paused) */}
            {!isPlaying && !isLoading && (
                <div
                    className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                >
                    <div className="w-20 h-20 rounded-full bg-[#5D5CDE]/90 flex items-center justify-center text-white shadow-[0_0_30px_rgba(93,92,222,0.5)] backdrop-blur-sm transition-transform group-hover:scale-110">
                        <Play fill="currentColor" className="w-8 h-8 ml-1" />
                    </div>
                </div>
            )}



            {/* Error Overlay */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-30">
                    <div className="text-center p-6">
                        <p className="text-red-400 font-bold mb-2">Error al cargar el video</p>
                        <p className="text-xs text-gray-500 max-w-[200px] mx-auto">
                            Video no disponible o privado.
                        </p>
                    </div>
                </div>
            )}

            {/* Loading Spinner */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/10">
                    <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}
