interface PlaybackSpeedProps {
    speed: number;
    onSpeedChange: (speed: number) => void;
}

export const PlaybackSpeed = ({ speed, onSpeedChange }: PlaybackSpeedProps) => {
    const speeds = [0.25, 0.5, 1, 1.5, 2];

    return (
        <select
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="bg-lighterBackground text-white rounded p-1 outline-none focus:ring-1 focus:ring-primary"
        >
            {speeds.map((value) => (
                <option key={value} value={value}>
                    x{value}
                </option>
            ))}
        </select>
    );
}; 