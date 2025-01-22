import { JSONData } from '@/types/files';

interface BallSectionProps {
    frameData: JSONData['data'][number] | null;
}

export default function BallSection({ frameData }: BallSectionProps) {
    return (
        <div className='flex flex-col gap-2'>
            <p className='text-white font-semibold text-center text-lg'>- - - - - Ball - - - - -</p>
            <p className='text-white font-semibold flex gap-1'>Ball Confidence : 
                <span className='text-white font-normal'>{frameData?.["ball.score"]?.toFixed(2)}</span>
            </p>
            <div className='flex flex-col gap-1'>
                <p className='text-white font-semibold'>Ball Rect : </p>
                <div className='flex gap-2'>
                    {frameData?.["ball.rect"]?.map((coord, index) => (
                        <span key={index} className='text-white font-normal'>{coord.toFixed(2)}</span>
                    ))}
                </div>
            </div>
            <div className='flex flex-col gap-1'>
                <p className='text-white font-semibold'>Ball Center : </p>
                <div className='flex gap-2'>
                    {frameData?.["ball.center"]?.map((coord, index) => (
                        <span key={index} className='text-white font-normal'>{coord.toFixed(2)}</span>
                    ))}
                </div>
            </div>
            <p className='text-white font-semibold flex gap-1'>Speed : 
                <span className='text-white font-normal'>{frameData?.speed?.toFixed(2)}</span>
            </p>
        </div>
    )
} 