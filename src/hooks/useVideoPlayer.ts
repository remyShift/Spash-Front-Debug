import { useState, useEffect } from 'react';

export const useVideoPlayer = () => {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    useEffect(() => {
        const video = document.querySelector('video');
        if (video) {
            const handlePlay = () => setIsVideoPlaying(true);
            const handlePause = () => setIsVideoPlaying(false);
            const handleEnded = () => {
                setIsVideoPlaying(false);
                video.currentTime = 0;
            };

            video.addEventListener('play', handlePlay);
            video.addEventListener('pause', handlePause);
            video.addEventListener('ended', handleEnded);

            return () => {
                video.removeEventListener('play', handlePlay);
                video.removeEventListener('pause', handlePause);
                video.removeEventListener('ended', handleEnded);
            };
        }
    }, []);

    const togglePlay = () => {
        const video = document.querySelector('video');
        if (video) {
            if (video.ended) {
                video.currentTime = 0;
            }
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