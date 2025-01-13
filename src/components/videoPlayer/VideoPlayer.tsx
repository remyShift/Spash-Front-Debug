import { JSONData, VideoInfo } from '@/types/files';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';
import { useCallback, useEffect, useRef } from 'react';
import { useFrame } from "@/context/frame";
import { drawElements } from '@/utils/drawing/drawElements';
import { Layers } from '@/types/layers';

interface VideoPlayerProps {
    currentVideo: VideoInfo;
    jsonData: JSONData;
    activeLayers: Layers[];
}

export const VideoPlayer = ({ currentVideo, jsonData, activeLayers }: VideoPlayerProps) => {
    const { videoRef, canvasRef, handlers } = useVideoPlayer();
    const frameRequestRef = useRef<number | null>(null);
    const { currentFrame, setCurrentFrame } = useFrame();

    const animate = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;
        
        const fps = 25;
        const newFrame = Math.round(videoRef.current.currentTime * fps);
        
        if (newFrame !== currentFrame) {
            setCurrentFrame(newFrame);
        }
        
        drawElements(jsonData, activeLayers, videoRef.current, canvasRef.current);
        frameRequestRef.current = requestAnimationFrame(animate);
    }, [jsonData, activeLayers, videoRef, canvasRef, setCurrentFrame, currentFrame]);

    useEffect(() => {
        frameRequestRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRequestRef.current) {
                cancelAnimationFrame(frameRequestRef.current);
            }
        };
    }, [animate]);

    return (
        <div className="relative w-[1050px]">
            <video
                ref={videoRef}
                src={currentVideo.videoPath}
                controls
                className="w-full"
                onPlay={handlers.handlePlay}
                onPause={handlers.handlePause}
                onEnded={handlers.handleEnded}
                onLoadedMetadata={handlers.handleLoadedMetadata}
            />
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 z-50 pointer-events-none w-full h-full"
            />
        </div>
    );
};