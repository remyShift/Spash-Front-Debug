import { faBackward, faBackwardStep, faForward, faForwardStep, faMagnifyingGlass, faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useRef } from 'react'
import ControlBtn from './ControlBtn';
import { useActiveLayers } from '@/context/layers';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';
import { useFrame } from '@/context/frame';
import { drawElements } from '@/utils/drawing/drawElements';
import { JSONData } from '@/types/files';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export default function ToolBoxControls({ videoData }: { videoData: JSONData }) {
    const { currentFrame, setCurrentFrame } = useFrame();
    const { isVideoPlaying, togglePlay } = useVideoPlayer();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { activeLayers } = useActiveLayers();

    useEffect(() => {
        videoRef.current = document.querySelector('video');
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const input = target.querySelector('input');
        const frameId = input?.value;
        
        if (frameId) {
            const frameNumber = parseInt(frameId);
            handleFrameChange(frameNumber);
            if (input) {
                input.value = '';
            }
        }
    }
    
    const handleFrameChange = (frameNumber: number) => {
        if (videoRef.current) {
            setCurrentFrame(frameNumber);
            const fps = 25;
            const timeInSeconds = frameNumber / fps;
            videoRef.current.currentTime = timeInSeconds;
    
            const frameData = videoData?.data[frameNumber];
            if (!frameData) return;
            if (!canvasRef.current) return;
    
            drawElements(
                videoData,
                activeLayers,
                videoRef.current,
                canvasRef.current,
            );
        }
    }

    useKeyboardShortcuts(handleFrameChange);

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex gap-4 items-center justify-center">
                <p className="text-white font-semibold text-base">Frame ID : {currentFrame}</p>
                <form className="flex gap-2 items-center" onSubmit={handleSubmit}>
                    <input type="number" step={10} className="w-24 h-6 bg-lighterBackground rounded-md p-2 text-center text-white font-semibold text-base outline-none border-none focus:ring-primary focus:ring-1" />
                    <button className="bg-primary text-white font-semibold text-base rounded-md flex items-center justify-center px-2 py-1 active:bg-primary/80 transition-all duration-200" type="submit">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </form>
            </div>
            <div className="flex gap-4 items-center justify-center">
                <ControlBtn icon={faBackward} onClick={() => handleFrameChange(currentFrame - 100)} text="-100" />
                <ControlBtn icon={faBackwardStep} onClick={() => handleFrameChange(currentFrame - 1)} text="-1" />
                <ControlBtn icon={isVideoPlaying ? faPause : faPlay} onClick={togglePlay} text={isVideoPlaying ? "Pause" : "Play"} />
                <ControlBtn icon={faForwardStep} onClick={() => handleFrameChange(currentFrame + 1)} text="+1" />
                <ControlBtn icon={faForward} onClick={() => handleFrameChange(currentFrame + 100)} text="+100" />
            </div>
        </div>
    )
}
