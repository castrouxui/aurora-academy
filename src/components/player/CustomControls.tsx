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
    onPlaybackRateChange
}: CustomControlsProps) {
    return (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pb-4 pt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
            {/* Progress Bar */}
            <div className="mb-4 flex items-center gap-2 group/slider">
                <Slider
                    value={[played * 100]}
                    max={100}
                    onValueChange={(val) => onSeek(val[0])}
                    onPointerDown={onSeekMouseDown}
                    onPointerUp={(e) => {
                        // We need the value here but Slider onPointerUp doesn't give it directly easily without ref
                        // Actually onSeekMouseUp is usually called with the final value
                        // But for simplicity in shadcn slider, we rely on onValueChange updating the state and then MouseUp committing it
                        onSeekMouseUp(played * 100);
                    }}
                    className="cursor-pointer"
                />
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Play/Pause */}
                    <button
                        onClick={onPlayPause}
                        className="text-white hover:text-[#5D5CDE] transition-colors"
                    >
                        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                    </button>

                    {/* Volume */}
                    <div className="flex items-center gap-2 group/volume relative">
                        <button onClick={onToggleMute} className="text-white hover:text-[#5D5CDE] transition-colors">
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
                    <div className="text-xs text-gray-300 font-mono">
                        {formatDuration(playedSeconds)} / {formatDuration(duration)}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Playback Rate */}
                    <div className="relative group/speed scale-90 sm:scale-100">
                        <button className="text-white hover:text-[#5D5CDE] text-xs font-bold transition-colors w-8">
                            {playbackRate}x
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/speed:flex flex-col bg-[#0B0F19] border border-gray-800 rounded-lg overflow-hidden shadow-xl p-1">
                            {[0.5, 1.0, 1.5, 2.0].map((rate) => (
                                <button
                                    key={rate}
                                    onClick={() => onPlaybackRateChange(rate)}
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
                    <button onClick={onToggleFullscreen} className="text-white hover:text-[#5D5CDE] transition-colors">
                        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
