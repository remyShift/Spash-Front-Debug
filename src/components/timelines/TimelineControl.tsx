import { faBackwardStep, faForwardStep } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFrame } from "@/context/frame";
import { useRef, useEffect } from "react";

export default function TimelineControl({ event, framesEvent }: { event: string, framesEvent: number[] }) {
    const { currentFrame, setCurrentFrame } = useFrame();
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
        const previousFrame = [...framesEvent].reverse().find(frame => frame < currentFrame);
        if (previousFrame) {
            setCurrentFrame(previousFrame).then(() => {
                updateVideoTime(previousFrame);
            });
        }
    };

    const goToNextEvent = () => {
        const nextFrame = [...framesEvent].find(frame => frame > currentFrame);
        if (nextFrame) {
            setCurrentFrame(nextFrame).then(() => {
                updateVideoTime(nextFrame);
            });
        }
    };

    return (
        <div className="flex justify-between items-center h-full w-[20%] gap-2 px-4">
            <button onClick={goToPreviousEvent}>
                <FontAwesomeIcon icon={faBackwardStep} className="text-secondary text-xl" />
            </button>
            <h2 className="text-white font-semibold text-xl">{event}</h2>
            <button onClick={goToNextEvent}>
                <FontAwesomeIcon icon={faForwardStep} className="text-secondary text-xl" />
            </button>
        </div>
    );
}