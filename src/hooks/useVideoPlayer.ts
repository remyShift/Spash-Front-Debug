import { useState, useRef, useCallback, useEffect } from 'react';
import { JSONData } from '@/types/files';
import { drawPlayerBBox } from '@/utils/drawing/drawBboxPlayer';

export const useVideoPlayer = (jsonData: JSONData) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const frameRequestRef = useRef<number | null>(null);

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
        }
    };

    const animate = useCallback(() => {
        if (!videoRef.current) return;

        const video = videoRef.current;
        const fps = 25;
        const currentFrame = Math.floor(video.currentTime * fps);
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        const frameData = jsonData?.data[currentFrame];

        if (!frameData || !videoWidth || !videoHeight) {
            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
            return;
        }

        if (canvasRef.current) {
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;
            
            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;

            ctx.clearRect(0, 0, videoWidth, videoHeight);

            if (frameData.persontracking) {
                Object.values(frameData.persontracking).forEach(player => {
                    drawPlayerBBox(player, videoWidth, videoHeight, ctx);
                });
            }
        }

        if (isPlaying) {
            frameRequestRef.current = requestAnimationFrame(animate);
        }
    }, [isPlaying, jsonData]);

    useEffect(() => {
        if (isPlaying) {
            frameRequestRef.current = requestAnimationFrame(animate);
        } else if (frameRequestRef.current) {
            cancelAnimationFrame(frameRequestRef.current);
        }

        return () => {
            if (frameRequestRef.current) {
                cancelAnimationFrame(frameRequestRef.current);
            }
        };
    }, [isPlaying, animate]);

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