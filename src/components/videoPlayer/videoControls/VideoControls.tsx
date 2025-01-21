import React, { useState, useEffect } from 'react';
import { MainTimeline } from './MainTimeline';
import { PlayPauseButton } from './PlayPauseButton';
import { VolumeControl } from './VolumeControl';
import { PlaybackSpeed } from './PlaybackSpeed';
import { TimeDisplay } from './TimeDisplay';

interface VideoControlsProps {
    videoRef: React.RefObject<HTMLVideoElement>;
}

export const VideoControls = ({ videoRef }: VideoControlsProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [playbackRate, setPlaybackRate] = useState(1);

    useEffect(() => {
        if (!videoRef.current) return;

        const video = videoRef.current;
        setDuration(video.duration);

        const handleTimeUpdate = () => setCurrentTime(video.currentTime);
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
        };
    }, [videoRef]);

    return (
        <div className="flex flex-col gap-2 w-full bg-lighterBackground/80 p-4 rounded-lg">
            <MainTimeline 
                currentTime={currentTime}
                duration={duration}
                onTimeChange={(time) => {
                    if (videoRef.current) {
                        videoRef.current.currentTime = time;
                        setCurrentTime(time);
                    }
                }}
            />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
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
                    <VolumeControl 
                        volume={volume}
                        onVolumeChange={(value) => {
                            if (videoRef.current) {
                                videoRef.current.volume = value;
                                setVolume(value);
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
                <TimeDisplay 
                    currentTime={currentTime}
                    duration={duration}
                />
            </div>
        </div>
    );
}; 