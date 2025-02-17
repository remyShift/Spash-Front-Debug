import { DrawingConfig } from '@/types/draw';
import { defaultDrawingConfig } from './config';

export const configureContext = (
    ctx: CanvasRenderingContext2D | null,
    config: Partial<DrawingConfig> = {}
): void => {
    if (!ctx || typeof ctx !== 'object') return;
    
    const finalConfig = { ...defaultDrawingConfig, ...config };
    
    if (ctx instanceof CanvasRenderingContext2D) {
        ctx.strokeStyle = finalConfig.strokeStyle;
        ctx.lineWidth = finalConfig.lineWidth;
        ctx.font = finalConfig.font;
    }
};

export const clearCanvas = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
): void => {
    ctx.clearRect(0, 0, width, height);
};