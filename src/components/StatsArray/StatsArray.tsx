import { StatsData } from "@/types/files";
import StatsCategoryColumn from "./StatsCategoryColumn";
import PlayerStatsColumn from "./PlayerStatsColumn";
import StatsNameColumn from "./StatsNameColumn";
import { useAccordionHeight } from '@/context/accordion'

export default function StatsArray({ statsData }: { statsData: StatsData }) {
    const { accordionHeight } = useAccordionHeight();

    return (
        <div 
            className="flex justify-center items-end w-full h-full pb-4 gap-3 transition-all duration-300 ease-in-out"
            style={{ marginTop: `${accordionHeight / 10}px` }}
        >
            <StatsCategoryColumn />
            <StatsNameColumn />
            {statsData.players.map((playerStats, index) => (
                <PlayerStatsColumn key={index} index={index} player={playerStats} />
            ))}
        </div>
    )
}