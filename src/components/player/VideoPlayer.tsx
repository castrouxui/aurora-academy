"use client";

import { useState, useRef, useEffect } from "react";
import { PaywallOverlay } from "./PaywallOverlay";
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface VideoPlayerProps {
    url: string; // Could be a file path or URL
    thumbnail?: string;
    title?: string;
    isLocked: boolean; // Fully locked from start
    previewMode: boolean; // Allowed for 30s only
    courseId?: string;
    onComplete?: () => void;
}

export function VideoPlayer({ url, thumbnail, title, isLocked, previewMode, courseId, onComplete }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showPaywall, setShowPaywall] = useState(isLocked);

    // Effect to handle Preview Mode limit
    useEffect(() => {
        if (previewMode && !isLocked) {
            const checkTime = () => {
                if (videoRef.current) {
                    if (videoRef.current.currentTime >= 30) {
                        videoRef.current.pause();
                        videoRef.current.currentTime = 30; // Clamp
                        setIsPlaying(false);
                        setShowPaywall(true);
                        // Disable controls potentially?
                    }
                }
            };

            const video = videoRef.current;
            if (video) {
                video.addEventListener("timeupdate", checkTime);
                return () => video.removeEventListener("timeupdate", checkTime);
            }
        }
    }, [previewMode, isLocked]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                if (showPaywall) return; // Don't play if paywalled
                videoRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            // Simple completion check (> 90%)
            if (onComplete && !previewMode && !isLocked) {
                if (videoRef.current.currentTime > videoRef.current.duration * 0.9) {
                    onComplete();
                }
            }
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
            setIsLoading(false);
        }
    };

    const handleSeek = (value: number[]) => {
        if (videoRef.current) {
            // Validar restricción de seek en previewMode
            if (previewMode && value[0] > 30) {
                setShowPaywall(true);
                return;
            }
            videoRef.current.currentTime = value[0];
            setCurrentTime(value[0]);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    // If fully locked, show paywall immediately
    if (isLocked) {
        return (
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-gray-800">
                {thumbnail && (
                    <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${thumbnail})` }}></div>
                )}
                <PaywallOverlay courseId={courseId} />
            </div>
        );
    }

    return (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden group border border-gray-800">
            <video
                ref={videoRef}
                src={url}
                className="w-full h-full object-contain"
                poster={thumbnail}
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onWaiting={() => setIsLoading(true)}
                onCanPlay={() => setIsLoading(false)}
                onClick={togglePlay}
            />

            {/* Paywall Overlay if limit reached */}
            {showPaywall && (
                <PaywallOverlay courseId={courseId} />
            )}

            {/* Loading Spinner */}
            {isLoading && !showPaywall && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Loader2 className="h-10 w-10 text-white animate-spin" />
                </div>
            )}

            {/* Custom Controls */}
            {!showPaywall && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity opacity-0 group-hover:opacity-100">
                    {/* Progress Bar */}
                    <div className="mb-4">
                        <Slider
                            value={[currentTime]}
                            max={previewMode ? 30 : duration || 100}
                            step={0.1}
                            onValueChange={handleSeek}
                            className="cursor-pointer"
                        />
                        {previewMode && (
                            <div className="w-full h-1 bg-gray-700 mt-1 relative overflow-hidden rounded-full opacity-50">
                                {/* Visual indicator of 30s limit relative to full duration, if we knew full duration, otherwise hard to show */}
                                {/* For now just limit the slider max to 30 */}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={togglePlay} className="text-white hover:text-primary transition-colors">
                                {isPlaying ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
                            </button>

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
                                            if (videoRef.current) videoRef.current.volume = val[0];
                                            setIsMuted(val[0] === 0);
                                        }}
                                    />
                                </div>
                            </div>

                            <span className="text-sm font-medium text-white">
                                {formatTime(currentTime)} / {previewMode ? "0:30 (Vista Previa)" : formatTime(duration)}
                            </span>
                        </div>

                        <div>
                            {/* <button className="text-white hover:text-gray-300">
                                <Maximize size={20} />
                            </button> */}
                        </div>
                    </div>
                </div>
            )}

            {/* Center Play Button (Initial) */}
            {!isPlaying && !isLoading && !showPaywall && currentTime === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play size={32} fill="currentColor" className="text-white ml-1" />
                    </div>
                </div>
            )}
        </div>
    );
}
