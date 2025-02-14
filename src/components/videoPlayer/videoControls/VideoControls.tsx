import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MainTimeline } from './MainTimeline';
import { PlayPauseButton } from './PlayPauseButton';
import { PlaybackSpeed } from './PlaybackSpeed';
import { TimeDisplay } from './TimeDisplay';

interface VideoControlsProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    reels?: {
        reel_type: string;
        end_frame: number;
        duration: number;
        end_timecode: number;
    }[];
}

export const VideoControls = ({ videoRef, reels }: VideoControlsProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const lastTimeRef = useRef(0);

    const handleTimeUpdate = useCallback(() => {
        if (!videoRef.current) return;
        const newTime = videoRef.current.currentTime;
        if (Math.abs(newTime - lastTimeRef.current) >= 0.01) {
            lastTimeRef.current = newTime;
            setCurrentTime(newTime);
        }
    }, [videoRef]);

    const handleLoadedMetadata = useCallback(() => {
        if (!videoRef.current) return;
        setDuration(videoRef.current.duration);
    }, [videoRef]);

    const handlePlay = useCallback(() => setIsPlaying(true), []);
    const handlePause = useCallback(() => setIsPlaying(false), []);

    useEffect(() => {
        if (!videoRef.current) return;

        const video = videoRef.current;
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
        };
    }, [videoRef, handleLoadedMetadata, handleTimeUpdate, handlePlay, handlePause]);

    const handleTimeChange = useCallback((time: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            lastTimeRef.current = time;
            setCurrentTime(time);
        }
    }, [videoRef]);

    const handlePlayPause = useCallback(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
        }
    }, [isPlaying, videoRef]);

    const handleSpeedChange = useCallback((speed: number) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = speed;
            setPlaybackRate(speed);
        }
    }, [videoRef]);

    return (
        <div className="flex items-center gap-4 w-full bg-lightBackground p-1 px-3 rounded-lg mt-2">
            <div className="flex justify-between items-center w-full">
                <MainTimeline 
                    currentTime={currentTime}
                    reels={reels}
                    duration={duration}
                    onTimeChange={handleTimeChange}
                />
                <TimeDisplay 
                    currentTime={currentTime}
                    duration={duration}
                />
            </div>
            <PlayPauseButton 
                isPlaying={isPlaying}
                onToggle={handlePlayPause}
            />
            <PlaybackSpeed 
                speed={playbackRate}
                onSpeedChange={handleSpeedChange}
            />
        </div>
    );
}; 