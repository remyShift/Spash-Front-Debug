import { StatsData } from "@/types/files";
import StatBlock from "./StatBlock";
import StatText from "./StatText";
import { useStore } from "@/context/store";
import { useParams } from "next/navigation";
import StatBlockSpacer from "./StatBlockSpacer";

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
            <StatBlock index={index} isEven={isEven(0)} rowCount={3}>
                <StatText value={`Player ${player.name}`} playerColor={playerNameColor} />
            </StatBlock>

            <StatBlock 
                index={index} 
                isEven={isEven(1)} 
                className="gap-2 pt-2"
                rowCount={4}
            >
                <StatText value={player.positioning.nomansland.score} />
                <StatBlockSpacer />
                <StatText value={player.positioning.attack.score} />
                <StatBlockSpacer />
                <StatText value={player.positioning.defense.score} />
                <StatBlockSpacer />
                <StatText value={player.positioning.score} playerColor={playerNameColor} />
            </StatBlock>

            <StatBlock 
                index={index} 
                isEven={isEven(2)} 
                className="gap-2 overflow-y-auto"
                rowCount={5}
            >
                <StatText value={player.movement.lob_and_go.score} />
                <StatBlockSpacer />
                <StatText value={player.movement.net_taking.score} />
                <StatBlockSpacer />
                <StatText value={player.movement.attack_position.score} />
                <StatBlockSpacer />
                <StatText value={player.movement.hit_and_move.score} />
                <StatBlockSpacer />
                <StatText value={player.movement.score} playerColor={playerNameColor} />
            </StatBlock>

            <StatBlock 
                index={index} 
                isEven={isEven(3)} 
                className="gap-2 overflow-y-auto"
                rowCount={7}
            >
                <StatText value={player.tactical.first_serve.score} />
                <StatBlockSpacer />
                <StatText value={player.tactical.volley_service.score} />
                <StatBlockSpacer />
                <StatText value={player.tactical.services.score} />
                <StatBlockSpacer />
                <StatText value={player.tactical.diagonal.score} />
                <StatBlockSpacer />
                <StatText value={player.tactical.top_lob.score} />
                <StatBlockSpacer />
                <StatText value={player.tactical.divorce_zone.score} />
                <StatBlockSpacer />
                <StatText value={player.tactical.safe_ball.score} />
                <StatBlockSpacer />
                <StatText value={player.tactical.score} playerColor={playerNameColor} />
            </StatBlock>

            <StatBlock index={index} isEven={isEven(4)} className="gap-2 overflow-y-auto" rowCount={3}>
                <StatText value={player.teams.chain_breaks.score} />
                <StatBlockSpacer />
                <StatText value={player.teams.checks.score} />
                <StatBlockSpacer />
                <StatText value={player.teams.score} playerColor={playerNameColor} />
            </StatBlock>

            <StatBlock index={index} isEven={isEven(5)} className="gap-2 overflow-y-auto" rowCount={4}>
                <StatText value={player.physical.distance.score} />
                <StatBlockSpacer />
                <StatText value={player.physical.calories.score} />
                <StatBlockSpacer />
                <StatText value={player.physical.intensities.score} />
                <StatBlockSpacer />
                <StatText value={player.physical.score} playerColor={playerNameColor} />
            </StatBlock>

            <StatBlock index={index} isEven={isEven(6)} className="gap-1 overflow-y-auto" rowCount={3}>
                {player.badges.map((badge, i) => (
                    badge.top_badge ? (
                        <>
                            <StatText key={i} value={badge.value} label={badge.badge_type} />
                        </>
                    ) : null
                ))}
            </StatBlock>

            <StatBlock index={index} isEven={isEven(7)} rowCount={2}>
                <StatText value={player.sentence || "N/A"} />
            </StatBlock>

            <StatBlock index={index} isEven={isEven(7)} rowCount={3}>
                {playerVideo && (
                    <video src={playerVideo} className="w-full h-full object-contain" controls />
                )}
            </StatBlock>
        </div>
    );
}
