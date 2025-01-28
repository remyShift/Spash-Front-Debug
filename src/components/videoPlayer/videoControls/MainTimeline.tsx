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
    const maxDuration = isNaN(duration) ? 0 : duration;
    const currentTimeValue = isNaN(currentTime) ? 0 : currentTime;
    const progressWidth = maxDuration > 0 ? (currentTimeValue / maxDuration) * 100 : 0;

    return (
        <div className="relative w-[78%] md:w-[87%] xl:w-[92%] h-1 bg-lighterBackground rounded-full">
            <input
                type="range"
                min="0"
                max={maxDuration.toString()}
                value={currentTimeValue}
                onChange={(e) => onTimeChange(parseFloat(e.target.value))}
                className="absolute w-full h-full opacity-0 cursor-pointer z-20"
            />
            <div 
                className="absolute h-full bg-primary rounded-full transition-all"
                style={{ width: `${progressWidth}%` }}
            />
            {reels?.map((reel, index) => (
                <div 
                    key={index}
                    className="absolute top-1/2 -translate-y-1/2 z-10"
                    style={{ left: `${(reel.end_timecode / maxDuration) * 100}%` }}
                >
                    <div className="w-1 h-4 bg-yellow-500 rounded-full group-hover:opacity-100" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-1 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap">
                        {reel.reel_type}
                    </div>
                </div>
            ))}
        </div>
    );
}; 