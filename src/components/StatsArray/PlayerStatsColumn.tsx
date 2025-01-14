import { StatsData } from "@/types/files";

export default function PlayerStatsColumn({ index, player }: { index: number, player: StatsData["players"][0] }) {
    const playerNameColor = player.name === "A" || player.name === "B" ? "text-primary" : "text-secondary";

    return (
        <div className="flex flex-col gap-3">
            <div className={`w-52 h-28 rounded-lg ${index % 2 === 0 ? "bg-lightBackground" : "bg-lighterBackground"} flex justify-center items-center`}>
                <p className={`text-center text-xl font-semibold ${playerNameColor}`}>Player {player.name}</p>
            </div>

            <div className={`w-52 h-28 rounded-lg ${index % 2 === 1 ? "bg-lightBackground" : "bg-lighterBackground"} flex flex-col justify-center items-center gap-2`}>
                <p className={`text-center font-semibold text-white`}>NoMansLand: {player.positioning.nomansland.score}</p>
                <p className={`text-center font-semibold text-white`}>Attack: {player.positioning.attack.score}</p>
                <p className={`text-center font-semibold text-white`}>Defense: {player.positioning.defense.score}</p>
            </div>

            <div className={`w-52 h-28 rounded-lg ${index % 2 === 0 ? "bg-lightBackground" : "bg-lighterBackground"} flex justify-center items-center`}>
                <p className={`text-center font-semibold text-white`}>{player.score}</p>
            </div>

            <div className={`w-52 h-28 rounded-lg ${index % 2 === 1 ? "bg-lightBackground" : "bg-lighterBackground"} flex justify-center items-center`}>
                <p className={`text-center font-semibold text-white`}>{player.score}</p>
            </div>

            <div className={`w-52 h-28 rounded-lg ${index % 2 === 0 ? "bg-lightBackground" : "bg-lighterBackground"} flex justify-center items-center`}>
                <p className={`text-center font-semibold text-white`}>{player.score}</p>
            </div>

            <div className={`w-52 h-28 rounded-lg ${index % 2 === 1 ? "bg-lightBackground" : "bg-lighterBackground"} flex justify-center items-center`}>
                <p className={`text-center font-semibold text-white`}>{player.score}</p>
            </div>

            <div className={`w-52 h-28 rounded-lg ${index % 2 === 0 ? "bg-lightBackground" : "bg-lighterBackground"} flex justify-center items-center`}>
                <p className={`text-center font-semibold text-white`}>{player.score}</p>
            </div>

            <div className={`w-52 h-28 rounded-lg ${index % 2 === 1 ? "bg-lightBackground" : "bg-lighterBackground"} flex justify-center items-center`}>
                <p className={`text-center font-semibold text-white`}>{player.score}</p>
            </div>

            <div className={`w-52 h-28 rounded-lg ${index % 2 === 0 ? "bg-lightBackground" : "bg-lighterBackground"} flex justify-center items-center`}>
                <p className={`text-center font-semibold text-white`}>{player.score}</p>
            </div>
        </div>
    )
}
