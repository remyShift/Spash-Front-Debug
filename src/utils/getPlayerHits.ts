import { PlayerHits } from "@/types/files";

export const getPlayerHits = (players: PlayerHits, playerId: string): number[] => {
    return players[playerId]?.hits || [];
}