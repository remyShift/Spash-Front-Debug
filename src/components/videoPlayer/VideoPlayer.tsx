import { JSONData, StatsData, VideoInfo } from '@/types/files';
import { useEffect, useRef, useCallback } from 'react';
import { useFrame } from "@/context/frame";
import { drawElements } from '@/utils/drawing/drawElements';
import { Layers } from '@/types/layers';
import { useCanvas } from '@/context/canvas';
import KillFeed from './KillFeed';
import { VideoControls } from './videoControls/VideoControls';
import LayersMenu from './layers/LayersMenu';
import { RenderTiming } from '@/types/performance';
import { usePerformance } from '@/context/performance';

interface VideoPlayerProps {
    currentVideo: VideoInfo;
    jsonData: JSONData;
    activeLayers: Layers[];
    statsData: StatsData;
}

export const VideoPlayer = ({ currentVideo, jsonData, activeLayers, statsData }: VideoPlayerProps) => {
    const frameRequestRef = useRef<number | null>(null);
    const { currentFrame, setCurrentFrame } = useFrame();
    const videoRef = useRef<HTMLVideoElement>(null);
    const mainCanvasRef = useRef<HTMLCanvasElement>(null);
    const persistentCanvasRef = useRef<HTMLCanvasElement>(null);
    const { setMainCanvasRef, setPersistentCanvasRef } = useCanvas();
    const lastDrawnFrame = useRef<number>(-1);
    const { setMainTiming, setPersistentTiming } = usePerformance();

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
        
        if (newFrame !== lastDrawnFrame.current) {
            lastDrawnFrame.current = newFrame;
            
            if (newFrame !== currentFrame) {
                setCurrentFrame(newFrame).then(() => {
                    drawElements(
                        jsonData, 
                        activeLayers, 
                        videoRef.current!, 
                        { 
                            mainCanvas: mainCanvasRef.current!, 
                            persistentCanvas: persistentCanvasRef.current! 
                        },
                        {
                            onTimingsUpdate: (main: RenderTiming, persistent: RenderTiming) => {
                                setMainTiming(main);
                                setPersistentTiming(persistent);
                            }
                        }
                    );
                });
            }
        }
        
        frameRequestRef.current = requestAnimationFrame(animate);
    }, [jsonData, activeLayers, currentFrame, setCurrentFrame, setMainTiming, setPersistentTiming]);

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
            <div className="relative">
                <video
                    ref={videoRef}
                    src={currentVideo.videoPath}
                    className="w-full"
                />
                <LayersMenu jsonData={jsonData} />
                <KillFeed 
                    currentFrame={currentFrame}
                    frameData={jsonData.data[currentFrame] || {}}
                />
                <canvas
                    ref={mainCanvasRef}
                    className="absolute top-0 left-0 z-40 pointer-events-none w-full h-full"
                />
                <canvas
                    ref={persistentCanvasRef}
                    className="absolute top-0 left-0 z-40 pointer-events-none w-full h-full"
                />
            </div>
            {videoRef.current && (
                <VideoControls
                    videoRef={videoRef as React.RefObject<HTMLVideoElement>}
                    reels={statsData.reels}
                />
            )}
        </div>
    );
};