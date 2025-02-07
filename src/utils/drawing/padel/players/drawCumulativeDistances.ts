import { PersonTracking } from "@/types/files";
import { getPlayerColor } from "../../colors";
import { configureContext } from "../../canvas";

export const drawCumulativeDistances = (
    players: [string, PersonTracking][],
    videoWidth: number,
    videoHeight: number,
    context: CanvasRenderingContext2D
): void => {
    configureContext(context);

    const verticalPadding = 20;
    const horizontalPadding = 130;
    const width = 350;
    const height = 250;
    const lineHeight = 45;

    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(horizontalPadding, verticalPadding, width, height);

    context.fillStyle = 'white';
    context.font = 'bold 22px Arial';
    context.textAlign = 'center';
    context.fillText('Cumulative Distances', horizontalPadding + width/2, verticalPadding + 30);

    const filteredPlayers = players
        .filter(([, player]) => player.name)
        .sort(([, a], [, b]) => (a.name || '').localeCompare(b.name || ''));

    filteredPlayers.forEach(([, player], index) => {
        const y = verticalPadding + 70 + (index * lineHeight);
        const distance = player.cumulate_distance?.toFixed(2) || '0';
        
        context.fillStyle = getPlayerColor(player.id);
        context.font = '22px Arial';
        context.textAlign = 'left';
        context.fillText(`${player.name}: ${distance}m`, horizontalPadding + 10, y);
    });
} 