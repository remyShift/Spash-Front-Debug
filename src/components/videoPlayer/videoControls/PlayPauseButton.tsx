import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

interface PlayPauseButtonProps {
    isPlaying: boolean;
    onToggle: () => void;
}

export const PlayPauseButton = ({ isPlaying, onToggle }: PlayPauseButtonProps) => {
    return (
        <button 
            onClick={onToggle}
            className="text-white hover:text-primary transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
        >
            <FontAwesomeIcon 
                icon={isPlaying ? faPause : faPlay} 
                size="lg" 
            />
        </button>
    );
};