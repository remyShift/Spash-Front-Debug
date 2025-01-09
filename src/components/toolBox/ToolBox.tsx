import { useFrame } from "@/context/frame";
import { useRef, useEffect } from "react";

export default function ToolBox() {
    const { currentFrame, setCurrentFrame } = useFrame();
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        videoRef.current = document.querySelector('video');
    }, []);

    const handleFrameChange = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const input = target.querySelector('input');
        const frameId = input?.value;
        
        if (frameId && videoRef.current) {
            const frameNumber = parseInt(frameId);
            setCurrentFrame(frameNumber);
            const fps = 25;
            const timeInSeconds = frameNumber / fps;
            videoRef.current.currentTime = timeInSeconds;
            
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
                <div className="flex gap-4 items-center">
                    <p className="text-white font-semibold text-base">Frame ID : {currentFrame}</p>
                    <form className="flex gap-2 items-center" onSubmit={handleFrameChange}>
                        <input type="number" className="w-24 h-6 bg-lighterBackground rounded-md p-2 text-center text-white font-semibold text-base" />
                        <button className="bg-primary text-white font-semibold text-base rounded-md px-2" type="submit">Go</button>
                    </form>
                </div>
            </div>

            <div className="w-full h-[3px] bg-lighterBackground"></div>
        </div>
    )
}
