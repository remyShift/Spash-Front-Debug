import { useFrame } from '@/context/frame';
import { JSONData } from '@/types/files'
import { useEffect, useState } from 'react';
import { countPlayerHits } from '@/utils/countPlayerHits';

export default function FrameInfos({ framesData, events }: { framesData: JSONData['data'], events: JSONData['events'] }) {
    const { currentFrame } = useFrame();
    const [frameData, setFrameData] = useState<JSONData['data'][number] | null>(null);
    const [playerHits, setPlayerHits] = useState<{[key: string]: number}>({});

    useEffect(() => {
        setFrameData(framesData[currentFrame]);

        const hits: {[key: string]: number} = {};
        Object.keys(framesData[currentFrame]?.persontracking || {}).forEach((playerId) => {
            if (framesData[currentFrame]?.persontracking) {
                const player = framesData[currentFrame].persontracking[playerId];
                hits[playerId] = countPlayerHits(framesData, player.id, currentFrame);
            }
        });
        setPlayerHits(hits);
    }, [framesData, currentFrame]);

    return (
        <div className='p-4 flex flex-col gap-8 max-h-[500px] overflow-y-auto'>
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


            <div className='flex flex-col gap-4'>
                <p className='text-white font-semibold text-center text-lg'>- - - - - Events - - - - -</p>
                <div className='flex gap-4 flex-wrap justify-center'>
                        {Object.keys(events).map((event) => (
                            <span 
                                key={event} 
                                className={`font-normal ${events[event].includes(currentFrame) ? 'text-primary font-bold' : 'text-white'}`}
                            >
                                {event.charAt(0).toUpperCase() + event.slice(1)}
                            </span>
                        ))}
                </div>
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
            </div>

            <div className='flex flex-col gap-2'>
                <p className='text-white font-semibold text-center text-lg'>- - - - - Ball - - - - -</p>
                <p className='text-white font-semibold flex gap-1'>Ball Confidence : 
                    <span className='text-white font-normal'>
                        {frameData?.["ball.score"]?.toFixed(2)}
                    </span>
                </p>
                <div className='flex flex-col gap-1'>
                    <p className='text-white font-semibold'>Ball Rect : </p>
                    <div className='flex gap-2'>
                        {frameData?.["ball.rect"]?.map((coord, index) => {
                            return <span key={index} className='text-white font-normal'>{coord.toFixed(2)}</span>
                        })}
                    </div>
                </div>
                <div className='flex flex-col gap-1'>
                    <p className='text-white font-semibold'>Ball Center : </p>
                    <div className='flex gap-2'>
                        {frameData?.["ball.center"]?.map((coord, index) => {
                            return <span key={index} className='text-white font-normal'>{coord.toFixed(2)}</span>
                        })}
                    </div>
                </div>
                <p className='text-white font-semibold flex gap-1'>Speed : 
                    <span className='text-white font-normal'>
                        {frameData?.speed?.toFixed(2)}
                    </span>
                </p>
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
                                <p className='text-white font-semibold flex gap-1'>Name : 
                                    <span className='text-white font-normal'>{frameData?.persontracking?.[player]?.name}</span>
                                </p>
                                <div className='flex gap-1'>
                                    <p className='text-white flex gap-2 font-semibold'>Legs :</p>
                                    <div className='flex gap-2'>
                                        {frameData?.persontracking?.[player]?.player_legs.map((coord, index) => {
                                            return <span key={index} className='text-white font-normal'>{coord.toFixed(2)}</span>
                                        })}
                                    </div>
                                </div>
                                <p className='text-white font-semibold flex gap-1'>Confidence : 
                                    <span className='text-white font-normal'>{frameData?.persontracking?.[player]?.confidence.toFixed(2)}</span>
                                </p>
                                <p className='text-white font-semibold flex gap-1'>Hits count : 
                                    <span className='text-white font-normal'>
                                        {playerHits[player] || 0}
                                    </span>
                                </p>
                                <p className='text-white font-semibold flex gap-1'>Do Hit : 
                                    <span className='text-white font-normal'>{frameData?.persontracking?.[player]?.do_hit === true ? "Yes" : "No"}</span>
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
