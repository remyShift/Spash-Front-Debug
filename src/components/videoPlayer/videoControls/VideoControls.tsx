import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        if (!videoRef.current) return;

        const video = videoRef.current;

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
        };
        
        const handleTimeUpdate = () => setCurrentTime(video.currentTime);
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

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
    }, [videoRef]);

    return (
        <div className="flex items-center gap-4 w-full bg-lightBackground p-1 px-3 rounded-lg mt-2">
            <div className="flex justify-between items-center w-full">
                <MainTimeline 
                    currentTime={currentTime}
                    reels={reels}
                    duration={duration}
                    onTimeChange={(time) => {
                        if (videoRef.current) {
                            videoRef.current.currentTime = time;
                            setCurrentTime(time);
                        }
                    }}
                />

                <TimeDisplay 
                    currentTime={currentTime}
                    duration={duration}
                />
            </div>

            <PlayPauseButton 
                isPlaying={isPlaying}
                onToggle={() => {
                    if (videoRef.current) {
                        if (isPlaying) {
                            videoRef.current.pause();
                        } else {
                            videoRef.current.play();
                        }
                    }
                }}
            />

            <PlaybackSpeed 
                speed={playbackRate}
                onSpeedChange={(speed) => {
                if (videoRef.current) {
                    videoRef.current.playbackRate = speed;
                    setPlaybackRate(speed);
                }
                }}
            />
        </div>
    );
}; 