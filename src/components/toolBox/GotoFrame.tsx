import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export default function GotoFrame({ handleFrameChange }: { handleFrameChange: (frameNumber: number) => void }) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const input = target.querySelector('input');
        const frameId = input?.value;
        
        if (frameId) {
            const frameNumber = parseInt(frameId);
            handleFrameChange(frameNumber);
            if (input) {
                input.value = '';
            }
        }
    }

    return (
        <div className="flex gap-4 items-center justify-center">
            <p className="text-white font-semibold text-base">Go to Frame :</p>
            <form className="flex gap-2 items-center" onSubmit={handleSubmit}>
                <input type="number" min={0} className="w-24 h-6 bg-lighterBackground rounded-md p-2 text-center text-white font-semibold text-base outline-none border-none focus:ring-primary focus:ring-1" />
                <button className="bg-primary text-white font-semibold text-base rounded-md flex items-center justify-center px-2 py-1 active:bg-primary/80 transition-all duration-200" type="submit">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </form>
        </div>
    )
}
