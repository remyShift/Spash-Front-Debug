import EventMarker from "../ui/EventMarker";
import TimelineControl from "./TimelineControl";
import { useFrame } from "@/context/frame";
import { useEffect, useRef } from "react";
import { Event } from "@/types/events";

const TIMELINE_DURATION = 300;
const FPS = 25;

export default function Timeline({ event, framesEvent }: { event: Event; framesEvent: number[] }) {
    const { currentFrame } = useFrame();
    const timelineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentTimeInSeconds = currentFrame / FPS;
        const newOffset = (currentTimeInSeconds / TIMELINE_DURATION) * 100;

        if (timelineRef.current) {
            timelineRef.current.style.transform = `translateX(-${newOffset}%)`;
        }
    }, [currentFrame]);

    const calculateMarkerPosition = (frame: number): string => {
        if (!timelineRef.current) return '';

        const frameTime = frame / FPS;
        const markerWidth = 11;
        const containerWidth = timelineRef.current.clientWidth;
        const percentageOffset = (markerWidth / 2 / containerWidth) * 100;
        const position = (frameTime / TIMELINE_DURATION) * 100;

        return `calc(${position}% - ${percentageOffset}%)`;
    };

    return (
        <div className="w-full h-9 bg-lightBackground rounded-lg overflow-hidden">
            <div className="flex items-center w-full h-full gap-0">
                <TimelineControl event={event.charAt(0).toUpperCase() + event.slice(1)} framesEvent={framesEvent} />
                <div className="w-[2px] h-full bg-lighterBackground"></div>

                <div className="flex items-end w-full h-full pb-3 overflow-hidden">
                    <div className="flex flex-col gap-0 w-full relative">
                        <div className="absolute -top-4 w-[300%] z-50"
                                ref={timelineRef}
                                style={{ left: '50%' }}>
                            {framesEvent.map((frame) => (
                                <div 
                                    key={frame}
                                    className="absolute"
                                    style={{ left: calculateMarkerPosition(frame) }}
                                >
                                    <EventMarker event={event}/>
                                </div>
                            ))}
                        </div>
                        <div className="w-full h-[3px] bg-lighterBackground"></div>
                        <div className="w-[2px] h-[15px] bg-secondary absolute z-0 left-1/2 -top-[5px] -translate-x-1/2"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
