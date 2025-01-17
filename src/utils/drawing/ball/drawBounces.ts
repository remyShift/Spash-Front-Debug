import { BallLayer } from "@/types/layers";
import { configureContext } from "../canvas";

const BOUNCE_GLOW_DURATION = 10;
const BOUNCE_GLOW_INTENSITY = 15;
const MAX_ACTIVE_BOUNCES = 1;

interface ActiveBounce {
    startFrame: number;
    endFrame: number;
}

const activeBounces: ActiveBounce[] = [];

export const drawBounceGlow = (
    ball: BallLayer,
    currentFrame: number,
    videoWidth: number,
    videoHeight: number,
    context: CanvasRenderingContext2D
) => {
    const expiredIndex = activeBounces.findIndex(bounce => bounce.endFrame < currentFrame);
    if (expiredIndex !== -1) {
        activeBounces.splice(expiredIndex, 1);
    }

    if (ball.rebound) {
        if (activeBounces.length >= MAX_ACTIVE_BOUNCES) {
            activeBounces.shift();
        }

        const existingBounce = activeBounces.find(bounce => 
            bounce.startFrame + BOUNCE_GLOW_DURATION > currentFrame
        );

        if (!existingBounce) {
            activeBounces.push({
                startFrame: currentFrame,
                endFrame: currentFrame + BOUNCE_GLOW_DURATION
            });
        }
    }

    const activeBounce = activeBounces[0];
    if (!activeBounce) return;

    const canvas = context.canvas;
    const scaleX = canvas.width / videoWidth;
    const scaleY = canvas.height / videoHeight;

    const [x, y] = ball.coordinates;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    const timeUntilEnd = activeBounce.endFrame - currentFrame;
    const fadeOutDuration = 5;
    
    let alpha = 1;
    if (timeUntilEnd < fadeOutDuration) {
        alpha = timeUntilEnd / fadeOutDuration;
    }
    
    alpha = Math.max(0.3, alpha);
    
    context.save();
    
    const bounceColor = '#00FF00';
    context.shadowColor = bounceColor;
    context.shadowBlur = BOUNCE_GLOW_INTENSITY * alpha;
    context.strokeStyle = `${bounceColor}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
    context.lineWidth = 4;
    
    configureContext(context, { strokeStyle: context.strokeStyle, lineWidth: context.lineWidth });
    
    context.beginPath();
    context.arc(scaledX, scaledY, 15, 0, 2 * Math.PI);
    context.stroke();

    context.restore();
};
