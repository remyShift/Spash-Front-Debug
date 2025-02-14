import { useFrame } from "@/context/frame";
import { useEffect, useRef, useState, useCallback } from "react";
import { TimelineInterval } from "@/types/events";
import TimelineControl from "./TimelineControl";
import TimelineUI from "./TimelineUI";
import { JSONData } from "@/types/files";
import { Event } from "@/types/events";

const TIMELINE_DURATION = 300;
const FPS = 25;
const VISIBLE_WINDOW = 60;
const BUFFER_WINDOW = 30;

export default function TimelineChronology({ timeline, jsonData }: { timeline: TimelineInterval[], jsonData: JSONData["data"] }) {
    const { currentFrame } = useFrame();
    const timelineRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [visibleIntervals, setVisibleIntervals] = useState<TimelineInterval[]>([]);
    const [title, setTitle] = useState<string>('');

    const updateTimelinePosition = useCallback((currentTimeInSeconds: number) => {
        const newOffset = (currentTimeInSeconds / TIMELINE_DURATION) * 100;
        if (timelineRef.current) {
            timelineRef.current.style.transform = `translateX(-${newOffset}%)`;
        }
    }, []);

    const updateVisibleIntervals = useCallback((currentTimeInSeconds: number) => {
        const startWindow = Math.max(0, currentTimeInSeconds - VISIBLE_WINDOW - BUFFER_WINDOW);
        const endWindow = currentTimeInSeconds + VISIBLE_WINDOW + BUFFER_WINDOW;

        const visible = timeline.filter(interval => {
            const startTime = interval.start / FPS;
            const endTime = interval.end / FPS;
            return (startTime >= startWindow && startTime <= endWindow) || 
                    (endTime >= startWindow && endTime <= endWindow) ||
                    (startTime <= startWindow && endTime >= endWindow);
        });

        setVisibleIntervals(visible);
    }, [timeline]);

    useEffect(() => {
        const updateContainerWidth = () => {
            if (timelineRef.current) {
                setContainerWidth(timelineRef.current.clientWidth);
            }
        };

        updateContainerWidth();
        window.addEventListener('resize', updateContainerWidth);

        return () => {
            window.removeEventListener('resize', updateContainerWidth);
        };
    }, []);

    useEffect(() => {
        const currentTimeInSeconds = currentFrame / FPS;
        updateTimelinePosition(currentTimeInSeconds);
        updateVisibleIntervals(currentTimeInSeconds);
    }, [currentFrame, updateTimelinePosition, updateVisibleIntervals]);

    useEffect(() => {
        setTitle(jsonData[currentFrame]?.isPlaying ? 'Point' : 'InterPoint');
    }, [currentFrame, jsonData]);

    const calculateIntervalPosition = (start: number): string => {
        if (!containerWidth) return '';
        const frameTime = start / FPS;
        const position = (frameTime / TIMELINE_DURATION) * 100;
        return `${position}%`;
    };

    const calculateIntervalWidth = (start: number, end: number): string => {
        const duration = end - start;
        const widthPercentage = (duration / (TIMELINE_DURATION * FPS)) * 100;
        return `${widthPercentage}%`;
    };

    const isIntervalActive = (start: number, end: number): boolean => {
        const startTimeInSeconds = start / FPS;
        const endTimeInSeconds = end / FPS;
        const currentTimeInSeconds = currentFrame / FPS;
        return currentTimeInSeconds >= startTimeInSeconds && currentTimeInSeconds <= endTimeInSeconds;
    };

    return (
        <div className="w-full h-9 bg-lightBackground rounded-lg overflow-hidden">
            <div className="flex items-center w-full h-full gap-0">
                <TimelineControl event={title as Event} framesEvent={timeline.map((interval) => interval.start)} jsonData={jsonData} />
                <div className="w-[2px] h-full bg-lighterBackground"></div>

                <div className="flex items-end w-full h-full pb-3 overflow-hidden">
                    <div className="flex flex-col gap-0 w-full relative">
                        <div className="absolute -top-6 w-[300%] z-0"
                                ref={timelineRef}
                                style={{ left: '50%' }}>
                            {containerWidth > 0 && visibleIntervals.map((interval) => (
                                <div 
                                    key={`${interval.start}-${interval.end}`}
                                    className={`absolute h-10 transition-opacity duration-200 ${interval.type === 'Point' ? 'bg-point-gradient' : 'bg-inter-point-gradient'}`}
                                    style={{ 
                                        left: calculateIntervalPosition(interval.start),
                                        width: calculateIntervalWidth(interval.start, interval.end),
                                        opacity: isIntervalActive(interval.start, interval.end) ? '1' : '0.5'
                                    }}
                                />
                            ))}
                        </div>
                        <TimelineUI />
                    </div>
                </div>
            </div>
        </div>
    );
}
