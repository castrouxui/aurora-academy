"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Play, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getYouTubeId } from '@/lib/utils';
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
    onDuration?: (duration: number) => void;
    onProgressUpdate?: (seconds: number, total: number) => void;
}

export function VideoPlayer({ url, thumbnail, title, isLocked, previewMode, courseId, onComplete, onPurchase, onDuration, onProgressUpdate }: VideoPlayerProps) {
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
    const [playbackRate, setPlaybackRate] = useState(1.0); // Default 1x
    const [showControls, setShowControls] = useState(false);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Handle Control Visibility
    const handleShowControls = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        // Hide after 3 seconds if playing
        if (isPlaying) {
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        }
    };

    const handleMouseLeave = () => {
        if (isPlaying) {
            setShowControls(false);
        }
    };

    useEffect(() => {
        setHasWindow(true);
    }, []);

    // ... (rest of useEffects)

    const handlePlaybackRateChange = (rate: number) => {
        setPlaybackRate(rate);
    };

    // Fullscreen change listener
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const handlePlayPause = () => {
        // Force synchronous play for YouTube to satisfy browser autoplay policies
        if (!isPlaying && playerRef.current) {
            const internalPlayer = playerRef.current.getInternalPlayer('youtube');
            if (internalPlayer && typeof internalPlayer.playVideo === 'function') {
                internalPlayer.playVideo();
            }
        }
        setIsPlaying(!isPlaying);
        handleShowControls(); // Ensure controls show on interaction
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

        // Try standard fullscreen API first
        if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen();
            } else if ((containerRef.current as any).webkitRequestFullscreen) {
                (containerRef.current as any).webkitRequestFullscreen();
            } else if (playerRef.current) {
                // Fallback for iOS video element specific
                const video = playerRef.current.getInternalPlayer();
                if (video && video.webkitEnterFullscreen) {
                    video.webkitEnterFullscreen();
                }
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if ((document as any).webkitExitFullscreen) {
                (document as any).webkitExitFullscreen();
            }
        }
    };

    const [retryAttempted, setRetryAttempted] = useState(false);

    // Initial URL processing
    const processUrl = useCallback((rawUrl: string) => {
        if (!rawUrl) return "";
        let finalUrl = rawUrl;

        // Check Youtube
        const youtubeId = getYouTubeId(rawUrl);
        if (youtubeId) {
            return `https://www.youtube.com/watch?v=${youtubeId}`;
        }

        // UploadThing Fix (Only apply if we haven't failed yet)
        if (rawUrl.includes("utfs.io") && !retryAttempted) {
            finalUrl = rawUrl.replace("utfs.io", "ovtcwtlzxz.ufs.sh");
        }

        // Add format hint
        if ((finalUrl.includes("utfs.io") || finalUrl.includes("ufs.sh")) && !finalUrl.endsWith(".mp4")) {
            return `${finalUrl}#.mp4`;
        }

        return finalUrl;
    }, [retryAttempted]);

    const [playableUrl, setPlayableUrl] = useState(processUrl(url));

    // Update URL when prop changes or retry state changes
    useEffect(() => {
        setPlayableUrl(processUrl(url));
    }, [url, processUrl]);

    const handleError = (e: any) => {
        console.error("Video Error:", e);

        // Retry logic: If we modified the URL (e.g. ufs.sh replacement), try the original
        if (!retryAttempted && url.includes("utfs.io")) {
            console.log("Retrying with original URL...");
            setRetryAttempted(true);
            setHasError(false);
            setIsLoading(true);
            return; // Effect will trigger re-calculation of playableUrl
        }

        setHasError(true);
        setIsLoading(false);
    };

    const handleProgress = (state: { played: number; playedSeconds: number }) => {
        // We only update progress if not seeking
        if (!isSeeking) {
            setPlayed(state.played);
            setPlayedSeconds(state.playedSeconds);
            if (onProgressUpdate) {
                onProgressUpdate(state.playedSeconds, duration);
            }
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative aspect-video bg-black rounded-lg overflow-hidden group border border-gray-800 select-none"
            onContextMenu={(e) => e.preventDefault()}
            onMouseMove={handleShowControls}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleShowControls} // Mobile tap
            onClick={handleShowControls} // Ensure click also triggers
        >
            <div
                className="absolute inset-0 z-10 cursor-pointer"
                onClick={handlePlayPause}
                onDoubleClick={handleToggleFullscreen} // Double tap to fullscreen is nice
            />

            <div className="absolute inset-0 z-0">
                {isLocked ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900/90 backdrop-blur-sm z-50">
                        <div className="bg-gray-800 p-4 rounded-full mb-4 shadow-lg shadow-black/50">
                            <Lock className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Contenido Bloqueado</h3>
                        <p className="text-gray-400 text-sm max-w-xs text-center mb-6">
                            Adquiere este curso para acceder a todas las lecciones y recursos.
                        </p>
                        {onPurchase && (
                            <Button onClick={onPurchase} className="bg-[#5D5CDE] hover:bg-[#4B4AC0] text-white font-bold">
                                Comprar Curso
                            </Button>
                        )}
                    </div>
                ) : (
                    <ReactPlayer
                        key={playableUrl} // Force remount on retry
                        ref={playerRef}
                        url={playableUrl}
                        width="100%"
                        height="100%"
                        playing={isPlaying}
                        volume={volume}
                        muted={muted}
                        playbackRate={playbackRate}
                        onProgress={(state: any) => {
                            handleProgress(state);
                            // eslint-disable-next-line
                            if (onDuration) {
                                // Hack: passing progress via a custom callback if needed
                            }
                        }}
                        onDuration={(d: number) => {
                            setDuration(d);
                            setIsLoading(false);
                            if (onDuration) onDuration(d);
                        }}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        config={{
                            youtube: {
                                playerVars: { showinfo: 0, rel: 0, modestbranding: 1 }
                            }
                        }}
                        playsinline={true}
                        onError={handleError}
                        onReady={() => setIsLoading(false)}
                        onStart={() => setIsLoading(false)}
                        onEnded={onComplete}
                    />
                )}
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
                playbackRate={playbackRate}
                onPlaybackRateChange={handlePlaybackRateChange}
                isVisible={showControls || !isPlaying} // Always show when paused
            />

            {/* Big Play Button (Initial State or Paused) */}
            {
                !isPlaying && !isLoading && (
                    <div
                        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                    >
                        <div className="w-20 h-20 rounded-full bg-[#5D5CDE]/90 flex items-center justify-center text-white shadow-[0_0_30px_rgba(93,92,222,0.5)] backdrop-blur-sm transition-transform group-hover:scale-110">
                            <Play fill="currentColor" className="w-8 h-8 ml-1" />
                        </div>
                    </div>
                )
            }



            {/* Error Overlay */}
            {
                hasError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-30">
                        <div className="text-center p-6">
                            <p className="text-red-400 font-bold mb-2">Error al cargar el video</p>
                            <p className="text-xs text-gray-500 max-w-[200px] mx-auto">
                                Video no disponible o privado.
                            </p>

                        </div>
                    </div>
                )
            }

            {/* Loading Spinner */}
            {
                isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/10">
                        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                    </div>
                )
            }
        </div >
    );
}
