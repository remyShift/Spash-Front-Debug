import { JSONData } from '@/types/files';
import { PlayerLegs } from './PlayerLegs';
import { PlayerZoneTime } from './PlayerZoneTime';
import { PlayerInfo } from './PlayerInfos';

interface PlayersSectionProps {
    frameData: JSONData['data'][number] | null;
}

export default function PadelPlayersSection({ frameData }: PlayersSectionProps) {
    return (
        <div className='flex flex-col gap-2'>
            <p className='text-white font-semibold text-center text-lg'>- - - - - Players - - - - -</p>
            <div className='flex flex-col gap-6'>
                {Object.keys(frameData?.persontracking || {}).map((player) => {
                    const playerData = frameData?.persontracking?.[player];

                    if (!playerData) return null;

                    return (
                        <div key={player} className='flex flex-col gap-1'>
                            <PlayerInfo label="ID" value={playerData.id || 'N/A'} />
                            <PlayerInfo label="Old ID" value={playerData.old_id || 'N/A'} />
                            <PlayerInfo label="Name" value={playerData.name || 'N/A'} />
                            <PlayerLegs legs={playerData.player_legs} />
                            <PlayerInfo label="Speed" value={`${playerData?.speed_legs?.toFixed(2) || 0} km/h`} />
                            <PlayerInfo label="Distance" value={`${playerData?.cumulate_distance?.toFixed(2) || 0} m`} />
                            <PlayerInfo label="Do Service" value={`${playerData.do_hit.service ? 'Yes' : 'No'}`} />
                            <PlayerInfo label="Do Lob" value={`${playerData.do_hit.lob ? 'Yes' : 'No'}`} />
                            <PlayerInfo label="Do Hit" value={`${playerData.do_hit.hit ? 'Yes' : 'No'}`} />
                            <PlayerInfo label="Hits count" value={playerData.hit_count?.hit || 0} />
                            <PlayerInfo label="Lob count" value={playerData.hit_count?.lob || 0} />
                            <PlayerInfo label="Service count" value={playerData.hit_count?.service || 0} />
                            <PlayerZoneTime label="Nomanland time" value={playerData.zone_count?.nomansland || 0} />
                            <PlayerZoneTime label="Attack time" value={playerData.zone_count?.attack || 0} />
                            <PlayerZoneTime label="Defense time" value={playerData.zone_count?.defense || 0} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}