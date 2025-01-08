import { DrawingConfig } from '@/types/draw';
import { configureContext } from './canvas';

export const drawFramesNumber = (
    frameNumber: number,
    context: CanvasRenderingContext2D,
    allFrames: number,
    config: DrawingConfig
): void => {
    configureContext(context, config);
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, 150, 50);
    context.fillStyle = config.strokeStyle;
    context.fillText(`Frame ${frameNumber}`, 10, 20);
    context.fillText(`${allFrames}`, 10, 40);
};
