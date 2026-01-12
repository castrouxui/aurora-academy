"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { PaywallOverlay } from "./PaywallOverlay";
import { Play, Pause, Volume2, VolumeX, Loader2, Settings } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Dynamic import to avoid SSR issues with ReactPlayer. 
// Using main entry point to ensure compatibility.
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

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
    const playerRef = useRef<any>(null); // ReactPlayer ref
    const [hasWindow, setHasWindow] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showPaywall, setShowPaywall] = useState(isLocked);
    const [playbackRate, setPlaybackRate] = useState(1.0);
    const [hasError, setHasError] = useState(false);

    const handleError = (e: any) => {
        console.error("Video Player Error:", e);
        setIsLoading(false);
        setHasError(true);
    };

    // Strict Mode Tracking: The furthest point the user has reached
    // Initialize with 0. In a real app, you might sync this with the DB for resuming.
    const [maxPlayed, setMaxPlayed] = useState(0);

    // Ensure client-side rendering
    useEffect(() => {
        setHasWindow(true);
    }, []);

    // Effect for Preview Mode limit
    useEffect(() => {
        if (previewMode && !isLocked && currentTime >= 30) {
            setIsPlaying(false);
            setShowPaywall(true);
        }
    }, [currentTime, previewMode, isLocked]);

    const handlePlayPause = () => {
        if (showPaywall) return;
        setIsPlaying(!isPlaying);
    };

    const handleProgress = (state: { playedSeconds: number; loadedSeconds: number; played: number }) => {
        // Only update if we are actually playing
        if (!isPlaying && !isLoading) {
            // Sometimes progress fires when paused, ignore hard updates
        }

        const time = state.playedSeconds;
        setCurrentTime(time);

        // Update maxPlayed if we are legitimately watching new content
        // We add a small buffer (e.g. 1s) to allow for minor jumps or timer jitter
        if (time > maxPlayed) {
            setMaxPlayed(time);
        }

        // Preview Mode Check
        if (previewMode && !isLocked && time >= 30) {
            setIsPlaying(false);
            setShowPaywall(true);
        }
    };

    const handleDuration = (duration: number) => {
        setDuration(duration);
        setIsLoading(false);
    };

    const handleSeek = (value: number[]) => {
        const seekTime = value[0];

        // STRICT MODE Check
        // Allow seeking only up to maxPlayed + small buffer (e.g., 2s) to be generous
        const allowedSeekLimit = Math.max(maxPlayed, 2);

        // If try to seek past allowed limit
        if (seekTime > allowedSeekLimit + 1) {
            // Block seeking forward
            // Force player back to maxPlayed or just ignore
            // We'll just reset the UI slider to maxPlayed logic in next render or force seek to maxPlayed
            if (playerRef.current) {
                playerRef.current.seekTo(maxPlayed, 'seconds');
                setCurrentTime(maxPlayed);
            }
            return;
        }

        // Preview Mode Constrain
        if (previewMode && seekTime > 30) {
            return;
        }

        if (playerRef.current) {
            playerRef.current.seekTo(seekTime, 'seconds');
            setCurrentTime(seekTime);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        // Mark as fully watched locally so they can replay freely
        setMaxPlayed(duration);

        if (onComplete && !previewMode && !isLocked) {
            onComplete();
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    if (isLocked) {
        return (
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-gray-800">
                {thumbnail && (
                    <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${thumbnail})` }}></div>
                )}
                <PaywallOverlay courseId={courseId} onPurchase={onPurchase} />
            </div>
        );
    }

    return (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden group border border-gray-800">
            {hasWindow && (
                <ReactPlayer
                    ref={playerRef}
                    url={url}
                    width="100%"
                    height="100%"
                    playing={isPlaying}
                    volume={isMuted ? 0 : volume}
                    playbackRate={playbackRate}
                    controls={false} // We provide custom controls
                    // @ts-ignore
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    onEnded={handleEnded}
                    onError={handleError}
                    onBuffer={() => setIsLoading(true)}
                    onBufferEnd={() => setIsLoading(false)}
                    onReady={() => setIsLoading(false)}
                    style={{ pointerEvents: 'none' }} // Prevent native YouTube clicks stealing focus
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

            {/* Tap/Click Overlay for Play/Pause */}
            <div
                className="absolute inset-0 z-10"
                onClick={handlePlayPause}
            ></div>

            {/* Paywall Overlay */}
            {showPaywall && (
                <div className="absolute inset-0 z-50">
                    <PaywallOverlay courseId={courseId} onPurchase={onPurchase} />
                </div>
            )}

            {/* Loading Spinner */}
            {isLoading && !showPaywall && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <Loader2 className="h-10 w-10 text-white animate-spin" />
                </div>
            )}

            {/* Custom Controls Bar */}
            {!showPaywall && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 transition-opacity opacity-0 group-hover:opacity-100 z-30">
                    {/* Progress Slider */}
                    <div className="mb-4 relative group/slider">
                        <Slider
                            value={[currentTime]}
                            max={previewMode ? 30 : duration || 100}
                            step={1}
                            onValueChange={handleSeek}
                            className="cursor-pointer relative z-10"
                        />
                        {/* Buffer/MaxPlayed visualization could go here */}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Play/Pause */}
                            <button onClick={handlePlayPause} className="text-white hover:text-primary transition-colors">
                                {isPlaying ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
                            </button>

                            {/* Volume */}
                            <div className="flex items-center gap-2 group/volume">
                                <button onClick={toggleMute} className="text-white hover:text-gray-300">
                                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                </button>
                                <div className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300">
                                    <Slider
                                        value={[isMuted ? 0 : volume]}
                                        max={1}
                                        step={0.1}
                                        onValueChange={(val: number[]) => {
                                            setVolume(val[0]);
                                            setIsMuted(val[0] === 0);
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Time Display */}
                            <span className="text-sm font-medium text-white">
                                {formatTime(currentTime)} / {previewMode ? "0:30" : formatTime(duration)}
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* SPEED CONTROL */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-white h-8 min-w-[32px] p-0 hover:bg-white/10 gap-1">
                                        <Settings size={14} />
                                        <span className="text-xs font-bold">{playbackRate}x</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-[#1A1F2E] border-gray-800 text-white min-w-[80px]">
                                    {[0.5, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                                        <DropdownMenuItem
                                            key={rate}
                                            onClick={() => setPlaybackRate(rate)}
                                            className="hover:bg-white/10 cursor-pointer focus:bg-white/10 focus:text-white justify-center"
                                        >
                                            {rate}x
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            )}

            {/* Center Play Button (Initial) */}
            {!isPlaying && !isLoading && !showPaywall && currentTime === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play size={32} fill="currentColor" className="text-white ml-1" />
                    </div>
                </div>
            )}
        </div>
    );
}
