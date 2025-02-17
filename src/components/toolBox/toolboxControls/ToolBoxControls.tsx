import { faBackward, faBackwardFast, faBackwardStep, faForward, faForwardFast, faForwardStep, faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import React, { useRef, useEffect } from 'react'
import ControlBtn from './ControlBtn';
import { useActiveLayers } from '@/context/layers';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';
import { useFrame } from '@/context/frame';
import { JSONData } from '@/types/files';
import { drawSportElements } from '@/utils/drawing/drawSportElements';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useCanvas } from '@/context/canvas';
import GotoFrame from './GotoFrame';
import GotoPlayer from './GotoPlayer';
import { useHomographyPoints } from '@/context/homographyPoints';
import { useHomographyPointsDrag } from '@/hooks/useHomographyPointsDrag';
import { useSport } from '@/context/sport';

export default function ToolBoxControls({ videoData }: { videoData: JSONData }) {
    const { currentFrame, setCurrentFrame } = useFrame();
    const { isVideoPlaying, togglePlay } = useVideoPlayer();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const { mainCanvasRef, persistentCanvasRef } = useCanvas();
    const { activeLayers } = useActiveLayers();
    const { currentSport } = useSport();
    const { homographyPoints, setHomographyPoints } = useHomographyPoints();
    const {
        selectedPoint,
        handlePointSelect,
        handlePointMove,
        handlePointRelease
    } = useHomographyPointsDrag(setHomographyPoints);

    useEffect(() => {
        videoRef.current = document.querySelector('video');
    }, []);

    useEffect(() => {
        if (!mainCanvasRef?.current || !activeLayers.includes('homography')) return;

        const canvas = mainCanvasRef.current;
        const scaleX = canvas.width / (videoRef.current?.videoWidth || 0);
        const scaleY = canvas.height / (videoRef.current?.videoHeight || 0);

        const handleMouseDown = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left);
            const mouseY = (e.clientY - rect.top);

            Object.entries(homographyPoints).forEach(([key, point]) => {
                const [px, py] = point.camera;
                const scaledX = px * scaleX;
                const scaledY = py * scaleY;
                const distance = Math.sqrt(
                    Math.pow(mouseX - scaledX, 2) + 
                    Math.pow(mouseY - scaledY, 2)
                );
                if (distance < 10) {
                    handlePointSelect(key);
                }
            });
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left) / scaleX;
            const mouseY = (e.clientY - rect.top) / scaleY;
            
            if (selectedPoint) {
                handlePointMove(selectedPoint, mouseX, mouseY);
            }
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handlePointRelease);
        canvas.addEventListener('mouseleave', handlePointRelease);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handlePointRelease);
            canvas.removeEventListener('mouseleave', handlePointRelease);
        };
    }, [mainCanvasRef, activeLayers, homographyPoints, selectedPoint, handlePointSelect, handlePointMove, handlePointRelease]);

    const handleFrameChange = async (frameNumber: number) => {
        if (!mainCanvasRef?.current || !persistentCanvasRef?.current || !videoRef.current) return;

        const fps = 25;
        const totalVideoFrames = Math.floor(videoRef.current.duration * fps);
        
        const safeFrame = Math.min(Math.max(0, frameNumber), totalVideoFrames);
        
        videoRef.current.currentTime = safeFrame / fps;

        const availableFrames = Object.keys(videoData.data).map(Number).sort((a, b) => a - b);
        const closestFrame = availableFrames.reduce((prev, curr) => {
            return Math.abs(curr - safeFrame) < Math.abs(prev - safeFrame) ? curr : prev;
        });
        
        await setCurrentFrame(closestFrame);
        
        drawSportElements(
            currentSport,
            videoData,
            activeLayers,
            videoRef.current,
            { 
                mainCanvas: mainCanvasRef.current!, 
                persistentCanvas: persistentCanvasRef.current! 
            },
        );
    }

    useKeyboardShortcuts(handleFrameChange);

    return (
        <div className="flex flex-col gap-6 p-6">
            <GotoFrame handleFrameChange={handleFrameChange} videoData={videoData}/>
            <GotoPlayer handleFrameChange={handleFrameChange} videoData={videoData}/>
            <div className="flex gap-4 items-center justify-center px-4">
                <div className="flex flex-wrap 2xl:flex-nowrap w-auto lg:flex-col lg:w-1/2 xl:flex-row xl:w-auto gap-4 items-center">
                    <ControlBtn icon={faBackwardFast} onClick={() => handleFrameChange(0)} text="Start" />
                    <ControlBtn icon={faBackward} onClick={() => handleFrameChange(currentFrame - 100)} text="-100" />
                    <ControlBtn icon={faBackwardStep} onClick={() => handleFrameChange(currentFrame - 1)} text="-1" />
                    <ControlBtn icon={isVideoPlaying ? faPause : faPlay} onClick={togglePlay} text={isVideoPlaying ? "Pause" : "Play"} />
                </div>
                <div className="flex flex-wrap 2xl:flex-nowrap w-auto lg:flex-col lg:w-1/2 xl:flex-row xl:w-auto gap-4 items-center">
                    <ControlBtn icon={faForwardStep} onClick={() => handleFrameChange(currentFrame + 1)} text="+1" />
                    <ControlBtn icon={faForward} onClick={() => handleFrameChange(currentFrame + 100)} text="+100" />
                    <ControlBtn icon={faForwardFast} onClick={() => {
                        if (videoRef.current) {
                            const totalFrames = Math.floor(videoRef.current.duration * 25);
                            handleFrameChange(totalFrames);
                        }
                    }} text="End" />
                </div>
            </div>
        </div>
    )
}
