import { useEffect } from 'react';
import { useFrame } from '@/context/frame';
import { useVideoPlayer } from './useVideoPlayer';
import { useActiveLayers } from '@/context/layers';
import { useActiveTimeline } from '@/context/timeline';
import { useMode } from '@/context/mode';

export const useKeyboardShortcuts = (handleFrameChange: (frame: number) => void) => {
    const { currentFrame } = useFrame();
    const { togglePlay } = useVideoPlayer();
    const { toggleActiveLayers } = useActiveLayers();
    const { activeTimeline } = useActiveTimeline();
    const { mode, setMode } = useMode();

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            const { key, shiftKey } = event;

            if (['ArrowLeft', 'ArrowRight', ' '].includes(key)) {
                event.preventDefault();
            }

            if (activeTimeline) {
                if (key === 'ArrowLeft' || key === 'ArrowRight') {
                    const customEvent = new CustomEvent('timelineNavigation', {
                        detail: { direction: key === 'ArrowLeft' ? 'previous' : 'next' }
                    });
                    window.dispatchEvent(customEvent);
                    return;
                }
            }

            if (shiftKey && key === 'ArrowLeft') {
                handleFrameChange(currentFrame - 100);
                return;
            }

            if (shiftKey && key === 'ArrowRight') {
                handleFrameChange(currentFrame + 100);
                return;
            }

            if (shiftKey && key === 'P') {
                if (mode === 'dev') {
                    setMode('commercial');
                } else {
                    setMode('dev');
                }
                return;
            }

            switch (key.toLowerCase()) {
                case ' ':
                    togglePlay();
                    break;
                case 'arrowleft':
                    if (!activeTimeline) handleFrameChange(currentFrame - 1);
                    break;
                case 'arrowright':
                    if (!activeTimeline) handleFrameChange(currentFrame + 1);
                    break;
                case 'p':
                    toggleActiveLayers('players');
                    break;
                case 'b':
                    toggleActiveLayers('ball');
                    break;
                case 'a':
                    toggleActiveLayers('areas-ab');
                    break;
                case 'c':
                    toggleActiveLayers('areas-cd');
                    break;
                case 'h':
                    toggleActiveLayers('hits');
                    break;
                case 'o':
                    toggleActiveLayers('homography');
                    break;
                case 'd':
                    toggleActiveLayers('distance');
                    break;
                case 'r':
                    toggleActiveLayers('rebounds');
                    break;
                case 't':
                    toggleActiveLayers('trajectories');
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentFrame, handleFrameChange, togglePlay, toggleActiveLayers, activeTimeline, mode, setMode]);
};