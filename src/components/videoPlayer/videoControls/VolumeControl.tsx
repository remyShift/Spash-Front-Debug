import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons';

interface VolumeControlProps {
    volume: number;
    onVolumeChange: (value: number) => void;
}

export const VolumeControl = ({ volume, onVolumeChange }: VolumeControlProps) => {
    return (
        <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faVolumeHigh} className="text-white" />
            <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-24 accent-primary"
                aria-label="Volume"
            />
        </div>
    );
};