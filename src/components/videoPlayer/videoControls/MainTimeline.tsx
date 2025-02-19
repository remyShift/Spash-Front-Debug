import React, { useRef, useEffect, useCallback } from 'react';

interface MainTimelineProps {
    currentTime: number;
    duration: number;
    onTimeChange: (time: number) => void;
    reels?: {
        reel_type: string;
        end_frame: number;
        duration: number;
        end_timecode: number;
    }[];
}

export const MainTimeline = ({ currentTime, duration, onTimeChange, reels }: MainTimelineProps) => {
    const timelineRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const maxDuration = isNaN(duration) ? 0 : duration;
    const currentTimeValue = isNaN(currentTime) ? 0 : currentTime;
    const progressWidth = maxDuration > 0 ? (currentTimeValue / maxDuration) * 100 : 0;

    const maxFocusWindowSeconds = 84; 
    const minFocusWindowSeconds = 50;
    
    const availableTimeAfter = maxDuration - currentTimeValue;
    const availableTimeBefore = currentTimeValue;
    
    const effectiveWindowDuration = Math.min(
        maxFocusWindowSeconds,
        Math.min(
            maxDuration,
            minFocusWindowSeconds + (Math.min(availableTimeBefore, availableTimeAfter) * 2)
        )
    );

    const focusWindowWidth = (effectiveWindowDuration / maxDuration) * 100;
    
    const focusWindowPosition = Math.max(
        0,
        Math.min(
            100 - focusWindowWidth,
            ((currentTimeValue - (effectiveWindowDuration / 2)) / maxDuration) * 100
        )
    );

    const handleTimeChange = useCallback((newTime: number) => {
        const videoElement = document.querySelector('video');
        if (!videoElement) return;
        
        const maxTime = videoElement.duration;
        const clampedTime = Math.min(Math.max(0, newTime), maxTime);
        
        videoElement.currentTime = clampedTime;
        onTimeChange(clampedTime);
    }, [onTimeChange]);

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        handleMouseMove(e.nativeEvent);
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging.current || !timelineRef.current) return;
        
        const rect = timelineRef.current.getBoundingClientRect();
        const position = (e.clientX - rect.left) / rect.width;
        const newTime = position * maxDuration;
        
        if (newTime >= 0 && newTime <= maxDuration) {
            handleTimeChange(newTime);
        }
    }, [maxDuration, handleTimeChange]);

    const handleMouseUp = useCallback(() => {
        isDragging.current = false;
    }, []);

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousemove', handleMouseMove);
        
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [maxDuration, handleMouseMove, handleMouseUp]);

    return (
        <div 
            ref={timelineRef}
            className="relative w-[78%] md:w-[85%] xl:w-[90%] z-0 h-1 bg-lighterBackground rounded-full cursor-pointer"
            onMouseDown={handleMouseDown}
        >
            <div
                className="absolute bottom-0 h-1 bg-primary z-10 rounded-full transition-all"
                style={{ width: `${progressWidth}%` }}
            />
            
            <div 
                className="absolute h-6 -top-2.5 bg-white/10 border border-white/20 transition-all"
                style={{ 
                    width: `${focusWindowWidth}%`,
                    left: `${focusWindowPosition}%`
                }}
            />

            {reels?.map((reel, index) => (
                <div 
                    key={index}
                    className="absolute bottom-0 h-3 z-20"
                    style={{ left: `${(reel.end_timecode / maxDuration) * 100}%` }}
                >
                    <div className="w-1 h-full bg-yellow-500 rounded-full" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-1 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 hover:opacity-100 hover:z-[999999] z-30 transition-opacity duration-200">
                        {reel.reel_type}
                    </div>
                </div>
            ))}
        </div>
    );
}; 