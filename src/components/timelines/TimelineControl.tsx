import { faBackwardStep, faForwardStep } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFrame } from "@/context/frame";
import { useRef, useEffect, useCallback } from "react";
import { useActiveTimeline } from "@/context/timeline";
import { useMode } from "@/context/mode";
import { usePlayersFilters } from "@/context/playersFilters";
import { filterEventsByPlayers } from "@/utils/filterEventsByPlayers";
import { JSONData } from "@/types/files";
import { Event } from "@/types/events";

interface TimelineControlProps {
    event: Event;
    framesEvent: number[];
    jsonData: JSONData["data"];
}

export default function TimelineControl({ event, framesEvent, jsonData }: TimelineControlProps) {
    const { currentFrame, setCurrentFrame } = useFrame();
    const { activeTimeline, setActiveTimeline } = useActiveTimeline();
    const { playersFilters } = usePlayersFilters();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const { mode } = useMode();

    const FPS = 25; 
    const delayEvent = mode === 'dev' ? 0 : 1;

    const getFilteredFrames = useCallback(() => {
        return framesEvent.filter(frame => 
            filterEventsByPlayers(frame, event, jsonData, playersFilters)
        );
    }, [framesEvent, event, jsonData, playersFilters]);

    useEffect(() => {
        videoRef.current = document.querySelector('video');
    }, []);

    // const updateVideoTime = useCallback((frame: number) => {
    //     if (videoRef.current) {
    //         const timeInSeconds = frame / FPS;
    //         videoRef.current.currentTime = timeInSeconds - delayEvent;
    //     }
    // }, [videoRef, delayEvent]);

    const goToPreviousEvent = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.pause();
            const filteredFrames = getFilteredFrames();
            const previousFrame = [...filteredFrames].reverse().find(frame => frame < currentFrame);
            if (previousFrame) {
                const adjustedFrame = previousFrame + (mode === 'dev' ? 0 : FPS);
                setCurrentFrame(adjustedFrame).then(() => {
                    const timeInSeconds = previousFrame / FPS;
                    videoRef.current!.currentTime = timeInSeconds - delayEvent;
                });
            }
        }
    }, [currentFrame, getFilteredFrames, setCurrentFrame, FPS, mode, delayEvent]);

    const goToNextEvent = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.pause();
            const filteredFrames = getFilteredFrames();
            const nextFrame = filteredFrames.find(frame => frame > currentFrame);
            if (nextFrame) {
                const adjustedFrame = nextFrame + (mode === 'dev' ? 0 : FPS);
                setCurrentFrame(adjustedFrame).then(() => {
                    const timeInSeconds = nextFrame / FPS;
                    videoRef.current!.currentTime = timeInSeconds - delayEvent;
                });
            }
        }
    }, [currentFrame, getFilteredFrames, setCurrentFrame, FPS, mode, delayEvent]);

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
                {event.charAt(0).toUpperCase() + event.slice(1)}
            </button>

            <button onClick={goToNextEvent}>
                <FontAwesomeIcon icon={faForwardStep} className="text-primary text-xs md:text-base lg:text-xl" />
            </button>
        </div>
    );
}