"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Play, Lock } from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getYouTubeId } from '@/lib/utils';
import { CustomControls } from "./CustomControls";

// Dynamic import for ReactPlayer
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
    initialProgress?: number;
}

export function VideoPlayer({ url, thumbnail, title, isLocked, previewMode, courseId, onComplete, onPurchase, onDuration, onProgressUpdate, initialProgress }: VideoPlayerProps) {
    const playerRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hasMounted, setHasMounted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Playback State
    const [volume, setVolume] = useState(0.8);
    const [muted, setMuted] = useState(false);
    const [played, setPlayed] = useState(0);
    const [playedSeconds, setPlayedSeconds] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1.0);
    const [showControls, setShowControls] = useState(false);
    const [quality, setQuality] = useState("Auto");
    const [isReady, setIsReady] = useState(false);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Mobile Detection
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileLandscape, setIsMobileLandscape] = useState(false);

    useEffect(() => {
        const checkDevice = () => {
            const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            setIsMobile(mobile);

            const landscape = window.matchMedia("(orientation: landscape)").matches;
            setIsMobileLandscape(mobile && landscape);
        };

        checkDevice();
        setHasMounted(true);

        window.addEventListener('resize', checkDevice);
        window.addEventListener('orientationchange', checkDevice);

        return () => {
            window.removeEventListener('resize', checkDevice);
            window.removeEventListener('orientationchange', checkDevice);
        };
    }, []);

    // Fullscreen listener
    useEffect(() => {
        const handleFullscreenChange = () => {
            const videoDOM = containerRef.current?.querySelector('video');
            const isFull = !!(document.fullscreenElement ||
                (document as any).webkitFullscreenElement ||
                (document as any).mozFullScreenElement ||
                (document as any).msFullscreenElement ||
                (videoDOM && ((videoDOM as any).webkitDisplayingFullscreen || document.fullscreenElement === videoDOM)));
            setIsFullscreen(isFull);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
        };
    }, []);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    // Helper to safely lock orientation
    const lockOrientation = async () => {
        try {
            if (screen.orientation && (screen.orientation as any).lock) {
                await (screen.orientation as any).lock('landscape');
            } else if ((screen as any).lockOrientation) {
                (screen as any).lockOrientation('landscape');
            }
        } catch (error) {
            console.log("Orientation lock failed:", error);
        }
    };

    // Helper to safely unlock orientation
    const unlockOrientation = () => {
        try {
            if (screen.orientation && (screen.orientation as any).unlock) {
                (screen.orientation as any).unlock();
            } else if ((screen as any).unlockOrientation) {
                (screen as any).unlockOrientation();
            }
        } catch (error) {
            console.log("Orientation unlock failed:", error);
        }
    };

    const [isManualFullscreen, setIsManualFullscreen] = useState(false);

    // ... (rest of states)

    const handleToggleFullscreen = async () => {
        const container = containerRef.current;
        const videoDOM = containerRef.current?.querySelector('video');

        // Toggle Manual Fullscreen on Mobile
        if (isMobile) {
            const nextState = !isManualFullscreen;
            setIsManualFullscreen(nextState);

            if (nextState) {
                await lockOrientation();
                // Attempt native as well, but don't rely on it
                if (videoDOM && (videoDOM as any).webkitEnterFullscreen) {
                    (videoDOM as any).webkitEnterFullscreen();
                }
            } else {
                unlockOrientation();
            }
            return;
        }

        // Desktop: Native API
        if (container) {
            if (!isFullscreen) {
                if (container.requestFullscreen) {
                    await container.requestFullscreen();
                } else if ((container as any).webkitRequestFullscreen) {
                    (container as any).webkitRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if ((document as any).webkitExitFullscreen) {
                    (document as any).webkitExitFullscreen();
                }
            }
        }
    };

    const [playableUrl, setPlayableUrl] = useState("");

    useEffect(() => {
        if (!url) return;
        let finalUrl = url;
        const youtubeId = getYouTubeId(url);
        if (youtubeId) {
            finalUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
        } else if (url.includes("utfs.io")) {
            finalUrl = url.replace("utfs.io", "ovtcwtlzxz.ufs.sh");
        }
        setPlayableUrl(finalUrl);
    }, [url]);

    const handleProgress = (state: { played: number; playedSeconds: number }) => {
        if (!isSeeking) {
            setPlayed(state.played);
            setPlayedSeconds(state.playedSeconds);
            if (onProgressUpdate) {
                onProgressUpdate(state.playedSeconds, duration);
            }
        }
    };

    const isFull = isFullscreen || (isMobile && isManualFullscreen);
    const shouldRotate = isMobile && isManualFullscreen && !isMobileLandscape;

    // Calculate classes
    const containerClasses = cn(
        "relative bg-black rounded-lg overflow-hidden border border-gray-800 transition-all duration-300",
        isFull ? "fixed inset-0 z-[9999] w-screen h-[100dvh] border-none rounded-none flex items-center justify-center" : "w-full aspect-video",
        shouldRotate && "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100dvh] h-[100dvw] rotate-90"
    );

    // Hydration Placeholder
    if (!hasMounted) {
        return <div className="aspect-video w-full bg-black rounded-lg" />;
    }

    const playerContent = (
        <div ref={containerRef} className={containerClasses}>
            {/* Click to Play Overlay - Always enabled for custom controls */}
            {!isLocked && (
                <div
                    className="absolute inset-0 z-10 cursor-pointer"
                    onClick={handlePlayPause}
                    onDoubleClick={handleToggleFullscreen}
                />
            )}

            <div className="absolute inset-0 z-0 w-full h-full">
                {isLocked ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900/90 backdrop-blur-sm z-50">
                        <Lock className="w-10 h-10 text-gray-400 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Contenido Bloqueado</h3>
                        {onPurchase && (
                            <Button onClick={onPurchase} className="bg-[#5D5CDE] text-white">
                                Comprar Curso
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* TOP SHIELD - Blocks tapping the YouTube Title/Share on mobile if they somehow leak */}
                        {isMobile && (
                            <div
                                className="absolute top-0 left-0 w-full h-[60px] z-20 pointer-events-auto bg-transparent"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            />
                        )}
                        <ReactPlayer
                            key={`${playableUrl}-${isMobile}`}
                            ref={playerRef}
                            url={playableUrl}
                            width="100%"
                            height="100%"
                            playing={isPlaying}
                            volume={volume}
                            muted={muted}
                            playbackRate={playbackRate}
                            controls={false} // ALWAYS use custom controls to hide YouTube branding
                            onProgress={handleProgress}
                            onDuration={(d: number) => {
                                setDuration(d);
                                setIsLoading(false);
                                if (onDuration) onDuration(d);
                            }}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            config={{
                                youtube: {
                                    playerVars: {
                                        showinfo: 0,
                                        rel: 0,
                                        modestbranding: 1,
                                        iv_load_policy: 3,
                                        fs: 1,
                                        disablekb: 1,
                                        controls: 0 // Explicitly hide YT controls
                                    }
                                }
                            }}
                            playsinline={true}
                            onReady={() => setIsLoading(false)}
                            onStart={() => setIsLoading(false)}
                            onEnded={onComplete}
                            onError={(e: any) => {
                                console.error("Player Error:", e);
                                setIsLoading(false);
                                setHasError(true);
                            }}
                        />
                    </>
                )}
            </div>

            {/* Custom Controls - Now for both Mobile and Desktop */}
            {!isLocked && (
                <CustomControls
                    isPlaying={isPlaying}
                    onPlayPause={handlePlayPause}
                    volume={volume}
                    onVolumeChange={(v) => setVolume(v)}
                    muted={muted}
                    onToggleMute={() => setMuted(!muted)}
                    played={played}
                    onSeek={(p) => setPlayed(p / 100)}
                    onSeekMouseDown={() => setIsSeeking(true)}
                    onSeekMouseUp={(p) => {
                        setIsSeeking(false);
                        playerRef.current?.seekTo(p / 100);
                    }}
                    duration={duration}
                    playedSeconds={playedSeconds}
                    isFullscreen={isFull}
                    onToggleFullscreen={handleToggleFullscreen}
                    playbackRate={playbackRate}
                    onPlaybackRateChange={(r) => setPlaybackRate(r)}
                    isVisible={showControls || !isPlaying}
                    quality={quality}
                    onQualityChange={setQuality}
                />
            )}

            {/* Big Play Button - Now for both Mobile and Desktop */}
            {!isPlaying && !isLoading && !isLocked && (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                    <div className="w-20 h-20 rounded-full bg-[#5D5CDE]/90 flex items-center justify-center text-white shadow-[0_0_30px_rgba(93,92,222,0.5)] backdrop-blur-sm transition-transform group-hover:scale-110">
                        <Play fill="currentColor" className="w-8 h-8 ml-1" />
                    </div>
                </div>
            )}

            {/* ERROR / LOADING - ONLY ON DESKTOP - MOBILE SHOULD BE BARE BONES */}
            {!isMobile && isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/50">
                    <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );

    if (isManualFullscreen && typeof document !== "undefined") {
        return createPortal(playerContent, document.body);
    }

    return playerContent;
}
