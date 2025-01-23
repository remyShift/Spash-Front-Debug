import { faBackward, faBackwardFast, faBackwardStep, faForward, faForwardFast, faForwardStep, faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import React, { useRef, useEffect } from 'react'
import ControlBtn from './ControlBtn';
import { useActiveLayers } from '@/context/layers';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';
import { useFrame } from '@/context/frame';
import { drawElements } from '@/utils/drawing/drawElements';
import { JSONData } from '@/types/files';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useCanvas } from '@/context/canvas';
import GotoFrame from './GotoFrame';
import GotoPlayer from './GotoPlayer';

export default function ToolBoxControls({ videoData }: { videoData: JSONData }) {
    const { currentFrame, setCurrentFrame } = useFrame();
    const { isVideoPlaying, togglePlay } = useVideoPlayer();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const { mainCanvasRef, persistentCanvasRef } = useCanvas();
    const { activeLayers } = useActiveLayers();

    useEffect(() => {
        videoRef.current = document.querySelector('video');
    }, []);

    const handleFrameChange = async (frameNumber: number) => {
        if (!mainCanvasRef?.current || !persistentCanvasRef?.current || !videoRef.current) return;

        const maxFrame = Object.keys(videoData.data).length - 1;
        const safeFrame = Math.max(0, Math.min(Math.round(frameNumber), maxFrame));
        
        const fps = 25;
        const timeInSeconds = safeFrame / fps;
        
        if (safeFrame === maxFrame) {
            videoRef.current.pause();
        }
        
        if (safeFrame === 0) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            await setCurrentFrame(0);
        } else {
            videoRef.current.currentTime = timeInSeconds;
            await setCurrentFrame(safeFrame);
        }
        
        const frameData = videoData?.data[safeFrame];
        if (!frameData) return;
        
        drawElements(
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
            <div className="flex gap-4 items-center justify-center">
                <ControlBtn icon={faBackwardFast} onClick={() => handleFrameChange(0)} text="Start" />
                <ControlBtn icon={faBackward} onClick={() => handleFrameChange(currentFrame - 100)} text="-100" />
                <ControlBtn icon={faBackwardStep} onClick={() => handleFrameChange(currentFrame - 1)} text="-1" />
                <ControlBtn icon={isVideoPlaying ? faPause : faPlay} onClick={togglePlay} text={isVideoPlaying ? "Pause" : "Play"} />
                <ControlBtn icon={faForwardStep} onClick={() => handleFrameChange(currentFrame + 1)} text="+1" />
                <ControlBtn icon={faForward} onClick={() => handleFrameChange(currentFrame + 100)} text="+100" />
                <ControlBtn icon={faForwardFast} onClick={() => handleFrameChange(Object.keys(videoData.data).length - 1)} text="End" />
            </div>
        </div>
    )
}
