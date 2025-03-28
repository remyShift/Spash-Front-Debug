import StatsCategoryColumn from "./StatsCategoryColumn";
import PlayerStatsColumn from "./PlayerStatsColumn";
import StatsNameColumn from "./StatsNameColumn";
import { PlayerStats } from "@/types/stats";
import { useAccordionHeight } from "@/context/accordion";
import { useMode } from "@/context/mode";

interface StatsData {
    players: Array<PlayerStats>;
}

export default function StatsArray({ statsData }: { statsData: StatsData }) {
    const playersAB = statsData.players.slice(0, 2);
    const playersCD = statsData.players.slice(2, 4);
    const { accordionHeight } = useAccordionHeight();
    const { mode } = useMode();

    let containerStyle = {};

    if (mode === "commercial") {
        containerStyle = {
            marginTop: accordionHeight > 0 ? `${accordionHeight / 4}px` : '0px',
            transition: 'margin-top 300ms ease-in-out'
        };
    }

    return (
        <div 
            className="flex flex-col gap-8 w-full pb-4"
            style={containerStyle}
        >
            <div className="flex flex-wrap justify-center gap-3">
                <div className="flex gap-3">
                    <StatsCategoryColumn player={statsData.players[0]} />
                    <StatsNameColumn player={statsData.players[0]} />
                    {playersAB.map((playerStats, index) => (
                        <PlayerStatsColumn 
                            key={index} 
                            index={index} 
                            playerStats={playerStats as PlayerStats}
                        />
                    ))}
                </div>

                {/* Deuxième groupe (visible uniquement sur grands écrans) */}
                <div className="hidden xl:flex gap-3">
                    {playersCD.map((playerStats, index) => (
                        <PlayerStatsColumn 
                            key={index + 2} 
                            index={index + 2} 
                            playerStats={playerStats as PlayerStats} 
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
                            playerStats={playerStats as PlayerStats} 
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}