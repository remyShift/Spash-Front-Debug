import { StatsData } from "@/types/files";
import StatsCategoryColumn from "./StatsCategoryColumn";
import PlayerStatsColumn from "./PlayerStatsColumn";
import StatsNameColumn from "./StatsNameColumn";
import { useAccordionHeight } from "@/context/accordion";

export default function StatsArray({ statsData }: { statsData: StatsData }) {
    const playersAB = statsData.players.slice(0, 2);
    const playersCD = statsData.players.slice(2, 4);
    const { accordionHeight } = useAccordionHeight();

    const containerStyle = {
        marginTop: accordionHeight > 0 ? `${accordionHeight / 5}px` : '0'
    };

    return (
        <div 
            className="flex flex-col gap-8 w-full pb-4"
            style={containerStyle}
        >
            <div className="flex flex-wrap justify-center gap-3">
                {/* Premier groupe (visible sur tous les écrans) */}
                <div className="flex gap-3">
                    <StatsCategoryColumn />
                    <StatsNameColumn />
                    {playersAB.map((playerStats, index) => (
                        <PlayerStatsColumn 
                            key={index} 
                            index={index} 
                            player={playerStats} 
                        />
                    ))}
                </div>

                {/* Deuxième groupe (visible uniquement sur grands écrans) */}
                <div className="hidden xl:flex gap-3">
                    {playersCD.map((playerStats, index) => (
                        <PlayerStatsColumn 
                            key={index + 2} 
                            index={index + 2} 
                            player={playerStats} 
                        />
                    ))}
                </div>

                {/* Deuxième groupe (visible uniquement sur petits écrans) */}
                <div className="flex xl:hidden gap-3 mt-12">
                    <StatsCategoryColumn />
                    <StatsNameColumn />
                    {playersCD.map((playerStats, index) => (
                        <PlayerStatsColumn 
                            key={index + 2} 
                            index={index + 2} 
                            player={playerStats} 
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}