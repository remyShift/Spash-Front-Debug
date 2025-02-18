import React, { useEffect, useState } from 'react'
import { JSONData } from '@/types/files'
import { getAllPlayerId } from '@/utils/getAllPlayerId'

export default function GotoPlayer({ handleFrameChange, videoData }: { 
    handleFrameChange: (frameNumber: number) => void,
    videoData: JSONData 
}) {
    const [playerIds, setPlayerIds] = useState<number[]>([]);

    useEffect(() => {
        const ids = getAllPlayerId(videoData);
        setPlayerIds(ids);
    }, [videoData]);

    const handlePlayerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const playerId = e.target.value;
        
        if (playerId) {
            const playerIdNumber = parseInt(playerId);
            const firstFrame = Object.entries(videoData.data).find(([, frameData]) => {
                return Object.values(frameData.persontracking || {}).some(
                    player => player.id === playerIdNumber
                );
            });

            if (firstFrame) {
                const frameNumber = parseInt(firstFrame[0]);
                handleFrameChange(frameNumber);
            }
        }
    }

    return (
        <div className="flex gap-4 items-center justify-center">
            <p className="text-white font-semibold text-base">Go to Player :</p>
            <select 
                className="w-24 h-6 bg-lighterBackground rounded-md p-1 text-center text-white font-semibold text-base outline-none border-none focus:ring-primary focus:ring-1"
                defaultValue=""
                onChange={handlePlayerChange}
            >
                <option value="" disabled>Select</option>
                {playerIds.sort((a, b) => a - b).map((id) => (
                    <option key={id} value={id}>
                        {id}
                    </option>
                ))}
            </select>
        </div>
    )
}
