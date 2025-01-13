import { useEffect } from 'react';
import { useFrame } from '@/context/frame';
import { useVideoPlayer } from './useVideoPlayer';
import { useActiveLayers } from '@/context/layers';

export const useKeyboardShortcuts = (handleFrameChange: (frame: number) => void) => {
    const { currentFrame } = useFrame();
    const { togglePlay } = useVideoPlayer();
    const { toggleActiveLayers } = useActiveLayers();

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            const { key, shiftKey } = event;

            if (['ArrowLeft', 'ArrowRight', ' '].includes(key)) {
                event.preventDefault();
            }

            if (shiftKey && key === 'ArrowLeft') {
                handleFrameChange(currentFrame - 100);
                return;
            }

            if (shiftKey && key === 'ArrowRight') {
                handleFrameChange(currentFrame + 100);
                return;
            }

            switch (key.toLowerCase()) {
                case ' ':
                    togglePlay();
                    break;
                case 'arrowleft':
                    handleFrameChange(currentFrame - 1);
                    break;
                case 'arrowright':
                    handleFrameChange(currentFrame + 1);
                    break;
                case 'h':
                    toggleActiveLayers('homography');
                    break;
                case 'p':
                    toggleActiveLayers('players');
                    break;
                case 'b':
                    toggleActiveLayers('ball');
                    break;
                case 'a':
                    toggleActiveLayers('areas');
                    break;
                case 't':
                    toggleActiveLayers('trajectories');
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentFrame, handleFrameChange, togglePlay, toggleActiveLayers]);
};