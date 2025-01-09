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
    const { setCurrentFrame } = useFrame();

    const animate = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;
        drawElements(jsonData, activeLayers, videoRef.current, canvasRef.current, setCurrentFrame);
        frameRequestRef.current = requestAnimationFrame(animate);
    }, [jsonData, activeLayers, videoRef, canvasRef, setCurrentFrame]);

    useEffect(() => {
        frameRequestRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRequestRef.current) {
                cancelAnimationFrame(frameRequestRef.current);
            }
        };
    }, [animate]);

    return (
        <div className="relative">
            <video
                ref={videoRef}
                src={currentVideo.videoPath}
                controls
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