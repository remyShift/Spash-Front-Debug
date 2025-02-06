import StatsCategoryColumn from "./StatsCategoryColumn";
import PlayerStatsColumn from "./PlayerStatsColumn";
import StatsNameColumn from "./StatsNameColumn";
import { PlayerStats } from "@/types/stats";

interface StatsData {
    players: Array<PlayerStats>;
}

export default function StatsArray({ statsData }: { statsData: StatsData }) {
    const playersAB = statsData.players.slice(0, 2);
    const playersCD = statsData.players.slice(2, 4);

    return (
        <div 
            className="flex flex-col gap-8 w-full pb-4"
        >
            <div className="flex flex-wrap justify-center gap-3">
                <div className="flex gap-3">
                    <StatsCategoryColumn player={statsData.players[0]} />
                    <StatsNameColumn player={statsData.players[0]} />
                    {playersAB.map((playerStats, index) => (
                        <PlayerStatsColumn 
                            key={index} 
                            index={index} 
                            player={playerStats as PlayerStats}
                        />
                    ))}
                </div>

                {/* Deuxième groupe (visible uniquement sur grands écrans) */}
                <div className="hidden xl:flex gap-3">
                    {playersCD.map((playerStats, index) => (
                        <PlayerStatsColumn 
                            key={index + 2} 
                            index={index + 2} 
                            player={playerStats as PlayerStats} 
                        />
                    ))}
                </div>

                {/* Deuxième groupe (visible uniquement sur petits écrans) */}
                <div className="flex xl:hidden gap-3 mt-12">
                    <StatsCategoryColumn player={statsData.players[0]} />
                    <StatsNameColumn player={statsData.players[0]} />
                    {playersCD.map((playerStats, index) => (
                        <PlayerStatsColumn 
                            key={index + 2} 
                            index={index + 2} 
                            player={playerStats as PlayerStats} 
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}