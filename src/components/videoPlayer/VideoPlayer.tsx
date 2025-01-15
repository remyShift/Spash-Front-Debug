import { JSONData, VideoInfo } from '@/types/files';
import { useCallback, useEffect, useRef } from 'react';
import { useFrame } from "@/context/frame";
import { drawElements } from '@/utils/drawing/drawElements';
import { HitsLayer, Layers } from '@/types/layers';

interface VideoPlayerProps {
    currentVideo: VideoInfo;
    jsonData: JSONData;
    activeLayers: Layers[];
    playersHits: HitsLayer;
}

export const VideoPlayer = ({ currentVideo, jsonData, activeLayers, playersHits }: VideoPlayerProps) => {
    const frameRequestRef = useRef<number | null>(null);
    const { currentFrame, setCurrentFrame } = useFrame();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const animate = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;
        
        const fps = 25;
        const newFrame = Math.round(videoRef.current.currentTime * fps);
        
        if (newFrame !== currentFrame) {
            setCurrentFrame(newFrame);
        }
        
        drawElements(jsonData, activeLayers, videoRef.current, canvasRef.current, playersHits);
        frameRequestRef.current = requestAnimationFrame(animate);
    }, [jsonData, activeLayers, videoRef, canvasRef, setCurrentFrame, currentFrame, playersHits]);

    useEffect(() => {
        frameRequestRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRequestRef.current) {
                cancelAnimationFrame(frameRequestRef.current);
            }
        };
    }, [animate]);

    return (
        <div className="relative w-[1000px]">
            <video
                ref={videoRef}
                src={currentVideo.videoPath}
                controls
                className="w-full"
            />
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 z-50 pointer-events-none w-full h-full"
            />
        </div>
    );
};