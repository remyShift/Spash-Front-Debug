import { useState, useEffect } from 'react';

export const useVideoPlayer = () => {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    useEffect(() => {
        const video = document.querySelector('video');
        if (video) {
            const handlePlay = () => setIsVideoPlaying(true);
            const handlePause = () => setIsVideoPlaying(false);

            video.addEventListener('play', handlePlay);
            video.addEventListener('pause', handlePause);

            return () => {
                video.removeEventListener('play', handlePlay);
                video.removeEventListener('pause', handlePause);
            };
        }
    }, []);

    const togglePlay = () => {
        const video = document.querySelector('video');
        if (video) {
            if (isVideoPlaying) {
                video.pause();
            } else {
                video.play();
            }
        }
    };

    return {
        isVideoPlaying,
        togglePlay,
    };
};