import React from 'react'
import { JSONData } from '@/types/files';

export default function GotoFrame({ handleFrameChange, videoData }: { 
    handleFrameChange: (frameNumber: number) => void, 
    videoData: JSONData 
}) {

    const changeFrame = (e: React.ChangeEvent<HTMLInputElement>) => {
        const frameId = e.target.value;
        
        if (frameId) {
            const frameNumber = parseInt(frameId);
            handleFrameChange(frameNumber);
        }
    }

    return (
        <div className="flex gap-4 items-center justify-center">
            <p className="text-white font-semibold text-base">Go to Frame :</p>
            <input 
                type="number" 
                min={0}
                max={Object.keys(videoData.data).length - 1}
                className="w-24 h-6 bg-lighterBackground rounded-md p-2 text-center text-white font-semibold text-base outline-none border-none focus:ring-primary focus:ring-1"
                onChange={changeFrame}
            />
        </div>
    )
}
