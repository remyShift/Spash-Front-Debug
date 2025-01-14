import { useFrame } from "@/context/frame";
import { useEffect, useRef, useState } from "react";
import { TimelineInterval } from "@/types/events";
import TimelineControl from "./TimelineControl";

const TIMELINE_DURATION = 300;
const FPS = 25;

export default function TimelineChronology({ timeline }: { timeline: TimelineInterval[] }) {
    const { currentFrame } = useFrame();
    const timelineRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number>(0);

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
        const newOffset = (currentTimeInSeconds / TIMELINE_DURATION) * 100;

        if (timelineRef.current) {
            timelineRef.current.style.transform = `translateX(-${newOffset}%)`;
        }
    }, [currentFrame]);

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

    return (
        <div className="w-full h-9 bg-lightBackground rounded-lg overflow-hidden">
            <div className="flex items-center w-full h-full gap-0">
                <TimelineControl event="Timeline" framesEvent={timeline.map((interval) => interval.start)} />
                <div className="w-[2px] h-full bg-lighterBackground"></div>

                <div className="flex items-end w-full h-full pb-3 overflow-hidden">
                    <div className="flex flex-col gap-0 w-full relative">
                        <div className="absolute -top-6 w-[300%] z-0"
                                ref={timelineRef}
                                style={{ left: '50%' }}>
                            {containerWidth > 0 && timeline.map((interval) => (
                                <div 
                                    key={`${interval.start}-${interval.end}`}
                                    className={`absolute h-10 ${interval.type === 'Point' ? 'bg-customGradient' : 'bg-transparent'}`}
                                    style={{ 
                                        left: calculateIntervalPosition(interval.start),
                                        width: calculateIntervalWidth(interval.start, interval.end)
                                    }}
                                />
                            ))}
                        </div>
                        <div className="w-full h-[3px] bg-lighterBackground"></div>
                        <div className="w-[2px] h-[15px] bg-yellow-500 absolute z-50 left-1/2 -top-[5px] -translate-x-1/2"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
