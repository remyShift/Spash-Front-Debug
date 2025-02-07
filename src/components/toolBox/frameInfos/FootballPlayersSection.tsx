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

/// TODO UPDATE FOR FOOTBALL
// - Group by team
// - Show arbitre
// - Show ball

export default function PadelPlayersSection({ frameData }: PlayersSectionProps) {
    return (
        <div className='flex flex-col gap-2'>
            <p className='text-white font-semibold text-center text-lg'>- - - - - Players - - - - -</p>
            <div className='flex flex-col gap-6'>
                {Object.keys(frameData?.persontracking || {}).map((player) => {
                    const playerData = frameData?.persontracking?.[player];
                    return (
                        <div key={player} className='flex flex-col gap-1'>
                            {playerData?.class == 2 && <PlayerInfo label="Class" value={playerData?.class || 'N/A'} />}
                            {playerData?.player_legs && <PlayerLegs legs={playerData?.player_legs} />}
                            {playerData?.speed_legs && <PlayerInfo label="Speed" value={`${playerData?.speed_legs?.toFixed(2) || 0} km/h`} />}
                            {playerData?.cumulate_distance && <PlayerInfo label="Distance" value={`${playerData?.cumulate_distance?.toFixed(2) || 0} m`} />}
                            {playerData?.do_hit && <PlayerInfo label="Do Service" value={`${playerData?.do_hit.service ? 'Yes' : 'No'}`} />}
                            {playerData?.do_hit && <PlayerInfo label="Do Lob" value={`${playerData?.do_hit.lob ? 'Yes' : 'No'}`} />}
                            {playerData?.do_hit && <PlayerInfo label="Do Hit" value={`${playerData?.do_hit.hit ? 'Yes' : 'No'}`} />}
                            {playerData?.hit_count && <PlayerInfo label="Hits count" value={playerData?.hit_count.hit || 0} />}
                            {playerData?.hit_count && <PlayerInfo label="Lob count" value={playerData?.hit_count.lob || 0} />}
                            {playerData?.hit_count && <PlayerInfo label="Service count" value={playerData?.hit_count.service || 0} />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}