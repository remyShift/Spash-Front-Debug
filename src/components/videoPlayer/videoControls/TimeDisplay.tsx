interface TimeDisplayProps {
    currentTime: number;
    duration: number;
}

export const TimeDisplay = ({ currentTime, duration }: TimeDisplayProps) => {
    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="text-white text-xs">
            {formatTime(currentTime)} / {formatTime(duration)}
        </div>
    );
}; 