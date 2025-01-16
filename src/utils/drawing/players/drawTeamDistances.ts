import { PersonTracking } from "@/types/files";
import { drawPlayerDistance } from "./drawPlayerDistance";

export const drawTeamDistances = (
    players: [string, PersonTracking][],
    videoWidth: number,
    videoHeight: number,
    context: CanvasRenderingContext2D
): void => {
    const playersByName = players.reduce((acc, [, player]) => {
        if (player.name) {
            acc[player.name] = player;
        }
        return acc;
    }, {} as Record<string, PersonTracking>);

    if (playersByName['A'] && playersByName['B']) {
        drawPlayerDistance(
            playersByName['A'],
            playersByName['B'],
            videoWidth,
            videoHeight,
            context
        );
    }

    if (playersByName['C'] && playersByName['D']) {
        drawPlayerDistance(
            playersByName['C'],
            playersByName['D'],
            videoWidth,
            videoHeight,
            context
        );
    }
}; 