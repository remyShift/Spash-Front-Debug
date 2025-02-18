import { JSONData } from '@/types/files';
import { PersonTracking } from '@/types/files';

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

const TeamSection = ({ label, players, color }: { 
    label: string; 
    players: Array<[string, PersonTracking]>; 
    color: string 
}) => (
    <div className='flex flex-col gap-4'>
        <p className='font-semibold text-center text-lg' style={{ color }}>{label}</p>
        <div className='flex flex-col gap-6'>
            {players.map(([id, player]) => (
                <div key={id} className='flex flex-col gap-1 border border-gray-700 p-2 rounded'>
                    <PlayerInfo label="ID" value={id} />
                    <PlayerInfo label="Class" value={player.class?.toString() || ''} />
                    <PlayerInfo label="Team" value={player.team} />
                    <PlayerInfo label="Confidence" value={`${player.confidence?.toFixed(2) || 0}`} />
                    <PlayerLegs legs={player.player_legs} />
                    <PlayerInfo label="Speed" value={`${player.speed_legs?.toFixed(2) || 0} km/h`} />
                    <PlayerInfo label="Distance" value={`${player.cumulate_distance?.toFixed(2) || 0} m`} />
                </div>
            ))}
        </div>
    </div>
);

export default function FootballPlayersSection({ frameData }: PlayersSectionProps) {
    const players = Object.entries(frameData?.persontracking || {});
    
    const blueTeam = players.filter(([, player]) => player?.class === 2);
    const orangeTeam = players.filter(([, player]) => player?.class === 3);
    const referee = players.find(([, player]) => player?.class === 1);

    return (
        <div className='flex flex-col gap-6'>
            <p className='text-white font-semibold text-center text-lg'>- - - - - Teams - - - - -</p>
            
            <div className='flex flex-col gap-8'>
                {referee && (
                    <div className='flex flex-col gap-2 border border-yellow-500 p-2 rounded'>
                        <p className='text-yellow-500 font-semibold text-center'>Referee</p>
                        {referee[1]?.player_legs && <PlayerLegs legs={referee[1]?.player_legs} />}
                        {referee[1]?.speed_legs && <PlayerInfo label="Speed" value={`${referee[1]?.speed_legs?.toFixed(2) || 0} km/h`} />}
                        {referee[1]?.cumulate_distance && <PlayerInfo label="Distance" value={`${referee[1]?.cumulate_distance?.toFixed(2) || 0} m`} />}
                    </div>
                )}

                <div className='grid grid-cols-2 gap-4'>
                    <TeamSection label="Blue Team" players={blueTeam} color="#00FFFF" />
                    <TeamSection label="Orange Team" players={orangeTeam} color="#FFA500" />
                </div>
            </div>
        </div>
    );
}