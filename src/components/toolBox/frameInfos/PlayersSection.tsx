import { JSONData } from '@/types/files';

interface PlayersSectionProps {
    frameData: JSONData['data'][number] | null;
    playerHits: {[key: string]: number};
}

export default function PlayersSection({ frameData, playerHits }: PlayersSectionProps) {
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
                        <p className='text-white font-semibold flex gap-1'>Hits count : 
                            <span className='text-white font-normal'>{playerHits[player] || 0}</span>
                        </p>
                        <p className='text-white font-semibold flex gap-1'>Do Hit : 
                            <span className='text-white font-normal'>
                                {frameData?.persontracking?.[player]?.do_hit === true ? (
                                    frameData?.persontracking?.[player]?.hit_type === 'lob' ? 
                                    "Yes (Lob)" : 
                                    frameData?.persontracking?.[player]?.hit_type === 'service' ?
                                    "Yes (Service)" :
                                    "Yes (Classic hit)"
                                ) : "No"}
                            </span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
} 