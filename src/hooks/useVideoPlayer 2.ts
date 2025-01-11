import { useState, useRef } from 'react';

export const useVideoPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
        }
    };

    return {
        videoRef,
        canvasRef,
        isPlaying,
        handlers: {
            handlePlay,
            handlePause,
            handleEnded,
            handleLoadedMetadata
        }
    };
};