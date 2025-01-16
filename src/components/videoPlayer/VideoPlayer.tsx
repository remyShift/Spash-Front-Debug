import { JSONData, VideoInfo } from '@/types/files';
import { useCallback, useEffect, useRef } from 'react';
import { useFrame } from "@/context/frame";
import { drawElements } from '@/utils/drawing/drawElements';
import { Layers } from '@/types/layers';
import { useCanvas } from '@/context/canvas';

interface VideoPlayerProps {
    currentVideo: VideoInfo;
    jsonData: JSONData;
    activeLayers: Layers[];
}

export const VideoPlayer = ({ currentVideo, jsonData, activeLayers }: VideoPlayerProps) => {
    const frameRequestRef = useRef<number | null>(null);
    const { currentFrame, setCurrentFrame } = useFrame();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const mainCanvasRef = useRef<HTMLCanvasElement>(null);
    const persistentCanvasRef = useRef<HTMLCanvasElement>(null);
    const { setMainCanvasRef, setPersistentCanvasRef } = useCanvas();

    useEffect(() => {
        if (mainCanvasRef.current) {
            setMainCanvasRef(mainCanvasRef);
        }
        if (persistentCanvasRef.current) {
            setPersistentCanvasRef(persistentCanvasRef);
        }
    }, [setMainCanvasRef, setPersistentCanvasRef]);

    const animate = useCallback(() => {
        if (!videoRef.current || !mainCanvasRef.current || !persistentCanvasRef.current) return;
        
        const fps = 25;
        const newFrame = Math.round(videoRef.current.currentTime * fps);
        
        if (newFrame !== currentFrame) {
            setCurrentFrame(newFrame);
            drawElements(
                jsonData, 
                activeLayers, 
                videoRef.current, 
                { 
                    mainCanvas: mainCanvasRef.current, 
                    persistentCanvas: persistentCanvasRef.current 
                }
            );
        }
        
        frameRequestRef.current = requestAnimationFrame(animate);
    }, [jsonData, activeLayers, videoRef, setCurrentFrame, currentFrame]);

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
                ref={mainCanvasRef}
                className="absolute top-0 left-0 z-50 pointer-events-none w-full h-full"
            />
            <canvas
                ref={persistentCanvasRef}
                className="absolute top-0 left-0 z-40 pointer-events-none w-full h-full"
            />
        </div>
    );
};