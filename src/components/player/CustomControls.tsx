"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from "lucide-react";

interface CustomControlsProps {
    isPlaying: boolean;
    onPlayPause: () => void;
    volume: number;
    onVolumeChange: (value: number) => void;
    muted: boolean;
    onToggleMute: () => void;
    played: number;
    onSeek: (value: number) => void;
    onSeekMouseDown: () => void;
    onSeekMouseUp: (value: number) => void;
    duration: number;
    playedSeconds: number;
    isFullscreen: boolean;
    onToggleFullscreen: () => void;
    playbackRate: number;
    onPlaybackRateChange: (rate: number) => void;
    isVisible: boolean;
    quality?: string;
    onQualityChange?: (quality: string) => void;
}

function formatDuration(seconds: number) {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());
    if (hh) {
        return `${hh}:${pad(mm)}:${ss}`;
    }
    return `${mm}:${ss}`;
}

function pad(string: number) {
    return ('0' + string).slice(-2);
}

export function CustomControls({
    isPlaying,
    onPlayPause,
    volume,
    onVolumeChange,
    muted,
    onToggleMute,
    played,
    onSeek,
    onSeekMouseDown,
    onSeekMouseUp,
    duration,
    playedSeconds,
    isFullscreen,
    onToggleFullscreen,
    playbackRate,
    onPlaybackRateChange,
    isVisible,
    quality = "Auto",
    onQualityChange
}: CustomControlsProps) {
    return (
        <div className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-3 sm:px-4 pb-3 sm:pb-4 pt-12 transition-opacity duration-300 z-30",
            isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
            {/* Progress Bar */}
            <div className="mb-2 sm:mb-4 flex items-center gap-2 group/slider">
                <Slider
                    value={[played * 100]}
                    max={100}
                    onValueChange={(val) => onSeek(val[0])}
                    onPointerDown={onSeekMouseDown}
                    onPointerUp={(e) => {
                        onSeekMouseUp(played * 100);
                    }}
                    className="cursor-pointer"
                />
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Play/Pause */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onPlayPause();
                        }}
                        className="text-white hover:text-[#5D5CDE] transition-colors p-1.5 sm:p-2 -ml-1 sm:-ml-2 hover:bg-white/10 rounded-full"
                    >
                        {isPlaying ? <Pause size={20} fill="currentColor" className="sm:w-6 sm:h-6" /> : <Play size={20} fill="currentColor" className="sm:w-6 sm:h-6" />}
                    </button>

                    {/* Volume - Hidden on mobile, device volume used instead */}
                    <div className="hidden sm:flex items-center gap-2 group/volume relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleMute();
                            }}
                            className="text-white hover:text-[#5D5CDE] transition-colors p-2 hover:bg-white/10 rounded-full"
                        >
                            {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                        <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300">
                            <Slider
                                value={[muted ? 0 : volume * 100]}
                                max={100}
                                onValueChange={(val) => onVolumeChange(val[0] / 100)}
                                className="w-20"
                            />
                        </div>
                    </div>

                    {/* Time */}
                    <div className="text-[10px] sm:text-xs text-gray-300 font-mono">
                        {formatDuration(playedSeconds)} / {formatDuration(duration)}
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Quality Selection (Mock UI) */}
                    <div className="relative group/quality scale-90 sm:scale-100 hidden sm:block">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                const menu = e.currentTarget.nextElementSibling;
                                if (menu) {
                                    menu.classList.toggle('hidden');
                                    menu.classList.toggle('flex');
                                }
                            }}
                            className="text-white hover:text-[#5D5CDE] text-xs font-bold transition-colors w-8"
                        >
                            {quality === 'Auto' ? 'HD' : quality}
                        </button>
                        <div
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden flex-col bg-[#0B0F19] border border-gray-800 rounded-lg overflow-hidden shadow-xl p-1 z-50 min-w-[60px]"
                            onMouseLeave={(e) => {
                                e.currentTarget.classList.add('hidden');
                                e.currentTarget.classList.remove('flex');
                            }}
                        >
                            {['1080p', '720p', 'Auto'].map((q) => (
                                <button
                                    key={q}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onQualityChange) onQualityChange(q);
                                        const menu = e.currentTarget.parentElement;
                                        if (menu) {
                                            menu.classList.add('hidden');
                                            menu.classList.remove('flex');
                                        }
                                    }}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-medium hover:bg-white/10 transition-colors rounded text-center",
                                        quality === q ? "text-[#5D5CDE] bg-[#5D5CDE]/10" : "text-gray-300"
                                    )}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Playback Rate */}
                    <div className="relative group/speed">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                const menu = e.currentTarget.nextElementSibling;
                                if (menu) {
                                    menu.classList.toggle('hidden');
                                    menu.classList.toggle('flex');
                                }
                            }}
                            className="text-white hover:text-[#5D5CDE] text-xs font-bold transition-colors w-8"
                        >
                            {playbackRate}x
                        </button>
                        <div
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden flex-col bg-[#0B0F19] border border-gray-800 rounded-lg overflow-hidden shadow-xl p-1 z-50"
                            onMouseLeave={(e) => {
                                e.currentTarget.classList.add('hidden');
                                e.currentTarget.classList.remove('flex');
                            }}
                        >
                            {[0.5, 1.0, 1.5, 2.0].map((rate) => (
                                <button
                                    key={rate}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onPlaybackRateChange(rate);
                                        const menu = e.currentTarget.parentElement;
                                        if (menu) {
                                            menu.classList.add('hidden');
                                            menu.classList.remove('flex');
                                        }
                                    }}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-medium hover:bg-white/10 transition-colors rounded text-center min-w-[50px]",
                                        playbackRate === rate ? "text-[#5D5CDE] bg-[#5D5CDE]/10" : "text-gray-300"
                                    )}
                                >
                                    {rate}x
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Fullscreen */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFullscreen();
                        }}
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onToggleFullscreen();
                        }}
                        className="text-white hover:text-[#5D5CDE] transition-colors p-1.5 sm:p-2 -mr-1 sm:-mr-2 hover:bg-white/10 rounded-full"
                        aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                    >
                        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
