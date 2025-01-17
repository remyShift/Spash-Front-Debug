import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { JSONData } from '@/types/files'

export default function GotoPlayer({ handleFrameChange, videoData }: { 
    handleFrameChange: (frameNumber: number) => void,
    videoData: JSONData 
}) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const input = target.querySelector('input');
        const playerId = input?.value;
        
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
                if (input) {
                    input.value = '';
                }
            }
        }
    }

    return (
        <div className="flex gap-4 items-center justify-center">
            <p className="text-white font-semibold text-base">Aller au Joueur :</p>
            <form className="flex gap-2 items-center" onSubmit={handleSubmit}>
                <input type="number" min={0} className="w-24 h-6 bg-lighterBackground rounded-md p-2 text-center text-white font-semibold text-base outline-none border-none focus:ring-primary focus:ring-1" />
                <button className="bg-primary text-white font-semibold text-base rounded-md flex items-center justify-center px-2 py-1 active:bg-primary/80 transition-all duration-200" type="submit">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </form>
        </div>
    )
}
