import { PersonTracking } from "@/types/files";
import { configureContext } from '../canvas';
import { calculateBoundedDimensions, isValidBBox } from './boundingBox';
import { BoundingBoxDimensions } from '@/types/draw';
import { getPlayerColor } from "../colors";

export const drawSquare = (
    dimensions: BoundingBoxDimensions,
    videoWidth: number,
    videoHeight: number,
    canvasRef: React.RefObject<HTMLCanvasElement | null>
): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const boundedDimensions = calculateBoundedDimensions(dimensions, videoWidth, videoHeight);
    configureContext(ctx);
    ctx.strokeRect(
        boundedDimensions.x,
        boundedDimensions.y,
        boundedDimensions.width,
        boundedDimensions.height
    );
};

export const drawPlayerBBox = (
    player: PersonTracking,
    videoWidth: number,
    videoHeight: number,
    context: CanvasRenderingContext2D
): void => {
    if (!player?.bbox) return;

    const canvas = context.canvas;
    const scaleX = canvas.width / videoWidth;
    const scaleY = canvas.height / videoHeight;

    const [x1, y1, x2, y2] = player.bbox;
    if (!isValidBBox(x1, y1, x2, y2, videoWidth, videoHeight)) return;

    const [, legsY] = player.court_legs;

    const scaledX1 = x1 * scaleX;
    const scaledY1 = y1 * scaleY;
    const scaledX2 = x2 * scaleX;
    const scaledLegsY = legsY * scaleY;

    const boxWidth = Math.abs(scaledX2 - scaledX1);
    const boxHeight = Math.abs(y2 - y1) * scaleY;

    const playerColor = getPlayerColor(player.id);
    configureContext(context, { strokeStyle: playerColor });
    
    context.strokeStyle = playerColor;
    context.strokeRect(scaledX1, scaledY1, boxWidth, boxHeight);
    
    const text = `${player.id} | ${player.name} | ${player.speed_legs?.toFixed(2) || 0}km/h | ${player.confidence.toFixed(2)}`;
    const textMetrics = context.measureText(text);
    const padding = 4;
    const textHeight = 30;

    context.fillStyle = playerColor;
    context.fillRect(
        scaledX1 - 1,
        scaledY1 - textHeight,
        textMetrics.width + (padding * 2),
        textHeight
    );

    context.fillStyle = '#FFFFFF';
    context.textBaseline = 'middle';
    context.textAlign = 'left';
    context.fillText(
        text, 
        scaledX1 + padding - 1,
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
