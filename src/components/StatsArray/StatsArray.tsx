import { StatsData } from "@/types/files";
import StatsNameColumn from "./StatsNameColumn";
import PlayerStatsColumn from "./PlayerStatsColumn";

export default function StatsArray({ statsData }: { statsData: StatsData }) {
    return (
        <div className="flex justify-center items-end w-full h-full pb-4 gap-3">
            <StatsNameColumn />
            {statsData.players.map((playerStats, index) => (
                <PlayerStatsColumn key={index} index={index} player={playerStats} />
            ))}
        </div>
    )
}