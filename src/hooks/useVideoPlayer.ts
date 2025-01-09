import { useState, useRef } from 'react';

export const useVideoPlayer = () => {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const handlePlay = () => setIsVideoPlaying(true);
    const handlePause = () => setIsVideoPlaying(false);
    const handleEnded = () => setIsVideoPlaying(false);

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
        }
    };

    return {
        videoRef,
        canvasRef,
        isVideoPlaying,
        handlers: {
            handlePlay,
            handlePause,
            handleEnded,
            handleLoadedMetadata
        }
    };
};