import { PersonTracking } from "@/types/files";
import { configureContext } from "../canvas";
import { getPlayerColor } from "../colors";

const TRAIL_LENGTH = 125;
const MIN_OPACITY = 0.1;

interface TrailPoint {
    x: number;
    y: number;
    frame: number;
}

const playerTrails: { [key: number]: TrailPoint[] } = {};

export const drawPlayerTrajectories = (
    player: PersonTracking,
    currentFrame: number,
    videoWidth: number,
    videoHeight: number,
    context: CanvasRenderingContext2D
): void => {
    const canvas = context.canvas;
    const scaleX = canvas.width / videoWidth;
    const scaleY = canvas.height / videoHeight;

    const [x, y] = player.legs;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    if (!playerTrails[player.id]) {
        playerTrails[player.id] = [];
    }

    playerTrails[player.id].push({
        x: scaledX,
        y: scaledY,
        frame: currentFrame
    });

    playerTrails[player.id] = playerTrails[player.id].filter(
        point => currentFrame - point.frame <= TRAIL_LENGTH
    );

    const trail = playerTrails[player.id];
    if (trail.length < 2) return;

    const playerColor = getPlayerColor(player.id);
    configureContext(context);

    context.beginPath();
    context.moveTo(trail[0].x, trail[0].y);
    context.lineWidth = 3;

    for (let i = 1; i < trail.length; i++) {
        const point = trail[i];
        const progress = (currentFrame - point.frame) / TRAIL_LENGTH;
        const opacity = Math.max(1 - progress, MIN_OPACITY);

        context.strokeStyle = `${playerColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
        context.lineTo(point.x, point.y);
        context.stroke();
        context.beginPath();
        context.moveTo(point.x, point.y);
    }
}
