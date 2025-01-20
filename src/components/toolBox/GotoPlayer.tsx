import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const select = target.querySelector('select');
        const playerId = select?.value;
        
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
                if (select) {
                    select.value = '';
                }
            }
        }
    }

    return (
        <div className="flex gap-4 items-center justify-center">
            <p className="text-white font-semibold text-base">Go to Player :</p>
            <form className="flex gap-2 items-center" onSubmit={handleSubmit}>
                <select 
                    className="w-24 h-6 bg-lighterBackground rounded-md p-1 text-center text-white font-semibold text-base outline-none border-none focus:ring-primary focus:ring-1"
                    defaultValue=""
                >
                    <option value="" disabled>Select</option>
                    {playerIds.map((id) => (
                        <option key={id} value={id}>
                            {id}
                        </option>
                    ))}
                </select>
                <button className="bg-primary text-white font-semibold text-base rounded-md flex items-center justify-center px-2 py-1 active:bg-primary/80 transition-all duration-200" type="submit">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </form>
        </div>
    )
}
