import { JSONData } from '@/types/files';
import { useEffect, useState } from 'react';
import { getPlayerColor } from '@/utils/drawing/colors';
import Spacer from '../ui/Spacer';
import { useFrame } from '@/context/frame';

interface PlayerPresence {
    id: number;
    ranges: { start: number; end: number }[];
    name?: string;
}

export default function PlayersPresenceTimeline({ jsonData }: { jsonData: JSONData }) {
    const [playerPresences, setPlayerPresences] = useState<PlayerPresence[]>([]);
    const { setCurrentFrame } = useFrame();
    const totalFrames = Object.keys(jsonData.data).length;
    const FPS = 25;
    
    useEffect(() => {
        const presences = new Map<number, PlayerPresence>();

        Object.entries(jsonData.data).forEach(([frameIndex, frameData]) => {
            const frame = parseInt(frameIndex);
            
            Object.values(frameData.persontracking || {}).forEach(player => {
                if (!player.id) return;
                if (!presences.has(player.id)) {
                    presences.set(player.id, { 
                        id: player.id, 
                        name: player.name,
                        ranges: [{ start: frame, end: frame }] 
                    });
                } else {
                    const presence = presences.get(player.id)!;
                    const lastRange = presence.ranges[presence.ranges.length - 1];
                    
                    if (frame === lastRange.end + 1) {
                        lastRange.end = frame;
                    } else if (frame > lastRange.end + 1) {
                        presence.ranges.push({ start: frame, end: frame });
                    }
                }
            });
        });

        setPlayerPresences(Array.from(presences.values()).sort((a, b) => a.id - b.id));
    }, [jsonData]);

    const generateTimeMarkers = () => {
        const markers = [];
        const frameInterval = totalFrames / 20;
        const numberOfMarkers = Math.ceil(totalFrames / frameInterval);

        for (let i = 0; i <= numberOfMarkers; i++) {
            const frame = Math.min(i * frameInterval, totalFrames);
            const seconds = frame / FPS;
            const position = (frame / totalFrames) * 100;
            markers.push({ time: seconds, position });
        }

        return markers;
    };

    const handleRangeClick = (startFrame: number) => {
        const video = document.querySelector('video');
        if (video) {
            const timeInSeconds = startFrame / FPS;
            video.currentTime = timeInSeconds;
            setCurrentFrame(startFrame);
        }
    };

    return (
        <div className="flex w-full px-14">
            <div className="w-full bg-lightBackground p-4 rounded-lg mb-8">
                <h2 className="text-white text-lg font-semibold mb-4 text-center">Players presence</h2>
                <div className="flex flex-col gap-4">
                    <div className="flex">
                        <div className="w-[10%] flex">
                            <div className="w-1/2 text-white font-medium text-center">
                                Name
                            </div>
                            <div className="w-1/2 text-white font-medium text-center">
                                ID
                            </div>
                        </div>
                        <div className="relative h-6 flex-1">
                            {generateTimeMarkers().map(({ time, position }) => (
                                <div
                                    key={time}
                                    className="absolute flex flex-col items-center"
                                    style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                                >
                                    <div className="h-2 w-[1px] bg-white/50"></div>
                                    <span className="text-white/70 text-xs mt-1">
                                        {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="max-h-[500px] overflow-y-auto hide-scrollbar">
                        <div className="relative flex flex-col gap-4 mt-4">
                            {playerPresences.map((player) => (
                                <div className="flex flex-col gap-2 items-center" key={player.id}>
                                    <div 
                                        className="w-full h-1 flex items-center"
                                    >
                                        <div className="w-[10%] flex">
                                            <div className="w-1/2 text-white font-medium text-center">
                                                {player.name ? (
                                                    <span className="text-primary font-bold underline">
                                                        {player.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-white">
                                                        {player.id}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="w-1/2 text-white font-medium text-center">
                                                {player.id}
                                            </div>
                                        </div>
                                        <div className="flex-1 relative h-3">
                                            {player.ranges.map((range, rangeIndex) => {
                                                const startPercent = (range.start / totalFrames) * 100;
                                                const width = ((range.end - range.start) / totalFrames) * 100;
                                                
                                                return (
                                                    <div
                                                        key={rangeIndex}
                                                        className="absolute h-full rounded-sm cursor-pointer hover:brightness-125 transition-all"
                                                        style={{
                                                            left: `${startPercent}%`,
                                                            width: `${width}%`,
                                                            backgroundColor: getPlayerColor(player.id)
                                                        }}
                                                        onClick={() => handleRangeClick(range.start)}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <Spacer />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 