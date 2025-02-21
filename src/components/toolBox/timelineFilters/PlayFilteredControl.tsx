import { usePlayersFilters } from "@/context/playersFilters";
import { useEventsFilters } from "@/context/eventsFilters";
import { useFrame } from "@/context/frame";
import { filterEventsByPlayers } from "@/utils/filterEventsByPlayers";
import { Event } from "@/types/events";
import { JSONData } from "@/types/files";
import { useRef, useEffect, useState } from "react";
import ControlBtn from "@/components/toolBox/toolboxControls/ControlBtn";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";

const FPS = 25;

export default function PlayFilteredControl({ jsonData }: { jsonData: JSONData }) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const isPlayingRef = useRef(false);
    const { playersFilters } = usePlayersFilters();
    const { eventsFilters } = useEventsFilters();
    const { setCurrentFrame } = useFrame();

    const isButtonDisabled = playersFilters.length === 0 && eventsFilters.length === 0;

    useEffect(() => {
        if (isButtonDisabled && isPlayingRef.current) {
            setIsPlaying(false);
            isPlayingRef.current = false;
            if (videoRef.current) {
                videoRef.current.pause();
            }
        }
    }, [isButtonDisabled]);

    useEffect(() => {
        const video = document.querySelector('video');
        if (video) {
            videoRef.current = video;
        }
    }, []);

    const getAllFilteredFrames = () => {
        if (!jsonData?.events) return [];

        let allFilteredFrames: number[] = [];

        Object.entries(jsonData.events).forEach(([eventType, frames]) => {
            if (eventsFilters.length === 0 || eventsFilters.includes(eventType)) {
                const filteredFrames = frames.filter(frame =>
                    filterEventsByPlayers(frame, eventType as Event, jsonData.data, playersFilters)
                );
                allFilteredFrames = [...allFilteredFrames, ...filteredFrames];
            }
        });

        return allFilteredFrames.sort((a, b) => a - b);
    };

    const playNextEvent = async (filteredFrames: number[], currentIndex = 0) => {
        if (!videoRef.current || currentIndex >= filteredFrames.length || !isPlayingRef.current) {
            setIsPlaying(false);
            isPlayingRef.current = false;
            if (videoRef.current) {
                videoRef.current.pause();
            }
            return;
        }

        const frame = filteredFrames[currentIndex];
        await setCurrentFrame(frame);
        
        const timeInSeconds = frame / FPS;
        const startTime = Math.max(0, timeInSeconds - 1);
        videoRef.current.currentTime = startTime;

        await new Promise<void>((resolve) => {
            videoRef.current!.addEventListener('seeked', () => resolve(), { once: true });
        });

        if (!isPlayingRef.current) return;

        const nextIndex = currentIndex + 1;
        if (nextIndex < filteredFrames.length) {
            const nextFrame = filteredFrames[nextIndex];
            const timeDifference = (nextFrame - frame) / FPS;
            const waitTime = timeDifference <= 1 ? 0 : 1500;

            if (waitTime > 0) {
                await videoRef.current.play();
                await new Promise(resolve => setTimeout(resolve, waitTime));
                if (isPlayingRef.current) {
                    videoRef.current.pause();
                    playNextEvent(filteredFrames, nextIndex);
                }
            } else {
                playNextEvent(filteredFrames, nextIndex);
            }
        } else {
            await videoRef.current.play();
            await new Promise(resolve => setTimeout(resolve, 2000));
            videoRef.current.pause();
            setIsPlaying(false);
            isPlayingRef.current = false;
        }
    };

    const handleClick = async () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            setIsPlaying(false);
            isPlayingRef.current = false;
            videoRef.current.pause();
            return;
        }

        const filteredFrames = getAllFilteredFrames();
        
        if (filteredFrames.length > 0) {
            setIsPlaying(true);
            isPlayingRef.current = true;
            const currentTimeInSeconds = videoRef.current.currentTime;
            const currentFrameNumber = Math.round(currentTimeInSeconds * FPS);
            const nextFrameIndex = filteredFrames.findIndex(frame => frame > currentFrameNumber);
            const startIndex = nextFrameIndex === -1 ? 0 : nextFrameIndex;
            
            await playNextEvent(filteredFrames, startIndex);
        }
    };

    return (
        <div className="flex gap-4 items-center">
            <ControlBtn
                icon={isPlaying ? faPause : faPlay}
                onClick={handleClick}
                text={`${isPlaying ? "Pause" : "Play"} Filtered`}
                disabled={isButtonDisabled}
            />
        </div>
    );
}
