import { PersonTracking } from "@/types/files";
import { configureContext } from "../../canvas";
import { isValidBBox } from "../../boundingBox";

const getFootPlayerColor = (playerClass: number): string => {
    switch (playerClass) {
        case 2:
            return '#00FF00'; // Vert pour la classe 2
        case 3:
            return '#FF0000'; // Rouge pour la classe 3
        default:
            return '#FFFFFF'; // Blanc par défaut
    }
};

export const drawFootPlayerBBox = (
    player: PersonTracking,
    videoWidth: number,
    videoHeight: number,
    context: CanvasRenderingContext2D
): void => {
    console.log('player foot', player);
    if (!player?.bbox) return;

    const canvas = context.canvas;
    const scaleX = canvas.width / videoWidth;
    const scaleY = canvas.height / videoHeight;

    const [x1, y1, x2, y2] = player.bbox;
    if (!isValidBBox(x1, y1, x2, y2, videoWidth, videoHeight)) return;

    const [, legsY] = player.player_legs || [0, 0];

    const scaledX1 = x1 * scaleX;
    const scaledY1 = y1 * scaleY;
    const scaledX2 = x2 * scaleX;
    const scaledLegsY = legsY * scaleY;

    const boxWidth = Math.abs(scaledX2 - scaledX1);
    const boxHeight = Math.abs(y2 - y1) * scaleY;

    if (!player.class) return;
    const playerColor = getFootPlayerColor(player.class);
    configureContext(context, { strokeStyle: playerColor });
    
    context.strokeStyle = playerColor;
    context.strokeRect(scaledX1, scaledY1, boxWidth, boxHeight);
    
    const text = `${player.id} | ${player.class} | ${player.confidence.toFixed(2)}`;
    const textMetrics = context.measureText(text);
    const padding = 4;
    const textHeight = 20;

    context.fillStyle = playerColor;
    context.fillRect(
        scaledX1 - 1,
        scaledY1 - textHeight,
        textMetrics.width + (padding * 2),
        textHeight
    );

    context.font = '12px Arial';
    context.fillStyle = '#000000';
    context.textBaseline = 'middle';
    context.textAlign = 'left';
    context.fillText(
        text, 
        scaledX1 + padding,
        scaledY1 - (textHeight / 2)
    );

    const centerX = scaledX1 + (boxWidth / 2);
    const bottomY = scaledLegsY;

    context.beginPath();
    context.arc(centerX, bottomY, 5, 0, 2 * Math.PI);
    context.fillStyle = playerColor;
    context.fill();
    context.closePath();
};
