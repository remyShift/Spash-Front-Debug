import { StatsData } from "@/types/files";
import StatBlock from "./StatBlock";
import StatText from "./StatText";
import { useStore } from "@/context/store";
import { useParams } from "next/navigation";

export default function PlayerStatsColumn({ index, player }: { index: number, player: StatsData["players"][0] }) {
    const playerNameColor = player.name === "A" || player.name === "B" ? "text-primary" : "text-green-500";
    const params = useParams();
    const paramsId = params.id;
    const videos = useStore((state) => state.videos);
    const currentFolder = videos.find(v => v.videoPath === decodeURIComponent(paramsId as string));
    const playerVideoPaths = Object.values(currentFolder?.playerVideoPath || {});
    const playerVideo = playerVideoPaths.find(p => p.split("/")[p.split("/").length - 1] === player.video_path);
    const isEven = (blockIndex: number) => (index + blockIndex) % 2 === 0;

    return (
        <div className="flex flex-col justify-start gap-3">
            <StatBlock index={index} isEven={isEven(0)}>
                <StatText value={`Player ${player.name}`} playerColor={playerNameColor} />
            </StatBlock>

            <StatBlock 
                index={index} 
                isEven={isEven(1)} 
                className="gap-2 pt-2"
            >
                <StatText value={player.positioning.nomansland.score} label="NoMansLand" />
                <StatText value={player.positioning.attack.score} label="Attack" />
                <StatText value={player.positioning.defense.score} label="Defense" />
                <StatText value={player.positioning.score} label="Total" playerColor={playerNameColor} />
            </StatBlock>

            <StatBlock 
                index={index} 
                isEven={isEven(2)} 
                className="gap-2 overflow-y-auto"
            >
                <StatText value={player.movement.lob_and_go.score} label="Lob and Go" />
                <StatText value={player.movement.net_taking.score} label="Net Taking" />
                <StatText value={player.movement.attack_position.score} label="Attack Position" />
                <StatText value={player.movement.hit_and_move.score} label="Hit and Move" />
                <StatText value={player.movement.score} label="Total" playerColor={playerNameColor} />
            </StatBlock>

            <StatBlock 
                index={index} 
                isEven={isEven(3)} 
                className="gap-2 overflow-y-auto"
            >
                <StatText value={player.tactical.first_serve.score} label="First Serve" />
                <StatText value={player.tactical.volley_service.score} label="Volley Service" />
                <StatText value={player.tactical.services.score} label="Services" />
                <StatText value={player.tactical.diagonal.score} label="Diagonal" />
                <StatText value={player.tactical.top_lob.score} label="Top Lob" />
                <StatText value={player.tactical.divorce_zone.score} label="Divorce Zone" />
                <StatText value={player.tactical.safe_ball.score} label="Safe Ball" />
                <StatText value={player.tactical.score} label="Total" playerColor={playerNameColor} />
            </StatBlock>

            <StatBlock index={index} isEven={isEven(4)} className="gap-2 overflow-y-auto">
                <StatText value={player.teams.chain_breaks.score} label="Chain Breaks" />
                <StatText value={player.teams.checks.score} label="Checks" />
                <StatText value={player.teams.score} label="Total" playerColor={playerNameColor} />
            </StatBlock>

            <StatBlock index={index} isEven={isEven(5)} className="gap-2 overflow-y-auto">
                <StatText value={player.physical.distance.score} label="Distance" />
                <StatText value={player.physical.calories.score} label="Calories" />
                <StatText value={player.physical.intensities.score} label="Intensities" />
                <StatText value={player.physical.score} label="Total" playerColor={playerNameColor} />
            </StatBlock>

            <StatBlock index={index} isEven={isEven(6)} className="gap-1 overflow-y-auto">
                {player.badges.map((badge, i) => (
                    <StatText key={i} value={badge.value} label={badge.badge_type} />
                ))}
            </StatBlock>

            <StatBlock index={index} isEven={isEven(7)}>
                <StatText value={player.sentence || "N/A"} />
            </StatBlock>

            <StatBlock index={index} isEven={isEven(7)}>
                {playerVideo && (
                    <video src={playerVideo} className="w-full h-full object-contain" controls />
                )}
            </StatBlock>
        </div>
    );
}
