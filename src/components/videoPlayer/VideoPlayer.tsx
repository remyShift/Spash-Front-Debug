import { JSONData, JSONStats, VideoInfo } from '@/types/files';
import { useEffect, useRef, useCallback } from 'react';
import { useFrame } from "@/context/frame";
import { drawSportElements } from '@/utils/drawing/drawSportElements';
import { PadelLayers, FootballLayers } from '@/types/layers';
import { useCanvas } from '@/context/canvas';
import KillFeed from './KillFeed';
import { VideoControls } from './videoControls/VideoControls';
import LayersMenu from './layers/LayersMenu';
import { RenderTiming } from '@/types/performance';
import { usePerformance } from '@/context/performance';
import HomographyPoints from '@/components/videoPlayer/layers/HomographyPoints';
import { useSport } from '@/context/sport';
import FrameIdx from '@/components/ui/FrameIdx';

interface VideoPlayerProps {
    currentVideo: VideoInfo;
    jsonData: JSONData;
    activeLayers: PadelLayers[] | FootballLayers[];
    statsData: JSONStats;
}

export const VideoPlayer = ({ currentVideo, jsonData, activeLayers, statsData }: VideoPlayerProps) => {
    const frameRequestRef = useRef<number | null>(null);
    const { currentFrame, setCurrentFrame } = useFrame();
    const videoRef = useRef<HTMLVideoElement>(null);
    const mainCanvasRef = useRef<HTMLCanvasElement>(null);
    const persistentCanvasRef = useRef<HTMLCanvasElement>(null);
    const { setMainCanvasRef, setPersistentCanvasRef } = useCanvas();
    const lastDrawnFrame = useRef<number>(-1);
    const { currentSport } = useSport();
    const { setMainTiming, setPersistentTiming } = usePerformance();

    useEffect(() => {
        if (mainCanvasRef.current) {
            setMainCanvasRef(mainCanvasRef);
        }
        if (persistentCanvasRef.current) {
            setPersistentCanvasRef(persistentCanvasRef);
        }
    }, [setMainCanvasRef, setPersistentCanvasRef]);

    const renderLayers = useCallback(() => {
        if (!videoRef.current || !mainCanvasRef.current || !persistentCanvasRef.current) return;
        
        const mainCtx = mainCanvasRef.current.getContext('2d');
        const persistentCtx = persistentCanvasRef.current.getContext('2d');
        
        if (mainCtx && persistentCtx) {
            mainCtx.clearRect(0, 0, mainCanvasRef.current.width, mainCanvasRef.current.height);
            persistentCtx.clearRect(0, 0, persistentCanvasRef.current.width, persistentCanvasRef.current.height);
        }
        
        drawSportElements(
            currentSport,
            jsonData, 
            activeLayers,
            videoRef.current, 
            { 
                mainCanvas: mainCanvasRef.current, 
                persistentCanvas: persistentCanvasRef.current 
            },
            {
                onTimingsUpdate: (main: RenderTiming, persistent: RenderTiming) => {
                    setMainTiming(main);
                    setPersistentTiming(persistent);
                }
            }
        );
    }, [jsonData, activeLayers, setMainTiming, setPersistentTiming, currentSport]);

    const animate = useCallback(() => {
        if (!videoRef.current || !mainCanvasRef.current || !persistentCanvasRef.current) return;
        
        const fps = 25;
        const newFrame = Math.round(videoRef.current.currentTime * fps);
        
        if (newFrame !== lastDrawnFrame.current) {
            lastDrawnFrame.current = newFrame;
            
            if (newFrame !== currentFrame) {
                setCurrentFrame(newFrame);
            }
        }
        
        frameRequestRef.current = requestAnimationFrame(animate);
    }, [currentFrame, setCurrentFrame]);

    useEffect(() => {
        renderLayers();
    }, [currentFrame, renderLayers]);

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
                    className={`w-full ${jsonData.data[currentFrame]?.isPlaying ? 'video-border-point' : 'video-border-interpoint'}`}
                />
                <LayersMenu jsonData={jsonData} />
                <canvas
                    ref={mainCanvasRef}
                    className="absolute top-0 left-0 z-40 pointer-events-none w-full h-full"
                />
                <canvas
                    ref={persistentCanvasRef}
                    className="absolute top-0 left-0 z-40 pointer-events-none w-full h-full"
                />

                <HomographyPoints 
                    videoRef={videoRef as React.RefObject<HTMLVideoElement>} 
                    videoData={jsonData}
                />

                {(jsonData.info.cfg.sport === 'padel' && activeLayers.includes('killfeed')) && (
                    <KillFeed 
                        currentFrame={currentFrame}
                        frameData={jsonData.data[currentFrame] || {}}
                    />
                )}

                <FrameIdx frameIdx={currentFrame} />
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