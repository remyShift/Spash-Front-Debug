import { useEffect } from 'react';
import { useFrame } from '@/context/frame';
import { useVideoPlayer } from './useVideoPlayer';

export const useKeyboardShortcuts = (handleFrameChange: (frame: number) => void) => {
    const { currentFrame } = useFrame();
    const { togglePlay } = useVideoPlayer();

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

            switch (key) {
                case ' ':
                    togglePlay();
                    break;
                case 'ArrowLeft':
                    handleFrameChange(currentFrame - 1);
                    break;
                case 'ArrowRight':
                    handleFrameChange(currentFrame + 1);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentFrame, handleFrameChange, togglePlay]);
};