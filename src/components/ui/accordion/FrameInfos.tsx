import { useFrame } from '@/context/frame';
import { JSONData } from '@/types/files'
import { useEffect, useState } from 'react';

export default function FrameInfos({ framesData }: { framesData: JSONData['data'] }) {
    const { currentFrame } = useFrame();
    const [frameData, setFrameData] = useState<JSONData['data'][number] | null>(null);

    useEffect(() => {
        setFrameData(framesData[currentFrame]);
    }, [framesData, currentFrame]);

    console.log(frameData);

    return (
        <div className='p-4 flex flex-col gap-8'>
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

            <div className='flex flex-col gap-2'>
                <p className='text-white font-semibold text-center text-lg'>- - - - - Infos - - - - -</p>
                <p className='text-white font-semibold flex gap-1'>Zone : 
                    <span className='text-white font-normal'>
                        {frameData?.zone}
                    </span>
                </p>
                <p className='text-white font-semibold flex gap-1'>Detection : 
                    <span className='text-white font-normal'>
                        {frameData?.detection || "null"}
                    </span>
                </p>
                <p className='text-white font-semibold flex gap-1'>Speed : 
                    <span className='text-white font-normal'>
                        {frameData?.speed}
                    </span>
                </p>
            </div>

            <div className='flex flex-col gap-2'>
                <p className='text-white font-semibold text-center text-lg'>- - - - - Ball - - - - -</p>
                <p className='text-white font-semibold flex gap-1'>Ball Confidence : 
                    <span className='text-white font-normal'>
                        {frameData?.["ball.score"]}
                    </span>
                </p>
                <div className='flex flex-col gap-1'>
                    <p className='text-white font-semibold'>Ball Rect : </p>
                    <div className='flex gap-2'>
                        {frameData?.["ball.rect"]?.map((coord, index) => {
                            return <span key={index} className='text-white font-normal'>{coord}</span>
                        })}
                    </div>
                </div>
                <div className='flex flex-col gap-1'>
                    <p className='text-white font-semibold'>Ball Center : </p>
                    <div className='flex gap-2'>
                        {frameData?.["ball.center"]?.map((coord, index) => {
                            return <span key={index} className='text-white font-normal'>{coord}</span>
                        })}
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-2'>
                <p className='text-white font-semibold text-center text-lg'>- - - - - Players - - - - -</p>
                <div className='flex flex-col gap-6'>
                    {Object.keys(frameData?.persontracking || {}).map((player) => {
                        return (
                            <div key={player} className='flex flex-col gap-1'>
                                <p className='text-white flex gap-1 font-semibold'>ID : 
                                    <span className='text-white font-normal'>{frameData?.persontracking?.[player]?.id}</span>
                                </p>
                                <div className='flex gap-1'>
                                    <p className='text-white flex gap-2 font-semibold'>Legs :</p>
                                    <div className='flex gap-2'>
                                        {frameData?.persontracking?.[player]?.player_legs.map((coord, index) => {
                                            return <span key={index} className='text-white font-normal'>{coord}</span>
                                        })}
                                    </div>
                                </div>
                                <p className='text-white font-semibold flex gap-1'>Confidence : 
                                    <span className='text-white font-normal'>{frameData?.persontracking?.[player]?.confidence}</span>
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
