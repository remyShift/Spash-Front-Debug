import { PersonTracking } from "@/types/files";
import { configureContext, clearCanvas } from './canvas';
import { calculateBoundedDimensions, isValidBBox } from './boundingBox';
import { BoundingBoxDimensions } from '@/types/draw';

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

    clearCanvas(ctx, canvas.width, canvas.height);
    
    const boundedDimensions = calculateBoundedDimensions(dimensions, videoWidth, videoHeight);
    configureContext(ctx);
    ctx.strokeRect(
        boundedDimensions.x,
        boundedDimensions.y,
        boundedDimensions.width,
        boundedDimensions.height
    );
};

export const generateSquareParams = (
    videoWidth: number,
    videoHeight: number
): BoundingBoxDimensions => {
    const squareSize = 100;
    return {
        x: Math.floor(Math.random() * (videoWidth - squareSize)),
        y: Math.floor(Math.random() * (videoHeight - squareSize)),
        width: squareSize,
        height: squareSize
    };
};

export const drawPlayerBBox = (
    personCoordinates: PersonTracking,
    videoWidth: number,
    videoHeight: number,
    context: CanvasRenderingContext2D
): void => {
    if (!personCoordinates?.bbox) return;

    const [x, y, width, height] = personCoordinates.bbox;
    if (!isValidBBox(x, y, width, height, videoWidth, videoHeight)) return;

    const boxWidth = width - x;
    const boxHeight = height - y;

    configureContext(context);
    context.strokeRect(x, y, boxWidth, boxHeight);
    context.fillText(`Player ${personCoordinates.id}`, x, y - 5);
};

export const drawFrameNumber = (
    frameNumber: number,
    context: CanvasRenderingContext2D,
    allFrames: number
): void => {
    configureContext(context, { 
        strokeStyle: '#000000'
    });
    context.fillText(`Frame ${frameNumber}`, 10, 20);
    context.fillText(`${allFrames}`, 10, 40);
};