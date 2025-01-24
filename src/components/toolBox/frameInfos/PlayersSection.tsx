import { JSONData } from '@/types/files';

interface PlayersSectionProps {
    frameData: JSONData['data'][number] | null;
}

export default function PlayersSection({ frameData }: PlayersSectionProps) {
    console.log(frameData?.persontracking);
    return (
        <div className='flex flex-col gap-2'>
            <p className='text-white font-semibold text-center text-lg'>- - - - - Players - - - - -</p>
            <div className='flex flex-col gap-6'>
                {Object.keys(frameData?.persontracking || {}).map((player) => (
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
                                {frameData?.persontracking?.[player]?.player_legs.map((coord, index) => (
                                    <span key={index} className='text-white font-normal'>{coord.toFixed(2)}</span>
                                ))}
                            </div>
                        </div>
                        <p className='text-white font-semibold flex gap-1'>Speed : 
                            <span className='text-white font-normal'>{frameData?.persontracking?.[player]?.speed_legs?.toFixed(2) || 0}km/h</span>
                        </p>
                        <p className='text-white font-semibold flex gap-1'>Distance : 
                            <span className='text-white font-normal'>{frameData?.persontracking?.[player]?.cumulate_distance?.toFixed(2) || 0}m</span>
                        </p>
                        <p className='text-white font-semibold flex gap-1'>Do Hits : 
                            <span className='text-white font-normal'>{frameData?.persontracking?.[player]?.do_hit ? 'Yes' : 'No'}</span>
                        </p>
                        <p className='text-white font-semibold flex gap-1'>Hits count : 
                            <span className='text-white font-normal'>{frameData?.persontracking?.[player]?.hit_count.hit || 0}</span>
                        </p>
                        <p className='text-white font-semibold flex gap-1'>Lob count : 
                            <span className='text-white font-normal'>{frameData?.persontracking?.[player]?.hit_count.lob || 0}</span>
                        </p>
                        <p className='text-white font-semibold flex gap-1'>Service count : 
                            <span className='text-white font-normal'>{frameData?.persontracking?.[player]?.hit_count.service || 0}</span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
} 