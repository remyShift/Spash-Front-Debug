import { JSONData } from "@/types/files";

interface FrameHeaderProps {
    currentFrame: number;
    frameData: JSONData['data'][number] | null;
}

export default function FrameHeader({ currentFrame, frameData }: FrameHeaderProps) {
    return (
        <div className='flex justify-center gap-8'>
            <p className='text-white font-semibold flex gap-1'>Frame : 
                <span className='text-white font-normal'>
                    {currentFrame}
                </span>
            </p>
            <p className='text-white font-semibold flex gap-1'>Frame Index : 
                <span className='text-white font-normal'>
                    {frameData?.frame_idx}
                </span>
            </p>
        </div>
    )
} 