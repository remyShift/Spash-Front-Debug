import { DrawingConfig } from '@/types/draw';
import { defaultDrawingConfig } from './config';

export const configureContext = (
    ctx: CanvasRenderingContext2D,
    config: Partial<DrawingConfig> = {}
): void => {
    const finalConfig = { ...defaultDrawingConfig, ...config };
    ctx.strokeStyle = finalConfig.strokeStyle;
    ctx.lineWidth = finalConfig.lineWidth;
    ctx.font = finalConfig.font;
};

export const clearCanvas = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
): void => {
    ctx.clearRect(0, 0, width, height);
};