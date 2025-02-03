import { JSONData } from '@/types/files';

interface PlayersSectionProps {
    frameData: JSONData['data'][number] | null;
}

const PlayerInfo = ({ label, value }: { label: string; value: string | number }) => (
    <p className='text-white flex gap-1 font-semibold'>{label} : 
        <span className='text-white font-normal'>{value}</span>
    </p>
);

const PlayerLegs = ({ legs }: { legs: number[] }) => (
    <div className='flex gap-1'>
        <p className='text-white flex gap-2 font-semibold'>Legs :</p>
        <div className='flex gap-2'>
            {legs.map((coord, index) => (
                <span key={index} className='text-white font-normal'>{coord.toFixed(2)}</span>
            ))}
        </div>
    </div>
);

export default function PlayersSection({ frameData }: PlayersSectionProps) {
    return (
        <div className='flex flex-col gap-2'>
            <p className='text-white font-semibold text-center text-lg'>- - - - - Players - - - - -</p>
            <div className='flex flex-col gap-6'>
                {Object.keys(frameData?.persontracking || {}).map((player) => {
                    const playerData = frameData?.persontracking?.[player];
                    return (
                        <div key={player} className='flex flex-col gap-1'>
                            <PlayerInfo label="ID" value={playerData?.id || 'N/A'} />
                            <PlayerInfo label="Old ID" value={playerData?.old_id || 'N/A'} />
                            <PlayerInfo label="Name" value={playerData?.name || 'N/A'} />
                            <PlayerLegs legs={playerData?.player_legs || []} />
                            <PlayerInfo label="Speed" value={`${playerData?.speed_legs?.toFixed(2) || 0} km/h`} />
                            <PlayerInfo label="Distance" value={`${playerData?.cumulate_distance?.toFixed(2) || 0} m`} />
                            <PlayerInfo label="Do Hits" value={playerData?.do_hit ? 'Yes' : 'No'} />
                            <PlayerInfo label="Hits count" value={playerData?.hit_count.hit || 0} />
                            <PlayerInfo label="Lob count" value={playerData?.hit_count.lob || 0} />
                            <PlayerInfo label="Service count" value={playerData?.hit_count.service || 0} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}