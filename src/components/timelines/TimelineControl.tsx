import { faBackwardStep, faForwardStep } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFrame } from "@/context/frame";
import { useRef, useEffect, useCallback } from "react";
import { useActiveTimeline } from "@/context/timeline";

export default function TimelineControl({ event, framesEvent }: { event: string, framesEvent: number[] }) {
    const { currentFrame, setCurrentFrame } = useFrame();
    const { activeTimeline, setActiveTimeline } = useActiveTimeline();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const FPS = 25;

    useEffect(() => {
        videoRef.current = document.querySelector('video');
    }, []);

    const updateVideoTime = useCallback((frame: number) => {
        if (videoRef.current) {
            const timeInSeconds = frame / FPS;
            videoRef.current.currentTime = timeInSeconds;
        }
    }, [videoRef]);

    const goToPreviousEvent = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.pause();
            const previousFrame = [...framesEvent].reverse().find(frame => frame < currentFrame);
            if (previousFrame) {
                setCurrentFrame(previousFrame).then(() => {
                    updateVideoTime(previousFrame);
                });
            }
        }
    }, [currentFrame, framesEvent, updateVideoTime, setCurrentFrame]);

    const goToNextEvent = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.pause();
            const nextFrame = [...framesEvent].find(frame => frame > currentFrame);
            if (nextFrame) {
                setCurrentFrame(nextFrame).then(() => {
                    updateVideoTime(nextFrame);
                });
            }
        }
    }, [currentFrame, framesEvent, updateVideoTime, setCurrentFrame]);

    useEffect(() => {
        const handleTimelineNavigation = (e: CustomEvent<{ direction: string }>) => {
            if (activeTimeline === event) {
                if (e.detail.direction === 'previous') {
                    goToPreviousEvent();
                } else {
                    goToNextEvent();
                }
            }
        };

        window.addEventListener('timelineNavigation', handleTimelineNavigation as EventListener);
        return () => window.removeEventListener('timelineNavigation', handleTimelineNavigation as EventListener);
    }, [activeTimeline, event, currentFrame, goToPreviousEvent, goToNextEvent]);

    const handleClick = () => {
        if (activeTimeline === event) {
            setActiveTimeline(null);
        } else {
            setActiveTimeline(event);
        }
    };

    const isActive = activeTimeline === event;

    return (
        <div className="flex justify-between items-center h-full w-[30%] md:w-[25%] xl:w-[20%] gap-0 md:gap-2 px-4">
            <button onClick={goToPreviousEvent}>
                <FontAwesomeIcon icon={faBackwardStep} className="text-primary text-xs md:text-base lg:text-xl" />
            </button>

            <button 
                className={`font-semibold text-sm md:text-base lg:text-xl hover:text-primary hover:scale-105 transition-all duration-300 ${isActive ? 'text-primary underline' : 'text-white'}`}
                onClick={handleClick}
            >
                {event}
            </button>

            <button onClick={goToNextEvent}>
                <FontAwesomeIcon icon={faForwardStep} className="text-primary text-xs md:text-base lg:text-xl" />
            </button>
        </div>
    );
}