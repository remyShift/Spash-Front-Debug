import { useFrame } from "@/context/frame";
import { useVideoPlayer } from "@/hooks/useVideoPlayer";
import { useRef, useEffect } from "react";
import { JSONData } from "@/types/files";
import { drawElements } from "@/utils/drawing/drawElements";
import { useActiveLayers } from "@/context/layers";
import ToolBoxBtns from "./ToolBoxControls";


export default function ToolBox({ videoData }: { videoData: JSONData }) {
    const { currentFrame, setCurrentFrame } = useFrame();
    const { isVideoPlaying, togglePlay } = useVideoPlayer();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { activeLayers } = useActiveLayers();

    useEffect(() => {
        videoRef.current = document.querySelector('video');
    }, []);

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
                setCurrentFrame
            );
        }
    }

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
    
    return (
        <div className="flex flex-col">
            <div className="w-fit px-3 h-8 bg-primary rounded-t-md flex items-center justify-center">
                <p className="text-white font-semibold text-base">Tools</p>
            </div>

            <div className="w-full h-36 bg-lightBackground rounded-tr-lg flex flex-col items-center p-3">
                <div className="flex flex-col gap-8 items-center justify-center">
                    <div className="flex gap-4 items-center">
                        <p className="text-white font-semibold text-base">Frame ID : {currentFrame}</p>
                        <form className="flex gap-2 items-center" onSubmit={handleSubmit}>
                            <input type="number" className="w-24 h-6 bg-lighterBackground rounded-md p-2 text-center text-white font-semibold text-base" />
                            <button className="bg-primary text-white font-semibold text-base rounded-md px-2 active:bg-primary/80 transition-all duration-200" type="submit">Go</button>
                        </form>
                    </div>

                    <ToolBoxBtns handleFrameChange={handleFrameChange} currentFrame={currentFrame} isVideoPlaying={isVideoPlaying} togglePlay={togglePlay} />
                </div>
            </div>

            <div className="w-full h-[3px] bg-lighterBackground"></div>
        </div>
    )
}
