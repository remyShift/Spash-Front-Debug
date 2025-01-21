interface MainTimelineProps {
    currentTime: number;
    duration: number;
    onTimeChange: (time: number) => void;
}

export const MainTimeline = ({ currentTime, duration, onTimeChange }: MainTimelineProps) => {
    return (
        <div className="relative w-full h-2 bg-gray-700 rounded-full">
            <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(e) => onTimeChange(parseFloat(e.target.value))}
                className="absolute w-full h-full opacity-0 cursor-pointer"
            />
            <div 
                className="absolute h-full bg-primary rounded-full transition-all"
                style={{ width: `${(currentTime / duration) * 100}%` }}
            />
        </div>
    );
}; 