import { faBackwardStep, faForwardStep } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFrame } from "@/context/frame";
import { useRef, useEffect, useState } from "react";

export default function TimelineControl({ event, framesEvent }: { event: string, framesEvent: number[] }) {
    const { currentFrame, setCurrentFrame } = useFrame();
    const [isActive, setIsActive] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const FPS = 25;

    useEffect(() => {
        videoRef.current = document.querySelector('video');
    }, []);

    const updateVideoTime = (frame: number) => {
        if (videoRef.current) {
            const timeInSeconds = frame / FPS;
            videoRef.current.currentTime = timeInSeconds;
        }
    };

    const goToPreviousEvent = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            const previousFrame = [...framesEvent].reverse().find(frame => frame < currentFrame);
            if (previousFrame) {
                setCurrentFrame(previousFrame).then(() => {
                    updateVideoTime(previousFrame);
                });
            }
        }
    };

    const goToNextEvent = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            const nextFrame = [...framesEvent].find(frame => frame > currentFrame);
            if (nextFrame) {
                setCurrentFrame(nextFrame).then(() => {
                    updateVideoTime(nextFrame);
                });
            }
        }
    };

    return (
        <div className="flex justify-between items-center h-full w-[20%] gap-2 px-4">
            <button onClick={goToPreviousEvent}>
                <FontAwesomeIcon icon={faBackwardStep} className="text-secondary text-xl" />
            </button>

            <button className={`font-semibold text-xl hover:text-primary hover:scale-105 transition-all duration-300 ${isActive ? 'text-primary underline' : 'text-white'}`}
                onClick={() => {
                    setIsActive(!isActive);
                }}
            >
                {event}
            </button>

            <button onClick={goToNextEvent}>
                <FontAwesomeIcon icon={faForwardStep} className="text-secondary text-xl" />
            </button>
        </div>
    );
}