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
    personCoordinates: PersonTracking,
    videoWidth: number,
    videoHeight: number,
    context: CanvasRenderingContext2D
): void => {
    if (!personCoordinates?.bbox) return;

    const canvas = context.canvas;
    const scaleX = canvas.width / videoWidth;
    const scaleY = canvas.height / videoHeight;

    const [x1, y1, x2, y2] = personCoordinates.bbox;
    if (!isValidBBox(x1, y1, x2, y2, videoWidth, videoHeight)) return;

    const [, legsY] = personCoordinates.legs;

    const scaledX1 = x1 * scaleX;
    const scaledY1 = y1 * scaleY;
    const scaledX2 = x2 * scaleX;
    const scaledLegsY = legsY * scaleY;

    const boxWidth = Math.abs(scaledX2 - scaledX1);
    const boxHeight = Math.abs(scaledLegsY - scaledY1);

    const playerColor = getPlayerColor(personCoordinates.id);
    configureContext(context, { strokeStyle: playerColor });
    
    context.strokeRect(scaledX1, scaledY1, boxWidth, boxHeight);
    context.fillStyle = playerColor;
    context.fillText(`Player ${personCoordinates.id}`, scaledX1, scaledY1 - 5);

    const centerX = scaledX1 + (boxWidth / 2);
    const bottomY = scaledLegsY;

    context.beginPath();
    context.arc(centerX, bottomY, 5, 0, 2 * Math.PI);
    context.fillStyle = playerColor;
    context.fill();
    context.closePath();
};
