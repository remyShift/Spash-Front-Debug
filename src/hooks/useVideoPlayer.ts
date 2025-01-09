import { useState, useRef } from 'react';

export const useVideoPlayer = () => {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const handlePlay = () => {
        setIsVideoPlaying(true);
    };

    const handlePause = () => {
        setIsVideoPlaying(false);
    };

    const handleEnded = () => {
        setIsVideoPlaying(false);
    };

    const togglePlay = () => {
        const video = document.querySelector('video');
        if (video) {
            if (isVideoPlaying) {
                video.pause();
                setIsVideoPlaying(false);
            } else {
                video.play();
                setIsVideoPlaying(true);
            }
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
        }
    };

    return {
        videoRef,
        canvasRef,
        isVideoPlaying,
        togglePlay,
        handlers: {
            handlePlay,
            handlePause,
            handleEnded,
            handleLoadedMetadata
        }
    };
};