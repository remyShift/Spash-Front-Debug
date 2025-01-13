import { faBackwardStep, faForwardStep } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFrame } from "@/context/frame";

export default function TimelineControl({ event, frames }: { event: string, frames: number[] }) {
    const { currentFrame, setCurrentFrame } = useFrame();

    const goToPreviousEvent = () => {
        const previousFrame = frames.reverse().find(frame => frame < currentFrame);
        if (previousFrame) setCurrentFrame(previousFrame);
    };

    const goToNextEvent = () => {
        const nextFrame = frames.find(frame => frame > currentFrame);
        if (nextFrame) setCurrentFrame(nextFrame);
    };

    return (
        <div className="flex justify-between items-center h-full w-[18%] gap-2 px-4">
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