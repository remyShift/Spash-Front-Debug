import { StatsData } from "@/types/files";
import StatsCategoryColumn from "./StatsCategoryColumn";
import PlayerStatsColumn from "./PlayerStatsColumn";
import StatsNameColumn from "./StatsNameColumn";

export default function StatsArray({ statsData }: { statsData: StatsData }) {
    return (
        <div className="flex justify-center items-end w-full h-full pb-4 gap-3">
            <StatsCategoryColumn />
            <StatsNameColumn />
            {statsData.players.map((playerStats, index) => (
                <PlayerStatsColumn key={index} index={index} player={playerStats} />
            ))}
        </div>
    )
}