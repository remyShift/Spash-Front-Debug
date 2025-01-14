import { PersonTracking } from "@/types/files";
import { calculateDistance } from "@/utils/calculateDistance";

export const drawPlayerDistance = (
    player1: PersonTracking,
    player2: PersonTracking,
    videoWidth: number,
    videoHeight: number,
    context: CanvasRenderingContext2D
): void => {
    const canvas = context.canvas;
    const scaleX = canvas.width / videoWidth;
    const scaleY = canvas.height / videoHeight;

    const [x1, y1] = player1.player_legs;
    const [x2, y2] = player2.player_legs;

    const scaledX1 = x1 * scaleX;
    const scaledY1 = y1 * scaleY;
    const scaledX2 = x2 * scaleX;
    const scaledY2 = y2 * scaleY;

    const realDistance = calculateDistance(player1.court_legs, player2.court_legs);

    context.beginPath();
    context.moveTo(scaledX1, scaledY1);
    context.lineTo(scaledX2, scaledY2);
    context.strokeStyle = '#FFFFFF';
    context.setLineDash([5, 5]);
    context.stroke();
    context.setLineDash([]);

    const centerX = (scaledX1 + scaledX2) / 2;
    const centerY = (scaledY1 + scaledY2) / 2;

    context.font = 'bold 22px Arial';
    context.fillStyle = '#000000';
    context.textAlign = 'center';
    context.fillText(`${realDistance.toFixed(2)}m`, centerX, centerY - 10);
};
